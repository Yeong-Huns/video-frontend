"use client"

import {PropsWithChildren} from "react";
import {Provider} from "jotai/react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import AuthProvider from "@/components/providers/auth-provider";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {Toaster} from "sonner";

const queryClient = new QueryClient({
    defaultOptions: {queries: {retry: false}}
});

export default function Providers({children}: PropsWithChildren) {
    return (
        <Provider>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools/>
                <Toaster/>
                {/* 스토어 초기화용 */}
                <AuthProvider/>
                {children}
            </QueryClientProvider>
        </Provider>
    )
}