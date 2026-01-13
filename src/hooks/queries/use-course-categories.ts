import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constant";
import { getCourseCategoriesAction } from "@/actions/course-category";

export const useCourseCategories = () => {
    return useQuery({
        queryKey: QUERY_KEYS.courseCategory.all,
        queryFn: () => getCourseCategoriesAction(),
    });
};