export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3009";

export const COOKIE_ACCESS = "accessToken";
export const COOKIE_REFRESH = "refreshToken";

export const QUERY_KEYS = {
    post: {
        all: ['posts'],
        list: ['posts', 'list'],
        byId: (postId: number) => ['posts', 'byId', postId]
    },
    courseCategory: {
        all: ['course-categories'],
    }
}