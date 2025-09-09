export interface Computer {
  id: string
  assetId: string
  roomId: string
  machineLabel: string
  notes?: string
}

export const mockComputers: Computer[] = [
  // Phòng H101
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
  // Phòng H102
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
  // Phòng H103
  {
    id: "COMP007",
    assetId: "ASSET007",
    roomId: "ROOM003",
    machineLabel: "01",
    notes: "Máy thực hành sinh viên"
  },
  {
    id: "COMP008",
    assetId: "ASSET008",
    roomId: "ROOM003",
    machineLabel: "02",
    notes: "Máy thực hành sinh viên"
  },
  // Phòng H201
  {
    id: "COMP009",
    assetId: "ASSET009",
    roomId: "ROOM004",
    machineLabel: "01",
    notes: "Máy thực hành sinh viên"
  },
  {
    id: "COMP010",
    assetId: "ASSET010",
    roomId: "ROOM004",
    machineLabel: "02",
    notes: "Máy dự phòng"
  },
  // Phòng H202
  {
    id: "COMP011",
    assetId: "ASSET011",
    roomId: "ROOM005",
    machineLabel: "01",
    notes: "Máy thực hành sinh viên"
  },
  {
    id: "COMP012",
    assetId: "ASSET012",
    roomId: "ROOM005",
    machineLabel: "02",
    notes: "Máy thực hành sinh viên"
  },
]
