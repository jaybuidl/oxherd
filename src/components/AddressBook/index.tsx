import React, { useState, useEffect } from "react";
import AddressBookHeader from "./AddressBookHeader";
import AddressTable from "./AddressTable";
import AddressDialog from "./AddressDialog";
import ImportDialog from "./ImportDialog";
import ExportDialog from "./ExportDialog";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  importAddresses,
  AddressEntry,
} from "@/lib/addressBookStorage";

const AddressBook = () => {
  const [addresses, setAddresses] = useState<AddressEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressEntry | null>(
    null,
  );
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [addressLabelToDelete, setAddressLabelToDelete] = useState<string>("");

  // Load addresses from local storage on component mount
  useEffect(() => {
    setAddresses(getAddresses());
  }, []);

  const handleSearch = (searchTerm: string) => {
    setSearchQuery(searchTerm);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddDialog(true);
  };

  const handleEditAddress = (address: AddressEntry) => {
    setEditingAddress(address);
    setShowAddDialog(true);
  };

  const handleDeleteAddress = (id: string, label: string = "this address") => {
    setAddressToDelete(id);
    setAddressLabelToDelete(label);
    setShowDeleteDialog(true);
  };

  const confirmDeleteAddress = () => {
    if (addressToDelete) {
      deleteAddress(addressToDelete);
      setAddresses(getAddresses());
      setShowDeleteDialog(false);
      setAddressToDelete(null);
    }
  };

  const handleSaveAddress = (addressData: {
    address: string;
    label: string;
  }) => {
    if (editingAddress) {
      // Update existing address
      updateAddress(editingAddress.id, addressData);
    } else {
      // Add new address
      addAddress(addressData);
    }

    // Refresh addresses from storage
    setAddresses(getAddresses());
    setShowAddDialog(false);
    setEditingAddress(null);
  };

  const handleImport = (data: string, format: string) => {
    importAddresses(data, format as "safe-csv" | "standard-csv" | "json");
    setAddresses(getAddresses());
    setShowImportDialog(false);
  };

  const handleExport = (format: string) => {
    // Export functionality is handled in the ExportDialog component
    setShowExportDialog(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AddressBookHeader
        onSearch={handleSearch}
        onAddAddress={handleAddAddress}
        onImport={() => setShowImportDialog(true)}
        onExport={() => setShowExportDialog(true)}
      />

      <div className="flex-1 p-4 overflow-auto">
        <AddressTable
          addresses={addresses}
          searchQuery={searchQuery}
          onEdit={handleEditAddress}
          onDelete={(id) => {
            const address = addresses.find((a) => a.id === id);
            handleDeleteAddress(id, address?.label);
          }}
        />
      </div>

      {/* Dialogs */}
      {showAddDialog && (
        <AddressDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSave={handleSaveAddress}
          initialData={
            editingAddress
              ? { address: editingAddress.address, label: editingAddress.label }
              : undefined
          }
          isEditing={!!editingAddress}
        />
      )}

      {showImportDialog && (
        <ImportDialog
          open={showImportDialog}
          onOpenChange={setShowImportDialog}
          onImport={handleImport}
        />
      )}

      {showExportDialog && (
        <ExportDialog
          open={showExportDialog}
          onOpenChange={setShowExportDialog}
          onExport={handleExport}
          addresses={addresses}
        />
      )}

      {showDeleteDialog && (
        <DeleteConfirmDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={confirmDeleteAddress}
          addressLabel={addressLabelToDelete}
        />
      )}
    </div>
  );
};

export default AddressBook;
