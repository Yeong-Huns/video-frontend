"use client"

import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {loginWithGithub, loginWithGoogle, loginWithKakao} from "@/actions/auth/auth";
import Image from "next/image";
import google from "@/assets/google.png";
import github from "@/assets/github-mark.svg";
import kakao from "@/assets/kakao.svg";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSignUp} from "@/hooks/mutations/auth/use-sign-up";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

const formSchema = z.object({
    email: z.email({message: "유효한 이메일 형식이 아닙니다."}),
    name: z.string().min(2, {message: "이름은 최소 2글자 이상이어야 합니다."}),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8, {message: "비밀번호는 최소 8자 이상이어야 합니다."})
}).refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"]
})

export default function SignUpPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            passwordConfirm: ""
        }
    });
    const router = useRouter();

    const {mutate: signUp, isPending: isSignUp} = useSignUp({
        onSuccess: () => {
            toast.success("회원가입이 완료되었습니다.", {position: "top-center"});
            router.push("/sign-in");
        },
        onError: (error) => {
            toast.error(error.message, {position: "top-center"});
        }
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        signUp(values);
    }

    return (
        <div className={'flex flex-col items-center justify-center h-screen gap-4'}>
            <Card className={'min-w-[300px]'}>
                <CardContent className={'flex flex-col gap-2'}>
                    <div className={'flex flex-col gap-y-3 justify-center mb-8'}>
                        <h1 className={'text-3xl font-bold text-center'}>회원가입</h1>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className={'flex flex-col gap-4 min-w-[300px]'}>
                           <FormField control={form.control} name={"email"} render={({field}) => (
                               <FormItem>
                                   <FormLabel>이메일</FormLabel>
                                   <FormControl>
                                       <Input type={"email"} className={'border rounded-sm p-2'}
                                              placeholder={'example@google.com'} {...field}/>
                                   </FormControl>
                                   <FormMessage/>
                               </FormItem>
                           )}/>
                            <FormField control={form.control} name={"name"} render={({field}) => (
                                <FormItem>
                                    <FormLabel>성명</FormLabel>
                                    <FormControl>
                                        <Input className={'border rounded-sm p-2'}
                                               placeholder={'홍길동'} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name={"password"} render={({field}) => (
                                <FormItem>
                                    <FormLabel>비밀번호</FormLabel>
                                    <FormControl>
                                        <Input type={"password"} className={'border rounded-sm p-2'}
                                               placeholder={'password'} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name={"passwordConfirm"} render={({field}) => (
                                <FormItem>
                                    <FormLabel>비밀번호 확인</FormLabel>
                                    <FormControl>
                                        <Input type={"password"} className={'border rounded-sm p-2'}
                                               placeholder={'password'} {...field}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                            <Button disabled={isSignUp} variant={'outline_red'}
                                    className={'font-bold cursor-pointer rounded-sm p-2 mt-2'}
                                    type={'submit'}>가입하기</Button>
                        </form>
                    </Form>
                    <div className={'flex gap-4 mt-1 justify-center items-center text-center text-sm'}>
                        <Link href={'/forget-password'}
                              className={'text-xs text-muted-foreground hover:underline'}>아이디 찾기</Link>
                        <div className={'text-xs text-muted-foreground'}>/</div>
                        <Link href={'/forget-password'}
                              className={'text-xs text-muted-foreground hover:underline'}>비밀번호 찾기</Link>
                        <div className={'text-xs text-muted-foreground'}>/</div>
                        <Link href={'/sign-in'}
                              className={'text-xs text-muted-foreground hover:underline'}>로그인</Link>
                    </div>
                    <hr className={'mt-1'}/>
                    <div className={'flex justify-center gap-x-3'}>
                        <Button onClick={loginWithGoogle} disabled={isSignUp} variant={'outline'} size={"icon-lg"}
                                className={'rounded-lg'}>
                            <Image width={24} height={24} src={google.src} alt={'google'}
                                   className={'cursor-pointer rounded- object-cover'}/>
                        </Button>
                        <Button onClick={loginWithGithub} disabled={isSignUp} variant={'outline'} size={"icon-lg"}
                                className={'rounded-lg'}>
                            <Image width={24} height={24} src={github.src} alt={'github'}
                                   className={'cursor-pointer rounded- object-cover'}/>
                        </Button>
                        <Button onClick={loginWithKakao} disabled={isSignUp} variant={'outline'} size={"icon-lg"}
                                className={'rounded-lg'}>
                            <Image width={24} height={24} src={kakao.src} alt={'kakao'}
                                   className={'cursor-pointer rounded- object-cover'}/>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}