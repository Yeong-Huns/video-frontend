"use client"

import {useAtom} from "jotai";
import {userAtom} from "@/store/auth";
import {Suspense, useEffect} from "react";
import {toast} from "sonner";
import GlobalLoader from "@/components/loader/global-loader";
import {getAccessTokenAction} from "@/actions/auth/auth";

function AuthListener() {
    const [user, setUser] = useAtom(userAtom);

    useEffect(() => {
        const checkUser = async () => {
            if (!user) {
                try {
                    const loginUser = await getAccessTokenAction();
                    if (loginUser) setUser(loginUser);
                } catch (e) {
                    setUser(null);
                    toast.error('로그인이 만료 되었습니다.', {position: "top-center"});
                }
            }
        }
        checkUser();
    }, []);

    return null;
}

export default function AuthProvider() {
    return (
        <Suspense fallback={<GlobalLoader/>}>
            <AuthListener/>
        </Suspense>
    )
}