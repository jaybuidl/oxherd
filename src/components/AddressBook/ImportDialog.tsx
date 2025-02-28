import React, { useState } from "react";
import { Upload } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ImportFormat {
  id: string;
  name: string;
  description: string;
  placeholder: string;
}

interface ImportDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onImport?: (data: string, format: string) => void;
}

const ImportDialog = ({
  open = true,
  onOpenChange,
  onImport,
}: ImportDialogProps) => {
  const [selectedFormat, setSelectedFormat] = useState<string>("safe-csv");
  const [importData, setImportData] = useState<string>("");
  const [fileUploaded, setFileUploaded] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const importFormats: ImportFormat[] = [
    {
      id: "safe-csv",
      name: "Safe CSV",
      description: "Import from Safe wallet CSV format (name,address)",
      placeholder:
        "name,address\nMy Wallet,0x1234567890abcdef1234567890abcdef12345678\nExchange,0xabcdef1234567890abcdef1234567890abcdef12",
    },
    {
      id: "standard-csv",
      name: "Standard CSV",
      description: "Import from standard CSV format (address,label)",
      placeholder:
        "address,label\n0x1234567890abcdef1234567890abcdef12345678,My Wallet\n0xabcdef1234567890abcdef1234567890abcdef12,Exchange",
    },
    {
      id: "json",
      name: "JSON",
      description: "Import from JSON format",
      placeholder:
        '[{"address":"0x1234567890abcdef1234567890abcdef12345678","label":"My Wallet"},{"address":"0xabcdef1234567890abcdef1234567890abcdef12","label":"Exchange"}]',
    },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
      setFileUploaded(true);
    };
    reader.readAsText(file);
  };

  const validateImport = (): boolean => {
    setError("");
    if (!importData.trim()) {
      setError("Please enter or upload data to import");
      return false;
    }

    try {
      if (selectedFormat === "json") {
        const parsed = JSON.parse(importData);
        if (!Array.isArray(parsed)) {
          setError("JSON data must be an array of address objects");
          return false;
        }
      } else if (selectedFormat.includes("csv")) {
        const lines = importData.split("\n");
        if (lines.length < 2) {
          setError("CSV must include a header row and at least one data row");
          return false;
        }
      }
      return true;
    } catch (e) {
      setError(`Invalid ${selectedFormat} format: ${e.message}`);
      return false;
    }
  };

  const handleImport = () => {
    if (validateImport()) {
      if (onImport) {
        onImport(importData, selectedFormat);
      } else {
        console.log(`Importing data in ${selectedFormat} format`);
      }
      if (onOpenChange) {
        onOpenChange(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Import Addresses
          </DialogTitle>
          <DialogDescription>
            Import Ethereum addresses from a file or paste them directly
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <RadioGroup
            value={selectedFormat}
            onValueChange={setSelectedFormat}
            className="space-y-3"
          >
            {importFormats.map((format) => (
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

          <div className="space-y-2">
            <Label htmlFor="import-data">Paste data or upload a file</Label>
            <Textarea
              id="import-data"
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder={
                importFormats.find((f) => f.id === selectedFormat)?.placeholder
              }
              className="h-32 font-mono text-sm"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => document.getElementById("file-upload")?.click()}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {fileUploaded ? "Change File" : "Upload File"}
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.json,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
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
          <Button onClick={handleImport} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
