import { Room, RoomStatus } from "@/types/unit";

export const mockRooms: Room[] = [
  {
    id: "ROOM001",
    building: "Tòa A",
    floor: "Tầng 1",
    roomNumber: "A101",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM002",
    building: "Tòa A",
    floor: "Tầng 1",
    roomNumber: "A102",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM003",
    building: "Tòa A",
    floor: "Tầng 1",
    roomNumber: "A103",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM004",
    building: "Tòa B",
    floor: "Tầng 2",
    roomNumber: "B201",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM005",
    building: "Tòa B",
    floor: "Tầng 2",
    roomNumber: "B202",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM006",
    building: "Tòa A",
    floor: "Tầng 2",
    roomNumber: "A201",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM007",
    building: "Tòa A",
    floor: "Tầng 2",
    roomNumber: "A202",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM008",
    building: "Tòa C",
    floor: "Tầng 1",
    roomNumber: "C101",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM009",
    building: "Tòa C",
    floor: "Tầng 1",
    roomNumber: "C102",
    status: RoomStatus.INACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin (đang sửa chữa)
  },
  {
    id: "ROOM010",
    building: "Tòa A",
    floor: "Tầng 3",
    roomNumber: "A301 - Phòng Hội thảo",
    status: RoomStatus.ACTIVE,
    unitId: "unit-2", // Phòng Quản trị
  },
  {
    id: "ROOM011",
    building: "Tòa B",
    floor: "Tầng 1",
    roomNumber: "B101 - Phòng Đa phương tiện",
    status: RoomStatus.ACTIVE,
    unitId: "unit-1", // Khoa Công nghệ Thông tin
  },
  {
    id: "ROOM012",
    building: "Tòa B",
    floor: "Tầng 3",
    roomNumber: "B301 - Phòng Server",
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
