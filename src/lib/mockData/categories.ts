export interface Category {
  id: string;
  name: string;
  code: string;
  parentId: string | null;
}

// Synchronized with database-sync.json categories section
export const categories: Category[] = [
  {
    id: "3",
    name: "Thiết bị văn phòng",
    code: "TBVP",
    parentId: null
  },
  {
    id: "4",
    name: "Máy tính",
    code: "MT",
    parentId: null
  },
  {
    id: "5",
    name: "Máy in",
    code: "MI",
    parentId: null
  }
];