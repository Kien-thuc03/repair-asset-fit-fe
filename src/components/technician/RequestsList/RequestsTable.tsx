"use client"

import { useState } from "react"
import { RepairRequest } from "@/types"
import { repairRequestStatusConfig } from "@/lib/mockData/repairRequests"
import Link from "next/link"
import { ChevronUp, ChevronDown } from "lucide-react"

interface Props {
	data: RepairRequest[]
}

type SortField = "requestCode" | "assetName" | "assetCode" | "location" | "reporterName" | "status" | "createdAt"
type SortDirection = "asc" | "desc" | "none"

export default function RequestsTable({ data }: Props) {
	const [sortField, setSortField] = useState<SortField | "">("")
	const [sortDirection, setSortDirection] = useState<SortDirection>("none")

	// Hàm xử lý sắp xếp 3 trạng thái
	const handleSort = (field: SortField) => {
		if (sortField === field) {
			if (sortDirection === "asc") {
				setSortDirection("desc")
			} else if (sortDirection === "desc") {
				setSortDirection("none")
				setSortField("")
			} else {
				setSortDirection("asc")
			}
		} else {
			setSortField(field)
			setSortDirection("asc")
		}
	}

	// Hàm lấy icon sắp xếp
	const getSortIcon = (field: SortField) => {
		if (sortField !== field || sortDirection === "none") {
			return (
				<div className="flex flex-col opacity-50 group-hover:opacity-75 transition-opacity">
					<ChevronUp className="h-3 w-3 text-gray-400" />
					<ChevronDown className="h-3 w-3 -mt-1 text-gray-400" />
				</div>
			)
		}

		return (
			<div className="flex flex-col">
				<ChevronUp
					className={`h-3 w-3 ${sortDirection === "asc" ? "text-blue-600" : "text-gray-300"}`}
				/>
				<ChevronDown
					className={`h-3 w-3 -mt-1 ${sortDirection === "desc" ? "text-blue-600" : "text-gray-300"}`}
				/>
			</div>
		)
	}

	// Sắp xếp dữ liệu
	const sortedData = [...data].sort((a, b) => {
		if (!sortField || sortDirection === "none") return 0

		let aValue: string | Date = ""
		let bValue: string | Date = ""

		switch (sortField) {
			case "requestCode":
				aValue = a.requestCode
				bValue = b.requestCode
				break
			case "assetName":
				aValue = a.assetName
				bValue = b.assetName
				break
			case "assetCode":
				aValue = a.assetCode || ""
				bValue = b.assetCode || ""
				break
			case "location":
				aValue = `${a.buildingName} ${a.roomName}`
				bValue = `${b.buildingName} ${b.roomName}`
				break
			case "reporterName":
				aValue = a.reporterName
				bValue = b.reporterName
				break
			case "status":
				aValue = a.status
				bValue = b.status
				break
			case "createdAt":
				aValue = new Date(a.createdAt)
				bValue = new Date(b.createdAt)
				break
			default:
				return 0
		}

		if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
		if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
		return 0
	})

	return (
		<div className="overflow-x-auto bg-white shadow rounded-lg">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th 
							className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
							onClick={() => handleSort("requestCode")}
						>
							<div className="flex items-center space-x-1">
								<span>Mã yêu cầu</span>
								{getSortIcon("requestCode")}
							</div>
						</th>
						<th 
							className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
							onClick={() => handleSort("assetName")}
						>
							<div className="flex items-center space-x-1">
								<span>Tài sản / Linh kiện</span>
								{getSortIcon("assetName")}
							</div>
						</th>
						<th 
							className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
							onClick={() => handleSort("location")}
						>
							<div className="flex items-center space-x-1">
								<span>Vị trí</span>
								{getSortIcon("location")}
							</div>
						</th>
						<th 
							className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
							onClick={() => handleSort("reporterName")}
						>
							<div className="flex items-center space-x-1">
								<span>Người báo</span>
								{getSortIcon("reporterName")}
							</div>
						</th>
						<th 
							className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
							onClick={() => handleSort("status")}
						>
							<div className="flex items-center space-x-1">
								<span>Trạng thái</span>
								{getSortIcon("status")}
							</div>
						</th>
						<th 
							className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 group"
							onClick={() => handleSort("createdAt")}
						>
							<div className="flex items-center space-x-1">
								<span>Ngày báo</span>
								{getSortIcon("createdAt")}
							</div>
						</th>
						<th className="px-4 py-3" />
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{sortedData.map((r) => {
						const cfg = repairRequestStatusConfig[r.status]
						return (
							<tr key={r.id} className="hover:bg-gray-50">
								<td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{r.requestCode}</td>
								<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
									<div className="flex flex-col">
										<span className="font-medium">{r.assetName}</span>
										{r.componentName ? <span className="text-xs text-gray-500">{r.componentName}</span> : null}
									</div>
								</td>
								<td className="flex flex-col px-4 py-3 whitespace-nowrap text-sm text-gray-700">
									<span className="font-medium">{r.buildingName}</span>
									<span className="text-xs text-gray-500">{r.roomName} - {`Máy ${r.machineLabel}`}</span>
								</td>
								<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{r.reporterName}</td>
								<td className="px-4 py-3 whitespace-nowrap">
									<span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${cfg.color}`}>{cfg.label}</span>
								</td>
								<td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{new Date(r.createdAt).toLocaleString()}</td>
								<td className="px-4 py-3 whitespace-nowrap text-right text-sm">
									<Link href={`/ky-thuat-vien/quan-ly-bao-loi/chi-tiet-bao-loi/${r.id}`} className="text-blue-600 hover:underline">Chi tiết</Link>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}


