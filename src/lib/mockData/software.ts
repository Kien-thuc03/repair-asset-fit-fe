export interface Software {
  id: string;
  name: string;
  version: string;
  publisher: string;
  createdAt: string;
}

// Synchronized with database-sync.json software section
export const software: Software[] = [
  {
    id: "SW001",
    name: "Microsoft Office 2021",
    version: "2021",
    publisher: "Microsoft Corporation",
    createdAt: "2023-01-15T08:00:00Z"
  },
  {
    id: "SW002",
    name: "Adobe Photoshop",
    version: "2024",
    publisher: "Adobe Inc.",
    createdAt: "2023-01-15T08:05:00Z"
  },
  {
    id: "SW003",
    name: "AutoCAD",
    version: "2024",
    publisher: "Autodesk Inc.",
    createdAt: "2023-01-15T08:10:00Z"
  },
  {
    id: "SW004",
    name: "Visual Studio Code",
    version: "1.85",
    publisher: "Microsoft Corporation",
    createdAt: "2023-01-15T08:15:00Z"
  },
  {
    id: "SW005",
    name: "Google Chrome",
    version: "120.0",
    publisher: "Google LLC",
    createdAt: "2023-01-15T08:20:00Z"
  }
];