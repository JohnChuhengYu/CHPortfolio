import { apiClient } from "./apiClient";

export interface GridItem {
    id: string;
    type: "Project" | "Daily" | "DevLog";
    title: string;
    content?: string;
    subTitle?: string;
    tags?: string[];
    problemDescription?: string;
    solutionDescription?: string;
    imageUrl?: string;
    githubUrl?: string;
    gridSpanX: number;
    gridSpanY: number;
    color: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateGridItemDto {
    title?: string;
    content?: string;
    subTitle?: string;
    tags?: string[];
    problemDescription?: string;
    solutionDescription?: string;
    imageUrl?: string;
    githubUrl?: string;
    color?: string;
    gridSpanX?: number;
    gridSpanY?: number;
}

export const gridItemsApi = {
    // Get all grid items optionally filtered by type
    getAll: async (type?: string): Promise<GridItem[]> => {
        const url = type ? `/api/grid-items?type=${type}` : "/api/grid-items";
        const { data } = await apiClient.get<GridItem[]>(url);
        return data;
    },

    // Update a grid item
    update: async (id: string, dto: UpdateGridItemDto): Promise<GridItem> => {
        const { data } = await apiClient.put<GridItem>(`/api/grid-items/${id}`, dto);
        return data;
    },

    // Delete a grid item
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/api/grid-items/${id}`);
    },

    // Upload an image
    uploadImage: async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append("file", file);

        const { data } = await apiClient.post<{ url: string }>("/api/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return data;
    }
};
