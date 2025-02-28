// Types for address book entries
export interface AddressEntry {
  id: string;
  address: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

// Local storage key
const STORAGE_KEY = "ethereum-address-book";

// Get all addresses from local storage
export const getAddresses = (): AddressEntry[] => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error("Error retrieving addresses from storage:", error);
    return [];
  }
};

// Save all addresses to local storage
export const saveAddresses = (addresses: AddressEntry[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  } catch (error) {
    console.error("Error saving addresses to storage:", error);
  }
};

// Add a new address
export const addAddress = (
  address: Omit<AddressEntry, "id" | "createdAt" | "updatedAt">,
): AddressEntry => {
  const addresses = getAddresses();
  const now = new Date().toISOString();

  const newAddress: AddressEntry = {
    id: crypto.randomUUID(),
    address: address.address,
    label: address.label,
    createdAt: now,
    updatedAt: now,
  };

  addresses.push(newAddress);
  saveAddresses(addresses);

  return newAddress;
};

// Update an existing address
export const updateAddress = (
  id: string,
  updates: Partial<Omit<AddressEntry, "id" | "createdAt" | "updatedAt">>,
): AddressEntry | null => {
  const addresses = getAddresses();
  const index = addresses.findIndex((addr) => addr.id === id);

  if (index === -1) return null;

  const updatedAddress = {
    ...addresses[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  addresses[index] = updatedAddress;
  saveAddresses(addresses);

  return updatedAddress;
};

// Delete an address
export const deleteAddress = (id: string): boolean => {
  const addresses = getAddresses();
  const filteredAddresses = addresses.filter((addr) => addr.id !== id);

  if (filteredAddresses.length === addresses.length) {
    return false; // No address was deleted
  }

  saveAddresses(filteredAddresses);
  return true;
};

// Import addresses from various formats
export const importAddresses = (
  data: string,
  format: "safe-csv" | "standard-csv" | "json",
): AddressEntry[] => {
  try {
    let importedAddresses: Array<{ address: string; label: string }> = [];

    if (format === "json") {
      const parsed = JSON.parse(data);
      importedAddresses = Array.isArray(parsed) ? parsed : [];
    } else if (format === "safe-csv") {
      // Safe CSV format: name,address
      importedAddresses = parseCSV(data, ["label", "address"]);
    } else if (format === "standard-csv") {
      // Standard CSV format: address,label
      importedAddresses = parseCSV(data, ["address", "label"]);
    }

    // Add all imported addresses
    const existingAddresses = getAddresses();
    const now = new Date().toISOString();

    const newAddresses = importedAddresses.map((addr) => ({
      id: crypto.randomUUID(),
      address: addr.address,
      label: addr.label,
      createdAt: now,
      updatedAt: now,
    }));

    saveAddresses([...existingAddresses, ...newAddresses]);
    return newAddresses;
  } catch (error) {
    console.error("Error importing addresses:", error);
    return [];
  }
};

// Helper function to parse CSV data
const parseCSV = (
  data: string,
  columnOrder: ["label", "address"] | ["address", "label"],
): Array<{ address: string; label: string }> => {
  const lines = data.split("\n");
  const result: Array<{ address: string; label: string }> = [];

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(",");
    if (values.length < 2) continue;

    if (columnOrder[0] === "label") {
      result.push({
        label: values[0].trim(),
        address: values[1].trim(),
      });
    } else {
      result.push({
        address: values[0].trim(),
        label: values[1].trim(),
      });
    }
  }

  return result;
};

// Validate Ethereum address format
export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};
