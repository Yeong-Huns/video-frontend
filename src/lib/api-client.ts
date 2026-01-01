"use server";

import {cookies} from "next/headers";
import {parse} from "set-cookie-parser";
import {API_URL} from "@/lib/constant";
import {signOutAndRedirect} from "@/actions/auth/auth";

type FetchOptions = Omit<RequestInit, "body"> & {
    skipRefresh?: boolean; /* 재발급 무한루프 방지 */
    body?: any;
};

export async function fetchApi<T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> {
    const cookieStore = await cookies();

    /* 1. 현재 쿠키들을 모두 문자열로 변환하여 헤더에 포함 */
    const headers = {
        "Content-Type": "application/json",
        Cookie: cookieStore.toString(),
        ...(options.headers || {}),
    } as Record<string, string>;

    const config: RequestInit = {
        ...options,
        headers,
        cache: "no-store",
    };

    if (options.body && typeof options.body !== "string") {
        config.body = JSON.stringify(options.body);
    }

    const url = `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    let response = await fetch(url, config);

    /* 3. 401 토큰 재발급 시도 */
    if (response.status === 401 && !options.skipRefresh) {
        console.warn("토큰 만료 됨. 재발급 시도 중...");

        try {
            /* Refresh Token API 호출 */
            const refreshResponse = await fetch(`${API_URL}/auth/refresh-access`, {
                method: "POST",
                headers: {
                    Cookie: cookieStore.toString(),
                },
            });

            if (refreshResponse.ok) {
                /* 성공(쿠키 갱신) */
                const setCookieHeader = refreshResponse.headers.get("set-cookie");
                if (setCookieHeader) {
                    const parsedCookies = parse(setCookieHeader);
                    parsedCookies.forEach((cookie) => {
                        cookieStore.set({
                            name: cookie.name,
                            value: cookie.value,
                            httpOnly: cookie.httpOnly,
                            secure: cookie.secure,
                            path: cookie.path,
                            maxAge: cookie.maxAge,
                            expires: cookie.expires,
                            sameSite: cookie.sameSite as "lax" | "strict" | "none",
                        });
                    });

                    console.log("토큰 재발급 및 쿠키 갱신 성공");

                    /* 재발급 토큰으로 요청 재시도 */
                    return fetchApi<T>(endpoint, {
                        ...options,
                        skipRefresh: true,
                    });
                }
            } else {
                console.error("토큰 재발급 실패");
            }
        } catch (refreshError) {
            console.error("재발급 요청 중 에러 발생: ", refreshError);
        }

        /* 로그아웃 처리 */
        await signOutAndRedirect();
    }

    if (!response.ok) {
        if (response.status !== 401) {
            console.error(`API Error: ${response.status} ${url}`);
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API Request Failed: ${response.status}`);
        }
    }

    if (response.status === 204) {
        return {} as T;
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
        return await response.json() as Promise<T>;
    } else {
        return await response.text() as unknown as Promise<T>;
    }
}
