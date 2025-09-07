import { Technician } from "@/types";

export const mockTechnicians: Technician[] = [
  {
    id: "tech001",
    name: "Nguyễn Văn A",
    email: "vana@iuh.edu.vn",
    phone: "0123456789",
    status: "active",
    assignedAreas: ["ROOM001", "ROOM002", "ROOM003", "ROOM004"], // Tầng 1-2
    currentTask: "Sửa mainboard máy tính H301-01",
  },
  {
    id: "tech002",
    name: "Trần Thị B",
    email: "tranb@iuh.edu.vn",
    phone: "0987654321",
    status: "busy",
    assignedAreas: ["ROOM005", "ROOM006", "ROOM007", "ROOM008"], // Tầng 2-4
    currentTask: "Thay RAM máy tính H205-15",
  },
  {
    id: "tech003",
    name: "Lê Văn C",
    email: "levanc@iuh.edu.vn",
    phone: "0456789123",
    status: "active",
    assignedAreas: ["ROOM010", "ROOM011", "ROOM012", "ROOM013"], // Tầng 5-6
  },
  {
    id: "tech004",
    name: "Phạm Thị D",
    email: "phamd@iuh.edu.vn",
    phone: "0321654987",
    status: "offline",
    assignedAreas: ["ROOM014", "ROOM015"], // Tầng 7
  },
  {
    id: "tech005",
    name: "Hoàng Văn E",
    email: "hoange@iuh.edu.vn",
    phone: "0789123456",
    status: "active",
    assignedAreas: ["ROOM016", "ROOM017", "ROOM018"], // Tầng 8-9
    currentTask: "Kiểm tra nguồn điện H109-22",
  },
];
