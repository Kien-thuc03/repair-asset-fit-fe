import { Component, ComponentType, ComponentStatus } from '@/types'

// Mock components data - Synchronized with database ComputerComponents table
export const mockComponents: Component[] = [
  // ASSET001 - PC Dell OptiPlex 3080 (19-0205/01)
  {
    id: "CC001",
    computerAssetId: "ASSET001",
    componentType: ComponentType.CPU,
    name: "Intel Core i5-12400",
    componentSpecs: "6 cores, 12 threads, 2.5GHz base, 4.4GHz boost",
    serialNumber: "CPU001",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "Original CPU, working perfectly"
  },
  {
    id: "CC002",
    computerAssetId: "ASSET001",
    componentType: ComponentType.RAM,
    name: "Kingston Fury Beast DDR4",
    componentSpecs: "16GB 3200MHz DDR4",
    serialNumber: "RAM001",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "High-performance RAM module"
  },
  {
    id: "CC003",
    computerAssetId: "ASSET001",
    componentType: ComponentType.STORAGE,
    name: "Samsung 980 SSD",
    componentSpecs: "512GB NVMe M.2 PCIe 3.0",
    serialNumber: "SSD001",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "Primary storage drive"
  },
  {
    id: "CC004",
    computerAssetId: "ASSET001",
    componentType: ComponentType.MOTHERBOARD,
    name: "Dell OptiPlex 3080 Motherboard",
    componentSpecs: "Intel B460 chipset, Micro ATX",
    serialNumber: undefined,
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "OEM motherboard"
  },
  {
    id: "CC005",
    computerAssetId: "ASSET001",
    componentType: ComponentType.PSU,
    name: "Dell 200W PSU",
    componentSpecs: "200W 80+ Bronze certified",
    serialNumber: undefined,
    status: ComponentStatus.FAULTY, // Changed to FAULTY for req-001 (power supply issue)
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "Power supply unit showing signs of failure, burning smell reported"
  },
  {
    id: "CC006",
    computerAssetId: "ASSET001",
    componentType: ComponentType.MONITOR,
    name: "Dell P2214H",
    componentSpecs: "22 inch 1920x1080 LED IPS",
    serialNumber: "MON001",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "Primary display monitor"
  },
  {
    id: "CC007",
    computerAssetId: "ASSET001",
    componentType: ComponentType.KEYBOARD,
    name: "Dell KB216",
    componentSpecs: "USB Wired Standard Keyboard",
    serialNumber: "KB001",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "Standard Dell keyboard"
  },
  {
    id: "CC008",
    computerAssetId: "ASSET001",
    componentType: ComponentType.MOUSE,
    name: "Dell MS116",
    componentSpecs: "USB Optical Mouse 1000 DPI",
    serialNumber: "MS001",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "Standard optical mouse"
  },

  // ASSET002 - PC Dell OptiPlex 3080 (19-0205/02)
  {
    id: "CC011",
    computerAssetId: "ASSET002",
    componentType: ComponentType.CPU,
    name: "Intel Core i5-12400",
    componentSpecs: "6 cores, 12 threads, 2.5GHz base, 4.4GHz boost",
    serialNumber: "CPU002",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "CPU running normally"
  },
  {
    id: "CC012",
    computerAssetId: "ASSET002",
    componentType: ComponentType.RAM,
    name: "Kingston Fury Beast DDR4",
    componentSpecs: "16GB 3200MHz DDR4",
    serialNumber: "RAM002",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "Memory working properly"
  },
  {
    id: "CC013",
    computerAssetId: "ASSET002",
    componentType: ComponentType.STORAGE,
    name: "Samsung 980 SSD",
    componentSpecs: "512GB NVMe M.2 PCIe 3.0",
    serialNumber: "SSD002",
    status: ComponentStatus.FAULTY, // For req-002 (SSD bad sectors)
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "SSD showing bad sectors, needs replacement"
  },
  {
    id: "CC014",
    computerAssetId: "ASSET002",
    componentType: ComponentType.MOTHERBOARD,
    name: "Dell OptiPlex 3080 Motherboard",
    componentSpecs: "Intel B460 chipset, Micro ATX",
    serialNumber: undefined,
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "Motherboard functioning normally"
  },
  {
    id: "CC015",
    computerAssetId: "ASSET002",
    componentType: ComponentType.PSU,
    name: "Dell 200W PSU",
    componentSpecs: "200W 80+ Bronze certified",
    serialNumber: undefined,
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "Power supply working normally"
  },
  {
    id: "CC016",
    computerAssetId: "ASSET002",
    componentType: ComponentType.MONITOR,
    name: "Dell P2214H",
    componentSpecs: "22 inch 1920x1080 LED IPS",
    serialNumber: "MON002",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "Display working properly"
  },
  {
    id: "CC017",
    computerAssetId: "ASSET002",
    componentType: ComponentType.KEYBOARD,
    name: "Dell KB216",
    componentSpecs: "USB Wired Standard Keyboard",
    serialNumber: "KB002",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "Keyboard working normally"
  },
  {
    id: "CC018",
    computerAssetId: "ASSET002",
    componentType: ComponentType.MOUSE,
    name: "Dell MS116",
    componentSpecs: "USB Optical Mouse 1000 DPI",
    serialNumber: "MS002",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-01-15T01:00:00.000Z",
    removedAt: undefined,
    notes: "Mouse working normally"
  },

  // ASSET004 - PC Lenovo ThinkCentre (19-0207/01)
  {
    id: "CC031",
    computerAssetId: "ASSET004",
    componentType: ComponentType.CPU,
    name: "Intel Core i5-11400",
    componentSpecs: "6 cores, 12 threads, 2.6GHz base, 4.4GHz boost",
    serialNumber: "CPU004",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-02-10T01:30:00.000Z",
    removedAt: undefined,
    notes: "11th gen Intel processor"
  },
  {
    id: "CC032",
    computerAssetId: "ASSET004",
    componentType: ComponentType.RAM,
    name: "Crucial DDR4",
    componentSpecs: "8GB 2666MHz DDR4",
    serialNumber: "RAM004",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-02-10T01:30:00.000Z",
    removedAt: undefined,
    notes: "Standard memory module"
  },
  {
    id: "CC033",
    computerAssetId: "ASSET004",
    componentType: ComponentType.STORAGE,
    name: "WD Blue HDD",
    componentSpecs: "1TB SATA III 7200 RPM",
    serialNumber: "HDD004",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-02-10T01:30:00.000Z",
    removedAt: undefined,
    notes: "Traditional hard drive storage"
  },
  {
    id: "CC034",
    computerAssetId: "ASSET004",
    componentType: ComponentType.NETWORK_CARD,
    name: "Realtek PCIe GbE",
    componentSpecs: "Gigabit Ethernet adapter",
    serialNumber: undefined,
    status: ComponentStatus.FAULTY, // For req-004 (network connectivity issue)
    installedAt: "2023-02-10T01:30:00.000Z",
    removedAt: undefined,
    notes: "Network adapter not connecting to network properly"
  },

  // ASSET005 - PC Dell Inspiron (19-0208/01)
  {
    id: "CC041",
    computerAssetId: "ASSET005",
    componentType: ComponentType.CPU,
    name: "Intel Core i3-11100",
    componentSpecs: "4 cores, 8 threads, 3.6GHz base, 4.2GHz boost",
    serialNumber: "CPU005",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-04-05T00:45:00.000Z",
    removedAt: undefined,
    notes: "Entry-level processor working normally"
  },
  {
    id: "CC042",
    computerAssetId: "ASSET005",
    componentType: ComponentType.RAM,
    name: "Kingston ValueRAM",
    componentSpecs: "8GB 2400MHz DDR4",
    serialNumber: "RAM005",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-04-05T00:45:00.000Z",
    removedAt: undefined,
    notes: "Basic memory module"
  },
  {
    id: "CC043",
    computerAssetId: "ASSET005",
    componentType: ComponentType.STORAGE,
    name: "WD Green SSD",
    componentSpecs: "256GB SATA III 2.5 inch",
    serialNumber: "SSD005",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-04-05T00:45:00.000Z",
    removedAt: undefined,
    notes: "Budget SSD working normally"
  },
  {
    id: "CC044",
    computerAssetId: "ASSET005",
    componentType: ComponentType.MOUSE,
    name: "Dell MS116",
    componentSpecs: "USB Optical Mouse 1000 DPI",
    serialNumber: "MS005", 
    status: ComponentStatus.REMOVED, // For req-005 (missing mouse)
    installedAt: "2023-04-05T00:45:00.000Z",
    removedAt: "2024-01-17T07:00:00.000Z",
    notes: "Mouse was lost/stolen, needs replacement"
  },
  {
    id: "CC045",
    computerAssetId: "ASSET005",
    componentType: ComponentType.KEYBOARD,
    name: "Dell KB216",
    componentSpecs: "USB Wired Standard Keyboard",
    serialNumber: "KB005",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-04-05T00:45:00.000Z",
    removedAt: undefined,
    notes: "Keyboard working normally"
  },

  // ASSET009 - PC ASUS VivoBook (19-0210/01)
  {
    id: "CC051",
    computerAssetId: "ASSET009",
    componentType: ComponentType.CPU,
    name: "AMD Ryzen 7 5700U",
    componentSpecs: "8 cores, 16 threads, 1.8GHz base, 4.3GHz boost",
    serialNumber: "CPU007",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-08-10T03:00:00.000Z",
    removedAt: undefined,
    notes: "High-performance mobile processor"
  },
  {
    id: "CC052",
    computerAssetId: "ASSET009",
    componentType: ComponentType.RAM,
    name: "Corsair Vengeance LPX DDR4",
    componentSpecs: "16GB 3200MHz DDR4",
    serialNumber: "RAM007",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-08-10T03:00:00.000Z",
    removedAt: undefined,
    notes: "High-speed gaming RAM"
  },
  {
    id: "CC053",
    computerAssetId: "ASSET009",
    componentType: ComponentType.STORAGE,
    name: "WD Black SN850 NVMe",
    componentSpecs: "1TB NVMe M.2 PCIe 4.0",
    serialNumber: "SSD007",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-08-10T03:00:00.000Z",
    removedAt: undefined,
    notes: "High-performance gaming SSD"
  },
  {
    id: "CC054",
    computerAssetId: "ASSET009",
    componentType: ComponentType.COOLING,
    name: "ASUS ROG Strix LC 240",
    componentSpecs: "240mm AIO liquid cooler",
    serialNumber: "COOL001",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-08-10T03:00:00.000Z",
    removedAt: undefined,
    notes: "Liquid cooling system for high performance"
  },
  {
    id: "CC055",
    computerAssetId: "ASSET009",
    componentType: ComponentType.MOUSE,
    name: "Logitech MX Master 3",
    componentSpecs: "Wireless Mouse 4000 DPI",
    serialNumber: "MS009",
    status: ComponentStatus.FAULTY, // For req-006 (mouse not working)
    installedAt: "2023-08-10T03:00:00.000Z",
    removedAt: undefined,
    notes: "Mouse cursor not moving, possible hardware failure"
  },
  {
    id: "CC056",
    computerAssetId: "ASSET009",
    componentType: ComponentType.KEYBOARD,
    name: "ASUS ROG Strix Scope",
    componentSpecs: "Mechanical Gaming Keyboard Cherry MX Red",
    serialNumber: "KB009",
    status: ComponentStatus.INSTALLED,
    installedAt: "2023-08-10T03:00:00.000Z",
    removedAt: undefined,
    notes: "High-end mechanical keyboard"
  }
]

