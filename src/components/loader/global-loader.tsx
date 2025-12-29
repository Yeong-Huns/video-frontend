"use client"

import {LoaderCircleIcon} from "lucide-react";

export default function GlobalLoader() {
    return <div className={'h-screen w-screen bg-muted flex flex-col items-center justify-center'}>
        <div className={'flex items-center gap-4 mb-15 animate-bounce'}>
            <LoaderCircleIcon className={'animate-spin'}/>
            <div className={'text-sm'}>로딩중...</div>
        </div>
    </div>
}