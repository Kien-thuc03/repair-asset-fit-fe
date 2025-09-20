import { ComponentType, ComponentStatus } from "@/types";

// Interface cho computer component dựa trên database-sync.json
export interface ComputerComponent {
  id: string;
  computerAssetId: string; // FK to assets.id
  componentType: ComponentType;
  name: string;
  componentSpecs: string;
  serialNumber?: string;
  status: ComponentStatus;
  installedAt: string;
  removedAt?: string;
  notes?: string;
}

// Computer Components data - Synchronized with database-sync.json
export const mockComputerComponents: ComputerComponent[] = [
  // ASSET001 Components
  {
    id: "CC001",
    computerAssetId: "ASSET001",
    componentType: "CPU" as ComponentType,
    name: "Intel Core i5-12400",
    componentSpecs: "6 cores, 12 threads, 2.5GHz base, 4.4GHz boost",
    serialNumber: "CPU001",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-01-15T08:00:00Z",
    notes: "Original CPU, working perfectly"
  },
  {
    id: "CC002",
    computerAssetId: "ASSET001",
    componentType: "RAM" as ComponentType,
    name: "Kingston Fury Beast DDR4",
    componentSpecs: "16GB 3200MHz DDR4",
    serialNumber: "RAM001",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-01-15T08:00:00Z",
    notes: "High-performance RAM module"
  },
  {
    id: "CC003",
    computerAssetId: "ASSET001",
    componentType: "STORAGE" as ComponentType,
    name: "Samsung 980 SSD",
    componentSpecs: "512GB NVMe M.2 PCIe 3.0",
    serialNumber: "SSD001",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-01-15T08:00:00Z",
    notes: "Primary storage drive"
  },
  {
    id: "CC004",
    computerAssetId: "ASSET001",
    componentType: "MOTHERBOARD" as ComponentType,
    name: "Dell OptiPlex 3080 Motherboard",
    componentSpecs: "Intel B460 chipset, Micro ATX",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-01-15T08:00:00Z",
    notes: "OEM motherboard"
  },
  {
    id: "CC005",
    computerAssetId: "ASSET001",
    componentType: "PSU" as ComponentType,
    name: "Dell 200W PSU",
    componentSpecs: "200W 80+ Bronze certified",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-01-15T08:00:00Z",
    notes: "OEM power supply unit"
  },
  {
    id: "CC006",
    computerAssetId: "ASSET001",
    componentType: "MONITOR" as ComponentType,
    name: "Dell P2214H",
    componentSpecs: "22 inch 1920x1080 LED IPS",
    serialNumber: "MON001",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-01-15T08:00:00Z",
    notes: "Primary display monitor"
  },
  {
    id: "CC007",
    computerAssetId: "ASSET001",
    componentType: "KEYBOARD" as ComponentType,
    name: "Dell KB216",
    componentSpecs: "USB Wired Standard Keyboard",
    serialNumber: "KB001",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-01-15T08:00:00Z",
    notes: "Standard Dell keyboard"
  },
  {
    id: "CC008",
    computerAssetId: "ASSET001",
    componentType: "MOUSE" as ComponentType,
    name: "Dell MS116",
    componentSpecs: "USB Optical Mouse 1000 DPI",
    serialNumber: "MS001",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-01-15T08:00:00Z",
    notes: "Standard optical mouse"
  },

  // ASSET002 Components
  {
    id: "CC011",
    computerAssetId: "ASSET002",
    componentType: "CPU" as ComponentType,
    name: "Intel Core i5-12400",
    componentSpecs: "6 cores, 12 threads, 2.5GHz base, 4.4GHz boost",
    serialNumber: "CPU002",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-01-15T08:00:00Z",
    notes: "CPU running normally"
  },
  {
    id: "CC012",
    computerAssetId: "ASSET002",
    componentType: "RAM" as ComponentType,
    name: "Kingston Fury Beast DDR4",
    componentSpecs: "16GB 3200MHz DDR4",
    serialNumber: "RAM002",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-01-15T08:00:00Z",
    notes: "Memory working properly"
  },
  {
    id: "CC013",
    computerAssetId: "ASSET002",
    componentType: "STORAGE" as ComponentType,
    name: "Samsung 980 SSD",
    componentSpecs: "512GB NVMe M.2 PCIe 3.0",
    serialNumber: "SSD002",
    status: "FAULTY" as ComponentStatus,
    installedAt: "2023-01-15T08:00:00Z",
    notes: "SSD showing bad sectors, needs replacement"
  },

  // ASSET003 Components
  {
    id: "CC021",
    computerAssetId: "ASSET003",
    componentType: "CPU" as ComponentType,
    name: "Intel Core i3-12100",
    componentSpecs: "4 cores, 8 threads, 3.3GHz base, 4.3GHz boost",
    serialNumber: "CPU003",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-03-20T09:15:00Z",
    notes: "Entry-level CPU, adequate performance"
  },
  {
    id: "CC022",
    computerAssetId: "ASSET003",
    componentType: "RAM" as ComponentType,
    name: "Crucial DDR4",
    componentSpecs: "8GB 2666MHz DDR4",
    serialNumber: "RAM003",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-03-20T09:15:00Z",
    notes: "Standard capacity RAM"
  },
  {
    id: "CC023",
    computerAssetId: "ASSET003",
    componentType: "STORAGE" as ComponentType,
    name: "WD Blue SSD",
    componentSpecs: "256GB SATA III 2.5 inch",
    serialNumber: "SSD003",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-03-20T09:15:00Z",
    notes: "Standard SATA SSD, good performance"
  },
  {
    id: "CC024",
    computerAssetId: "ASSET003",
    componentType: "MONITOR" as ComponentType,
    name: "HP P22v G4",
    componentSpecs: "21.5 inch 1920x1080 IPS",
    serialNumber: "MON003",
    status: "FAULTY" as ComponentStatus,
    installedAt: "2023-03-20T09:15:00Z",
    notes: "Monitor flickering, possible backlight issue"
  },

  // ASSET004 Components
  {
    id: "CC031",
    computerAssetId: "ASSET004",
    componentType: "CPU" as ComponentType,
    name: "Intel Core i5-11400",
    componentSpecs: "6 cores, 12 threads, 2.6GHz base, 4.4GHz boost",
    serialNumber: "CPU004",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-02-10T08:30:00Z",
    notes: "11th gen Intel processor"
  },

  // ASSET005 Components
  {
    id: "CC032",
    computerAssetId: "ASSET005",
    componentType: "CPU" as ComponentType,
    name: "Intel Core i3-11100",
    componentSpecs: "4 cores, 8 threads, 3.6GHz base, 4.2GHz boost",
    serialNumber: "CPU005",
    status: "FAULTY" as ComponentStatus,
    installedAt: "2023-04-05T07:45:00Z",
    notes: "CPU undergoing thermal paste replacement"
  },

  // ASSET006 Components
  {
    id: "CC033",
    computerAssetId: "ASSET006",
    componentType: "CPU" as ComponentType,
    name: "AMD Ryzen 5 5600G",
    componentSpecs: "6 cores, 12 threads, 3.9GHz base, 4.4GHz boost",
    serialNumber: "CPU006",
    status: "INSTALLED" as ComponentStatus,
    installedAt: "2023-05-12T09:00:00Z",
    notes: "AMD processor with integrated graphics"
  },
];