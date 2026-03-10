import { api } from "../api";

// Interface cho software response
export interface SoftwareDto {
  softwareId: string;
  name: string;
  version: string;
  publisher: string;
  installationDate: string;
  notes?: string;
}

export interface AssetSoftwareResponseDto {
  success: boolean;
  message: string;
  data: {
    assetId: string;
    assetName: string;
    totalSoftware: number;
    software: SoftwareDto[];
  };
}

/**
 * Lấy tất cả phần mềm được cài đặt trên 1 tài sản
 * @param assetId - ID của tài sản (UUID)
 * @returns Danh sách phần mềm
 */
export async function getSoftwareByAssetId(
  assetId: string
): Promise<SoftwareDto[]> {
  try {
    const response = await api.get<AssetSoftwareResponseDto>(
      `/api/v1/asset-software/asset/${assetId}`
    );

    if (response.data.success) {
      return response.data.data.software;
    }

    throw new Error(
      response.data.message || "Không thể lấy danh sách phần mềm"
    );
  } catch (error) {
    console.error("Error fetching software by asset:", error);

    // Handle error response
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Không thể tải danh sách phần mềm");
  }
}

/**
 * Lấy chi tiết 1 phần mềm trên 1 tài sản
 * @param assetId - ID của tài sản
 * @param softwareId - ID của phần mềm
 * @returns Chi tiết phần mềm
 */
export async function getSoftwareDetail(
  assetId: string,
  softwareId: string
): Promise<SoftwareDto> {
  try {
    const response = await api.get(
      `/api/v1/asset-software/asset/${assetId}/software/${softwareId}`
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(
      response.data.message || "Không thể lấy thông tin phần mềm"
    );
  } catch (error) {
    console.error("Error fetching software detail:", error);

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Không thể tải thông tin phần mềm");
  }
}
