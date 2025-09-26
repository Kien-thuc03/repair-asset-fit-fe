import { Category } from '@/types';

// Mock categories data - Khớp hoàn toàn với database
export const mockCategories: Category[] = [
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

// Helper functions
export const getCategoryById = (id: string): Category | undefined => {
  return mockCategories.find(category => category.id === id);
};

export const getCategoryByCode = (code: string): Category | undefined => {
  return mockCategories.find(category => category.code === code);
};