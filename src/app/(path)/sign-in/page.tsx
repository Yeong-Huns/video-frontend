"use client"

import {useState} from "react";
import Link from "next/link";
import {Card, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useSignIn} from "@/hooks/mutations/auth/use-sign-in";
import {toast} from "sonner";
import google from "@/assets/google.png";
import github from "@/assets/github-mark.svg"
import kakao from "@/assets/kakao.svg"
import Image from 'next/image';
import {useRouter} from "next/navigation";
import {loginWithGithub, loginWithGoogle, loginWithKakao} from "@/actions/auth/auth";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const {mutate: signIn, isPending: isSignIn} = useSignIn({
        onSuccess: () => {
            toast.info("로그인 성공", {position: "top-center"});
            router.push("/");
        },
        onError: (error) => {
            toast.error(error.message, {position: "top-center"});
        }
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email.trim() === "" || password.trim() === "") return;
        signIn({email, password});
    };

    return (
        <div className={'flex flex-col items-center justify-center h-screen gap-4'}>
            <Card className={'min-w-[300px]'}>
                <CardContent className={'flex flex-col gap-2'}>
                    <div className={'flex flex-col gap-y-3 justify-center mb-8'}>
                        <h1 className={'text-3xl font-bold text-center'}>로그인</h1>
                    </div>
                    <form onSubmit={handleSubmit} className={'flex flex-col gap-4 min-w-[300px]'}>
                        <div className={'flex flex-col gap-y-2'}>
                            <Label htmlFor={'email'}>이메일</Label>
                            <Input disabled={isSignIn} className={'border rounded-sm p-2'} value={email}
                                   onChange={(e) => setEmail(e.target.value)} type={'email'} name={'email'}
                                   placeholder={'example@seesaw.com'}/>
                        </div>
                        <div className={'flex flex-col gap-y-2'}>
                            <Label htmlFor={'password'}>비밀번호</Label>
                            <Input disabled={isSignIn} className={'border rounded-sm p-2'} value={password}
                                   onChange={(e) => setPassword(e.target.value)} type={'password'} name={'password'}
                                   placeholder={'password'}/>
                        </div>
                        <div className={'flex flex-col gap-y-2 mt-2'}>
                            <Button disabled={isSignIn} variant={'outline_red'}
                                    className={'font-bold cursor-pointer rounded-sm p-2'}
                                    type={'submit'}>로그인</Button>
                            <div className={'flex gap-4 mt-1 justify-center items-center text-center text-sm'}>
                                <Link href={'/forget-password'}
                                      className={'text-xs text-muted-foreground hover:underline'}>아이디 찾기</Link>
                                <div className={'text-xs text-muted-foreground'}>/</div>
                                <Link href={'/forget-password'}
                                      className={'text-xs text-muted-foreground hover:underline'}>비밀번호 찾기</Link>
                                <div className={'text-xs text-muted-foreground'}>/</div>
                                <Link href={'/sign-up'}
                                      className={'text-xs text-muted-foreground hover:underline'}>회원가입</Link>
                            </div>
                            <hr className={'mt-1'}/>
                        </div>
                        <div className={'flex justify-center gap-x-3'}>
                            <Button onClick={loginWithGoogle} disabled={isSignIn} variant={'outline'} size={"icon-lg"}
                                    className={'rounded-lg'}>
                                <Image width={24} height={24} src={google.src} alt={'google'}
                                       className={'cursor-pointer rounded- object-cover'}/>
                            </Button>
                            <Button onClick={loginWithGithub} disabled={isSignIn} variant={'outline'} size={"icon-lg"}
                                    className={'rounded-lg'}>
                                <Image width={24} height={24} src={github.src} alt={'github'}
                                       className={'cursor-pointer rounded- object-cover'}/>
                            </Button>
                            <Button onClick={loginWithKakao} disabled={isSignIn} variant={'outline'} size={"icon-lg"}
                                    className={'rounded-lg'}>
                                <Image width={24} height={24} src={kakao.src} alt={'kakao'}
                                       className={'cursor-pointer rounded- object-cover'}/>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}