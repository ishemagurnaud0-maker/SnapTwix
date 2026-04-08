import type { INewUser, INewPost } from "@/types";
import { 
    useMutation,
    useQuery,
    useQueryClient,
   // useInfiniteQuery,
    
} from "@tanstack/react-query";
import { createUserAccount,signInUser,signOutUser,createNewPost,getRecentPosts } from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";


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

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post:INewPost) => {
            return createNewPost(post);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });
        },

        onError: (error) => {
            console.log(error);
        }
    })


}


export const useGetRecentPosts = () => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: () => getRecentPosts(),
    })
}
