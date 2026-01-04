import {CreateClientConfig} from "@/client/client";
import {API_URL} from "@/lib/constant";
import {getCookie} from "cookies-next";
import {cookies} from "next/headers";

export const createClientConfig: CreateClientConfig = (config) => ({
    ...config,
    baseUrl: API_URL,
    async auth() {
        return getCookie('accessToken', {cookies});
    },
});