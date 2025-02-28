import React, { useState } from "react";
import { Edit, Trash2, Copy, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface AddressEntry {
  id: string;
  address: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

interface AddressTableProps {
  addresses?: AddressEntry[];
  onEdit?: (address: AddressEntry) => void;
  onDelete?: (id: string) => void;
  searchQuery?: string;
}

const AddressTable = ({
  addresses = [
    {
      id: "1",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      label: "Vitalik Buterin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      label: "Ethereum Foundation",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      address: "0x1234567890123456789012345678901234567890",
      label: "My Trading Wallet",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  onEdit = () => {},
  onDelete = () => {},
  searchQuery = "",
}: AddressTableProps) => {
  const [editingAddress, setEditingAddress] = useState<AddressEntry | null>(
    null,
  );
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Filter addresses based on search query
  const filteredAddresses = addresses.filter(
    (address) =>
      address.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      address.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleEdit = (address: AddressEntry) => {
    setEditingAddress(address);
    setShowEditDialog(true);
  };

  const handleDelete = (id: string) => {
    setAddressToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (addressToDelete) {
      onDelete(addressToDelete);
      setAddressToDelete(null);
      setShowDeleteDialog(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const truncateAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const openEtherscan = (address: string) => {
    window.open(`https://etherscan.io/address/${address}`, "_blank");
  };

  return (
    <div className="w-full bg-background rounded-md shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Label</TableHead>
            <TableHead className="w-1/3">Ethereum Address</TableHead>
            <TableHead className="w-1/6">Last Updated</TableHead>
            <TableHead className="w-1/6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAddresses.length > 0 ? (
            filteredAddresses.map((address) => (
              <TableRow key={address.id}>
                <TableCell className="font-medium">{address.label}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono">
                      {truncateAddress(address.address)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(address.address)}
                      title="Copy address"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEtherscan(address.address)}
                      title="View on Etherscan"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(address.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(address)}
                      title="Edit address"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(address.id)}
                      title="Delete address"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                {searchQuery
                  ? "No addresses match your search"
                  : "No addresses found. Add one to get started."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Edit Address Dialog - Using built-in Dialog component instead of importing AddressDialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit Address" : "Add Address"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4 space-y-4">
                <p>Address editing form would go here</p>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowEditDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (editingAddress) {
                        onEdit(editingAddress);
                      }
                      setShowEditDialog(false);
                      setEditingAddress(null);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog - Using built-in AlertDialog instead of importing DeleteConfirmDialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              address from your address book.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setAddressToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddressTable;
