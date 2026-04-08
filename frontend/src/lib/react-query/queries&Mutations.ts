import type { INewUser, INewPost, IUpdatePost } from "@/types";
import { 
    useMutation,
    useQuery,
    useQueryClient,
   // useInfiniteQuery,
    
} from "@tanstack/react-query";
import { createUserAccount,signInUser,signOutUser,createNewPost,getRecentPosts,likePost, savePost, deleteSavedPost, getSavedPosts,updatePost,getCurrentUser } from "../appwrite/api";
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

export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({postId,likesArray}:{postId:string,likesArray:string[]}) => {
            return likePost(postId,likesArray)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            });

            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });

            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            });

            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });
        }
    })
}

export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({postId,userId}:{postId:string,userId:string}) => {
            return savePost(postId,userId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });

            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            });

            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });
        }
    })
}


export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(savedPostId:string) => {
            return deleteSavedPost(savedPostId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });

            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            });

            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });
        }
    })
}


export const useGetSavedPosts = (userId:string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_SAVED_POSTS],
        queryFn: () => getSavedPosts(userId),
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(post:IUpdatePost) => {
            return updatePost(post)
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            });
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser,
    })
}
