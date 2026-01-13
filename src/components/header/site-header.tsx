"use client"

import Link from "next/link";
import {usePathname} from "next/dist/client/components/navigation";
import {Input} from "@/components/ui/input";
import {BookOpen, Layers, Map, MessageSquare, MonitorPlay, Search, Users} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import defaultAvatar from "@/assets/default-avatar.jpg";
import {useCourseCategories} from "@/hooks/queries/use-course-categories";
import ComponentLoader from "@/components/loader/component-loader";

export default function SiteHeader() {
    const pathname = usePathname();
    const isCategoryNeeded = pathname == "/" || pathname.includes("/courses");
    const {data: categories, isLoading} = useCourseCategories();

    if (pathname === "/sign-in" || pathname === "/sign-up") {
        return null;
    }

    return (
        <header className="site-header w-full bg-white">
            <div className="max-w-[1440px] mx-auto">
                {/* 상단 로우: 로고, 네비게이션, 지식공유자 & 아바타 */}
                <div className="header-top flex items-center justify-between px-8 py-3">
                    {/* 로고 */}
                    <div className="logo">
                        <Link href="/" className="flex items-center gap-2 group">
                            <MonitorPlay className="text-red-600 transition-transform group-hover:scale-110" size={32}/>
                            <span className="text-xl font-black tracking-tighter text-gray-900">
                                Stream Birds
                            </span>
                        </Link>
                    </div>
                    {/* 네비게이션 */}
                    <nav className="main-nav flex gap-x-12 text-base font-bold text-gray-700">
                        <Link href="#"
                              className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-[#f0f1f3] hover:text-red-600 transition-all">
                            <BookOpen size={18}/>
                            강의
                        </Link>
                        <Link href="#"
                              className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-[#f0f1f3] hover:text-red-600 transition-all">
                            <Map size={18}/>
                            로드맵
                        </Link>
                        <Link href="#"
                              className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-[#f0f1f3] hover:text-red-600 transition-all">
                            <MessageSquare size={18}/>
                            멘토링
                        </Link>
                        <Link href="#"
                              className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-[#f0f1f3] hover:text-red-600 transition-all">
                            <Users size={18}/>
                            커뮤니티
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {/* 지식공유자 버튼 */}
                        <Link href="/instructor">
                            <Button
                                variant="ghost"
                                className="h-10 px-4 font-semibold border-gray-200 rounded-full hover:bg-[#f0f1f3] hover:text-red-600 transition-all"
                            >
                                지식공유자
                            </Button>
                        </Link>
                        {/* Avatar */}
                        <Avatar className="w-10 h-10 p-0.5 border-2 border-gray-200 hover:border-red-600 transition-all cursor-pointer">
                            <AvatarImage src={defaultAvatar.src} alt="user avatar" className="rounded-full"/>
                            <AvatarFallback>
                    <span role="img" aria-label="user">
                      👤
                    </span>
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>

                {/* 중간 로우: 검색창 */}
                <div className="header-middle flex justify-center px-8 py-4">
                    <div className="relative flex w-full max-w-2xl items-center">
                        <Input
                            type="text"
                            placeholder="나의 진짜 성장을 도와줄 실무 강의를 찾아보세요"
                            className="w-full h-12 bg-gray-50 border-gray-200 focus-visible:ring-red-600 pr-12 rounded-full px-6"
                        />
                        <button
                            type="button"
                            className="absolute right-4 p-1 text-gray-400 hover:text-red-600 transition-colors"
                            tabIndex={-1}
                        >
                            <Search size={22}/>
                        </button>
                    </div>
                </div>

                {/* 하단 로우: 카테고리 (중앙 정렬) */}
                {isCategoryNeeded && (
                    <div className="header-bottom bg-white mt-2 border-b">
                        <nav
                            className="category-nav flex justify-center gap-6 px-8 overflow-x-auto scrollbar-none items-center">
                            {isLoading ? (
                                <ComponentLoader/>
                            ) : (
                                categories?.map((category) => (
                                    <Link key={category.id} href={`/courses/${category.slug}`}>
                                        <div
                                            className="category-item flex flex-col items-center min-w-[72px] text-gray-700 hover:text-red-600 cursor-pointer transition-colors border-b-2 border-gray-100 hover:border-red-600 pb-2">
                                            <Layers size={28} className="mb-1"/>
                                            <span className="text-xs font-medium whitespace-nowrap">
                                                                                                                {category.name}
                                                                                                            </span>
                                        </div>
                                    </Link>))
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}