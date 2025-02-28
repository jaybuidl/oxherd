import React, { useState } from "react";
import { Download } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ExportFormat {
  id: string;
  name: string;
  description: string;
}

interface ExportDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onExport?: (format: string) => void;
  addresses?: Array<{ address: string; label: string }>;
}

const ExportDialog = ({
  open = true,
  onOpenChange,
  onExport,
  addresses = [
    {
      address: "0x1234567890abcdef1234567890abcdef12345678",
      label: "My Wallet",
    },
    {
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      label: "Exchange",
    },
    {
      address: "0x7890abcdef1234567890abcdef1234567890abcd",
      label: "DeFi Protocol",
    },
  ],
}: ExportDialogProps) => {
  const [selectedFormat, setSelectedFormat] = useState<string>("safe-csv");

  const exportFormats: ExportFormat[] = [
    {
      id: "safe-csv",
      name: "Safe CSV",
      description: "Export in Safe wallet compatible CSV format",
    },
    {
      id: "standard-csv",
      name: "Standard CSV",
      description: "Export as standard CSV file with address and label columns",
    },
    {
      id: "json",
      name: "JSON",
      description: "Export as JSON file for programmatic use",
    },
  ];

  const handleExport = () => {
    if (onExport) {
      onExport(selectedFormat);
    } else {
      // Default export functionality if no handler provided
      console.log(
        `Exporting ${addresses.length} addresses in ${selectedFormat} format`,
      );

      // Mock export functionality
      let content = "";
      let filename = "";

      if (selectedFormat === "safe-csv") {
        content =
          "name,address\n" +
          addresses.map((addr) => `${addr.label},${addr.address}`).join("\n");
        filename = "safe-addresses.csv";
      } else if (selectedFormat === "standard-csv") {
        content =
          "address,label\n" +
          addresses.map((addr) => `${addr.address},${addr.label}`).join("\n");
        filename = "ethereum-addresses.csv";
      } else if (selectedFormat === "json") {
        content = JSON.stringify(addresses, null, 2);
        filename = "ethereum-addresses.json";
      }

      // Create and download the file
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    // Close the dialog after export
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Export Addresses
          </DialogTitle>
          <DialogDescription>
            Choose a format to export your {addresses.length} Ethereum addresses
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup
            value={selectedFormat}
            onValueChange={setSelectedFormat}
            className="space-y-3"
          >
            {exportFormats.map((format) => (
              <div
                key={format.id}
                className="flex items-start space-x-3 rounded-md border p-3 hover:bg-slate-50"
              >
                <RadioGroupItem
                  value={format.id}
                  id={format.id}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label
                    htmlFor={format.id}
                    className="block text-sm font-medium cursor-pointer"
                  >
                    {format.name}
                  </label>
                  <p className="text-sm text-gray-500">{format.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
