import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogTrigger } from "../ui/dialog";
import { Search, Plus, Download, Upload } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";

interface AddressBookHeaderProps {
  onSearch?: (searchTerm: string) => void;
  onAddAddress?: () => void;
  onImport?: () => void;
  onExport?: () => void;
}

const AddressBookHeader = ({
  onSearch = () => {},
  onAddAddress = () => {},
  onImport = () => {},
  onExport = () => {},
}: AddressBookHeaderProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="w-full bg-background p-4 border-b">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Ethereum Address Book</h1>
        </div>
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search addresses or labels..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
          <ThemeToggle />
          <div className="flex space-x-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={onAddAddress} className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </DialogTrigger>
              {/* AddressDialog component will be rendered here */}
            </Dialog>

            <Dialog
              open={isImportDialogOpen}
              onOpenChange={setIsImportDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={onImport}
                  variant="outline"
                  className="flex items-center"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </DialogTrigger>
              {/* ImportDialog component will be rendered here */}
            </Dialog>

            <Dialog
              open={isExportDialogOpen}
              onOpenChange={setIsExportDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={onExport}
                  variant="outline"
                  className="flex items-center"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DialogTrigger>
              {/* ExportDialog component will be rendered here */}
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressBookHeader;