// Helper functions to work with components
export const getComponentsByAssetId = (assetId: string): Component[] => {
  return mockComponents.filter(component => component.computerAssetId === assetId)
}

export const getInstalledComponentsByAssetId = (assetId: string): Component[] => {
  return mockComponents.filter(
    component => component.computerAssetId === assetId && component.status === ComponentStatus.INSTALLED
  )
}

export const getFaultyComponentsByAssetId = (assetId: string): Component[] => {
  return mockComponents.filter(
    component => component.computerAssetId === assetId && component.status === ComponentStatus.FAULTY
  )
}

export const getComponentById = (id: string): Component | undefined => {
  return mockComponents.find(component => component.id === id)
}

export const getComponentsByType = (type: ComponentType): Component[] => {
  return mockComponents.filter(component => component.componentType === type)
}

// Get components available for replacement (INSTALLED or FAULTY)
export const getAvailableComponentsForReplacement = (assetId: string): Component[] => {
  return mockComponents.filter(
    component => 
      component.computerAssetId === assetId && 
      (component.status === ComponentStatus.INSTALLED || component.status === ComponentStatus.FAULTY)
  )
}

// Interface for replacement parts in the ReplacementPartsInput component
export interface ReplacementPart {
  id: string
  componentId: string
  componentType: ComponentType
  componentName: string
  componentSpecs?: string
  quantity: number
  note?: string
}