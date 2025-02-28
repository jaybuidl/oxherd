import React, { useState } from "react";
import { isValidEthereumAddress } from "@/lib/addressBookStorage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddressDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSave?: (address: { address: string; label: string }) => void;
  initialData?: { address: string; label: string };
  isEditing?: boolean;
}

const AddressDialog = ({
  open = true,
  onOpenChange,
  onSave,
  initialData = { address: "", label: "" },
  isEditing = false,
}: AddressDialogProps) => {
  const [address, setAddress] = useState(initialData.address);
  const [label, setLabel] = useState(initialData.label);
  const [addressError, setAddressError] = useState("");
  const [labelError, setLabelError] = useState("");

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setAddressError("");
    setLabelError("");

    // Validate address
    if (!address.trim()) {
      setAddressError("Address is required");
      isValid = false;
    } else if (!isValidEthereumAddress(address)) {
      setAddressError("Invalid Ethereum address format");
      isValid = false;
    }

    // Validate label
    if (!label.trim()) {
      setLabelError("Label is required");
      isValid = false;
    }

    return isValid;
  };

  const handleSave = () => {
    if (validateForm()) {
      if (onSave) {
        onSave({ address, label });
      }
      if (onOpenChange) {
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {isEditing ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="eth-address">Ethereum Address</Label>
            <Input
              id="eth-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className={addressError ? "border-red-500" : ""}
            />
            {addressError && (
              <p className="text-sm text-red-500">{addressError}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address-label">Label</Label>
            <Input
              id="address-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="My Wallet"
              className={labelError ? "border-red-500" : ""}
            />
            {labelError && <p className="text-sm text-red-500">{labelError}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button onClick={handleSave}>{isEditing ? "Update" : "Add"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddressDialog;
