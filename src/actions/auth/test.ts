"use server"

import {CourseControllerFindAllData, CourseControllerFindAllResponse, CourseControllerFindOneResponse} from "@/client";
import {fetchApi} from "@/lib/api-client";

export async function getCourseList(options: CourseControllerFindAllData) {
    return await fetchApi<CourseControllerFindAllResponse>('course');
}

export async function getCourse() {
    return await fetchApi<CourseControllerFindOneResponse>('/course/34060277-df79-4ac7-8c93-3e5f6b567ccb');
}