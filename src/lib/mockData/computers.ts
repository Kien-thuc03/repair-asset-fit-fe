import { Computer } from '@/types';

// Mock computers data - Khớp hoàn toàn với database schema
export const mockComputers: Computer[] = [
  {
    id: "COMP001",
    assetId: "ASSET001",
    roomId: "ROOM001",
    machineLabel: "01",
    notes: "Máy thực hành sinh viên"
  },
  {
    id: "COMP002",
    assetId: "ASSET002", 
    roomId: "ROOM001",
    machineLabel: "02",
    notes: "Máy thực hành sinh viên"
  },
  {
    id: "COMP003",
    assetId: "ASSET003",
    roomId: "ROOM001", 
    machineLabel: "03",
    notes: "Máy thực hành sinh viên"
  },
  {
    id: "COMP004",
    assetId: "ASSET004",
    roomId: "ROOM002",
    machineLabel: "01",
    notes: "Máy thực hành sinh viên"
  },
  {
    id: "COMP005",
    assetId: "ASSET005",
    roomId: "ROOM002",
    machineLabel: "02", 
    notes: "Máy thực hành sinh viên"
  },
  {
    id: "COMP006",
    assetId: "ASSET006",
    roomId: "ROOM002",
    machineLabel: "03",
    notes: "Máy thực hành sinh viên"
  },
  {
    id: "COMP007",
    assetId: "ASSET009",
    roomId: "ROOM003",
    machineLabel: "01",
    notes: "Máy giảng viên"
  },
  {
    id: "COMP008", 
    assetId: "ASSET010",
    roomId: "ROOM004",
    machineLabel: "01",
    notes: "Máy phòng lab cao cấp"
  }
];

// Helper functions
export const getComputerById = (id: string): Computer | undefined => {
  return mockComputers.find(computer => computer.id === id);
};

export const getComputerByAssetId = (assetId: string): Computer | undefined => {
  return mockComputers.find(computer => computer.assetId === assetId);
};

export const getComputersByRoomId = (roomId: string): Computer[] => {
  return mockComputers.filter(computer => computer.roomId === roomId);
};