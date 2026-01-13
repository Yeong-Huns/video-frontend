"use client"

import {LoaderCircleIcon} from "lucide-react";

export default function ComponentLoader() {
    return (
        <div className="flex w-full items-center justify-center p-4">
            <div className="flex items-center gap-2">
                <LoaderCircleIcon className="animate-spin text-red-600" size={20}/>
                <span className="text-sm text-gray-500">불러오는 중...</span>
            </div>
        </div>
    );
}
