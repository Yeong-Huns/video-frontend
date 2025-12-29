import {atom} from "jotai";

export interface Payload {
    id: string,
    role: string,
    type: string,
    iat: number,
    exp: number
}

export const userAtom = atom<Payload | null>(null);

export const isAuthenticatedAtom = atom((get) => !!get(userAtom))