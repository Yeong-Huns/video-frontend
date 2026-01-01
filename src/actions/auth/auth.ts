"use server"

import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {API_URL} from "@/lib/constant";
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

        const setCookieHeader = response.headers.getSetCookie();
        let accessToken = "";

        if (setCookieHeader) {
            const parsedCookies = parse(setCookieHeader);
            parsedCookies.forEach((cookie) => {
                /* 엑세스토큰, 리프레쉬 토큰 둘 다 들어와야함 */
                console.log(cookie);

                if (cookie.name === "accessToken") {
                    accessToken = cookie.value;
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
            })
        } else {
            console.warn("서버에서 쿠키응답을 받지 못했습니다. ")
        }

        if (accessToken) {
            try {
                const decodedToken = jwtDecode<Payload>(accessToken);

                return {
                    id: decodedToken.id,
                    role: decodedToken.role,
                    type: decodedToken.type,
                    iat: decodedToken.iat,
                    exp: decodedToken.exp
                }
            } catch (e) {
                console.error('토큰 디코딩 실패: ', e)
            }
        }

        return null;
    } catch (error: any) {
        console.error("sign in action error: ", error);
        throw new Error(error.message);
    }
}

/* 로그아웃 및 로그인 페이지로 이동 */
export async function signOutAndRedirect() {
    const cookieStore = await cookies();

    /* 프론트엔트 쿠키 삭제 */
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    /* 백엔드 로그아웃 요청 */
    try {
        await fetch(`${API_URL}/auth/sign-out`, {
            method: "POST",
            headers: {Cookie: cookieStore.toString()}
        });
    } catch (e) {
        console.warn("백엔드 로그아웃 호출 실패");
    }
    /*로그인 페이지로 이동 */
    redirect("/sign-in?reason=session_expired");
}

export async function getAccessTokenAction(): Promise<Payload | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) return null;

    try {
        const decoded = jwtDecode<Payload>(accessToken);
        return {
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

export async function loginWithGoogle() {
    redirect(`${API_URL}/auth/google`)
}

export async function loginWithGithub() {
    redirect(`${API_URL}/auth/github`)
}

export async function loginWithKakao() {
    redirect(`${API_URL}/auth/kakao`)
}