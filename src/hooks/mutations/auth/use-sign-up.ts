import {UseMutationCallback} from "@/types";
import {useMutation} from "@tanstack/react-query";
import {signUpAction} from "@/actions/auth/auth";

export function useSignUp(callbacks?: UseMutationCallback) {
    return useMutation({
        mutationFn: signUpAction,
        onError: (error) => {
            if (callbacks?.onError) callbacks.onError(error)
        },
        onSuccess: (data) => {
            if (callbacks?.onSuccess) callbacks.onSuccess();
        }
    })
}