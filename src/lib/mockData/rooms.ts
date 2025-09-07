import { Room, RoomStatus } from "@/types/unit";

export const mockRooms: Room[] = [
  // Tầng 1 - Tòa H
  {
    id: "ROOM001",
    building: "Tòa H",
    floor: "Tầng 1",
    roomNumber: "H101",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM002",
    building: "Tòa H",
    floor: "Tầng 1",
    roomNumber: "H102",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM003",
    building: "Tòa H",
    floor: "Tầng 1",
    roomNumber: "H103",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  // Tầng 2 - Tòa H
  {
    id: "ROOM004",
    building: "Tòa H",
    floor: "Tầng 2",
    roomNumber: "H201",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM005",
    building: "Tòa H",
    floor: "Tầng 2",
    roomNumber: "H202",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  // Tầng 3 - Tòa H
  {
    id: "ROOM006",
    building: "Tòa H",
    floor: "Tầng 3",
    roomNumber: "H301",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM007",
    building: "Tòa H",
    floor: "Tầng 3",
    roomNumber: "H302 - Phòng Hội thảo",
    status: RoomStatus.ACTIVE,
    unitId: "unit-2", // Phòng Quản trị
  },
  // Tầng 4 - Tòa H
  {
    id: "ROOM008",
    building: "Tòa H",
    floor: "Tầng 4",
    roomNumber: "H401",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM009",
    building: "Tòa H",
    floor: "Tầng 4",
    roomNumber: "H402",
    status: RoomStatus.INACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin (đang sửa chữa)
  },
  // Tầng 5 - Tòa H
  {
    id: "ROOM010",
    building: "Tòa H",
    floor: "Tầng 5",
    roomNumber: "H501 - Phòng Đa phương tiện",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM011",
    building: "Tòa H",
    floor: "Tầng 5",
    roomNumber: "H502",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  // Tầng 6 - Tòa H
  {
    id: "ROOM012",
    building: "Tòa H",
    floor: "Tầng 6",
    roomNumber: "H601",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM013",
    building: "Tòa H",
    floor: "Tầng 6",
    roomNumber: "H602",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  // Tầng 7 - Tòa H
  {
    id: "ROOM014",
    building: "Tòa H",
    floor: "Tầng 7",
    roomNumber: "H701",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM015",
    building: "Tòa H",
    floor: "Tầng 7",
    roomNumber: "H702 - Phòng Server",
    status: RoomStatus.ACTIVE,
    unitId: "unit-2", // Phòng Quản trị
  },
  // Tầng 8 - Tòa H
  {
    id: "ROOM016",
    building: "Tòa H",
    floor: "Tầng 8",
    roomNumber: "H801",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM017",
    building: "Tòa H",
    floor: "Tầng 8",
    roomNumber: "H802",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  // Tầng 9 - Tòa H
  {
    id: "ROOM018",
    building: "Tòa H",
    floor: "Tầng 9",
    roomNumber: "H901",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM019",
    building: "Tòa H",
    floor: "Tầng 9",
    roomNumber: "H902 - Phòng Nghiên cứu",
    status: RoomStatus.ACTIVE,
    unitId: "unit-2", // Phòng Quản trị
  },
];

// Backward compatibility - keeping the old interface for forms that still use it
export interface SimpleRoom {
  id: string;
  name: string;
}

// Generate simple room names for backward compatibility
export const mockSimpleRooms: SimpleRoom[] = mockRooms.map((room) => ({
  id: room.id,
  name:
    `Phòng máy tính ${room.roomNumber}` +
    (room.building ? ` - ${room.building}` : ""),
}));
