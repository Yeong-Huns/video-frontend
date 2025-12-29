import {UseMutationCallback} from "@/types";
import {useSetAtom} from "jotai";
import {userAtom} from "@/store/auth";
import {useMutation} from "@tanstack/react-query";
import {signInAction} from "@/actions/auth/auth";

export function useSignIn(callbacks?: UseMutationCallback) {
    const setPayload = useSetAtom(userAtom);

    return useMutation({
        mutationFn: signInAction,
        onError: (error) => {
            console.error(error)
            if (callbacks?.onError) callbacks.onError(error)
        },
        onSuccess: (data) => {
            console.log(data)
            setPayload(data)
            if (callbacks?.onSuccess) callbacks.onSuccess();
        }
    })
}