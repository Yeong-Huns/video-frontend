"use server";

import {fetchApi} from "@/lib/api-client";

export interface CourseCategoryResponse {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

/**
 * 카테고리 리스트 조회
 */
export async function getCourseCategoriesAction(): Promise<CourseCategoryResponse[]> {
    return await fetchApi<CourseCategoryResponse[]>("/course-category");
}
