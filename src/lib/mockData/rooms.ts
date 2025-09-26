import { Room, RoomStatus } from "@/types/unit";

// Mock rooms data - Khớp hoàn toàn với database schema
export const mockRooms: Room[] = [
  {
    id: "ROOM001",
    building: "Tòa H",
    floor: "Tầng 1",
    roomNumber: "H101",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },
  {
    id: "ROOM002",
    building: "Tòa H",
    floor: "Tầng 1",
    roomNumber: "H102",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },
  {
    id: "ROOM003",
    building: "Tòa H",
    floor: "Tầng 1",
    roomNumber: "H103",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },
  {
    id: "ROOM004",
    building: "Tòa H",
    floor: "Tầng 2",
    roomNumber: "H201",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },
  {
    id: "ROOM005",
    building: "Tòa H",
    floor: "Tầng 2",
    roomNumber: "H202",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },
  {
    id: "ROOM006",
    building: "Tòa H",
    floor: "Tầng 3",
    roomNumber: "H301",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },
  {
    id: "ROOM007",
    building: "Tòa H",
    floor: "Tầng 3",
    roomNumber: "H302 - Phòng Hội thảo",
    status: RoomStatus.ACTIVE,
    unitId: "unit-2",
  },
  {
    id: "ROOM008",
    building: "Tòa H",
    floor: "Tầng 4",
    roomNumber: "H401",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },
  {
    id: "ROOM009",
    building: "Tòa H",
    floor: "Tầng 4",
    roomNumber: "H402",
    status: RoomStatus.INACTIVE,
    unitId: "unit-1",
  },
  {
    id: "ROOM010",
    building: "Tòa H",
    floor: "Tầng 5",
    roomNumber: "H501 - Phòng Đa phương tiện",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },

  // Tầng 6 - Tòa H
  {
    id: "room-11",
    building: "Tòa H",
    floor: "Tầng 6",
    roomNumber: "H601 - Phòng Máy tính 6",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },
  {
    id: "room-12",
    building: "Tòa H",
    floor: "Tầng 6",
    roomNumber: "H602 - Phòng Thực hành 6",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },

  // Tầng 7 - Tòa H
  {
    id: "room-13",
    building: "Tòa H",
    floor: "Tầng 7",
    roomNumber: "H701 - Phòng Máy tính 7",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },
  {
    id: "room-14",
    building: "Tòa H",
    floor: "Tầng 7",
    roomNumber: "H702 - Phòng Thực hành 7",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },

  // Tầng 8 - Tòa H
  {
    id: "room-15",
    building: "Tòa H",
    floor: "Tầng 8",
    roomNumber: "H801 - Phòng Máy tính 8",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },
  {
    id: "room-16",
    building: "Tòa H",
    floor: "Tầng 8",
    roomNumber: "H802 - Phòng Thực hành 8",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },

  // Tầng 9 - Tòa H
  {
    id: "room-17",
    building: "Tòa H",
    floor: "Tầng 9",
    roomNumber: "H901 - Phòng Máy tính 9",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },
  {
    id: "room-18",
    building: "Tòa H",
    floor: "Tầng 9",
    roomNumber: "H902 - Phòng Server & Network",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1",
  },
];

// Helper functions
export const getRoomById = (id: string): Room | undefined => {
  return mockRooms.find((room) => room.id === id);
};

export const getRoomsByBuilding = (building: string): Room[] => {
  return mockRooms.filter((room) => room.building === building);
};

export const getRoomsByFloor = (building: string, floor: string): Room[] => {
  return mockRooms.filter(
    (room) => room.building === building && room.floor === floor
  );
};

export const getUniqueBuildings = (): string[] => {
  return [
    ...new Set(
      mockRooms
        .map((room) => room.building)
        .filter((building): building is string => Boolean(building))
    ),
  ];
};

export const getUniqueFloors = (building: string): string[] => {
  return [
    ...new Set(
      mockRooms
        .filter((room) => room.building === building && room.floor)
        .map((room) => room.floor!)
    ),
  ];
};
