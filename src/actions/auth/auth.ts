"use server"

import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {API_URL, COOKIE_ACCESS, COOKIE_REFRESH} from "@/lib/constant";
import parse from "set-cookie-parser";
import {jwtDecode} from "jwt-decode";
import {Payload} from "@/store/auth";
import {fetchApi} from "@/lib/api-client";

type SignInParams = Omit<SignUpParams, "name">

interface SignUpParams {
    email: string,
    password: string,
    name: string
}

export async function signUpAction(params: SignUpParams) {
    return await fetchApi("/auth/sign-up", {
        method: "POST",
        body: params
    })
}

async function syncBackendCookies(response: Response, cookieStore: any): Promise<string | null> {
    const setCookieHeader = response.headers.getSetCookie();
    let newAccessToken = null;

    if (setCookieHeader && setCookieHeader.length > 0) {
        const parsedCookies = parse(setCookieHeader);

        parsedCookies.forEach((cookie) => {
            if (cookie.name === COOKIE_ACCESS) {
                newAccessToken = cookie.value;
            }

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
    } else {
        console.warn("서버에서 쿠키 응답을 받지 못했습니다.");
    }
    return newAccessToken;
}

function verifyToken(token: string): Payload | null {
    try {
        const decoded = jwtDecode<Payload>(token);
        const isExpired = decoded.exp * 1000 < Date.now();

        return isExpired ? null : {
            id: decoded.id,
            role: decoded.role,
            type: decoded.type,
            iat: decoded.iat,
            exp: decoded.exp
        };
    } catch (e) {
        return null;
    }
}

export async function signInAction(params: SignInParams) {
    const cookieStore = await cookies();

    try {
        const response = await fetch(`${API_URL}/auth/sign-in`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(params),
            cache: "no-store",
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || "로그인에 실패했습니다.");
        }

        const accessToken = await syncBackendCookies(response, cookieStore);

        /* 토큰 검증 */
        if (accessToken) {
            const payload = verifyToken(accessToken);
            if (payload) return payload;
        }

        return null;

    } catch (error: any) {
        console.error("SignIn Action Error:", error.message);
        throw new Error(error.message);
    }
}

export async function signOutAndRedirect() {
    const cookieStore = await cookies();

    /* 프론트엔드 쿠키삭제 */
    cookieStore.delete(COOKIE_ACCESS);
    cookieStore.delete(COOKIE_REFRESH);

    /* 백엔드 로그아웃 진행 */
    try {
        await fetch(`${API_URL}/auth/sign-out`, {
            method: "POST",
            headers: {Cookie: cookieStore.toString()}
        });
    } catch (e) {
        console.warn("백엔드 로그아웃 호출 실패");
    }

    redirect("/sign-in?reason=session_expired");
}

export async function getAccessTokenAction(): Promise<Payload | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(COOKIE_ACCESS)?.value;
    const refreshToken = cookieStore.get(COOKIE_REFRESH)?.value;

    if (accessToken) {
        const payload = verifyToken(accessToken);
        if (payload) return payload;
        console.log("AccessToken 만료됨. 재발급 시도...");
    }

    /* Refresh Token 도 없을시 로그아웃처리 */
    if (!refreshToken) {
        await signOutAndRedirect();
        return null;
    }

    /* 재발급 API 호출 */
    try {
        const response = await fetch(`${API_URL}/auth/refresh-access`, {
            method: "POST",
            headers: {
                Cookie: `${COOKIE_REFRESH}=${refreshToken}`
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error("리프레시 토큰 만료 또는 재발급 실패");
        }

        const newAccessToken = await syncBackendCookies(response, cookieStore);

        if (!newAccessToken) {
            throw new Error("서버에서 새 AccessToken을 받지 못했습니다.");
        }

        return verifyToken(newAccessToken);

    } catch (e) {
        console.error("토큰 재발급 최종 실패:", e);
        await signOutAndRedirect();
        return null;
    }
}

export async function loginWithGoogle() {
    redirect(`${API_URL}/auth/google`)
}

export async function loginWithGithub() {
    redirect(`${API_URL}/auth/github`)
}

export async function loginWithKakao() {
    redirect(`${API_URL}/auth/kakao`)
}
