import type { INewUser } from "@/types";
import { 
    useMutation,
    useQuery,
    useQueryClient,
    useInfiniteQuery,
    
} from "@tanstack/react-query";
import { createUserAccount,signInUser,signOutUser } from "../appwrite/api";


export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user:INewUser) => {
           return createUserAccount(user);
        }
    });
}


export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user:{email:string,password:string}) => {
           return signInUser(user);
        }
    });
}


export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutUser
    });
}