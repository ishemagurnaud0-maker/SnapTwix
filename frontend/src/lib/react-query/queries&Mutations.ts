import type { INewUser, INewPost, IUpdatePost, IUpdateUser } from "@/types";
import { 
    useMutation,
    useQuery,
    useQueryClient,
    useInfiniteQuery,
    
} from "@tanstack/react-query";
import { createUserAccount,signInUser,signOutUser,createNewPost,getRecentPosts,likePost, savePost, deleteSavedPost, getSavedPosts,updatePost,getCurrentUser, getPostById, deletePost,getInfinitePosts,getPostBySearch, getUserById, getStats,getUsers,followUser,unfollowUser,checkIsFollowing,getUserFollowCount,getUserFollowingCount,updateUser } from "../appwrite/api";
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


export const useDeleteSavedPost = () => {
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



export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser,
    })
}


export const useGetPostById = (postId:string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
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

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({postId, imageId}:{postId:string, imageId:string}) => {
            return deletePost(postId,imageId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });
        }
    })
}


export const useGetPost = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: ({ pageParam }: { pageParam: string | null }) => getInfinitePosts({ pageParam }),
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
            if(lastPage &&  lastPage.documents.length === 0) return null;
                
            const lastId = lastPage.documents[lastPage?.documents.length - 1].$id;
            return lastId;
            
        }
    })
}

export const useSearchPosts = (searchTerm:string | '') => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => getPostBySearch(searchTerm),
        enabled: !!searchTerm
    })
}


export const useGetUserById = (userId:string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId
    })
}

export const useGetStats = (userId:string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_STATS, userId],
        queryFn: () => getStats(userId),
        enabled: !!userId
    })
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user:IUpdateUser) => updateUser(user),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID]
            });
        }
    })
}


export const useGetUsers = (limit?:number) => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_USERS],
        queryFn: () => getUsers(limit)
    });
}

export const useFollowUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({followerId,followedId}:{followerId:string,followedId:string}) => followUser(followerId,followedId),
        onSuccess: (_,variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.CHECK_IS_FOLLOWING, variables.followerId, variables.followedId]
            });

            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_FOLLOWERS, variables.followedId]
            })

            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_FOLLOWING, variables.followerId]
            })


        }
    })
}

export const useUnfollowUser = () => {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({followerRecordId}:{followerRecordId:string, followerId:string, followedId:string}) => unfollowUser(followerRecordId),

        onSuccess: (_,variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.CHECK_IS_FOLLOWING, variables.followerId, variables.followedId]
            });

            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_FOLLOWERS, variables.followedId]
            })

            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_FOLLOWING, variables.followerId]
            })


        }
    })
}

export const useCheckIsFollowing = (followerId:string, followedId:string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, followerId, followedId],
        queryFn: () => checkIsFollowing(followerId, followedId),
        enabled: !!(followerId && followedId)
    })
}

export const useGetUserFollowCount = (userId:string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_FOLLOWERS, userId],
        queryFn: () => getUserFollowCount(userId),
        enabled: !!userId
    })
}

export const useGetUserFollowingCount = (userId:string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_FOLLOWING, userId],
        queryFn: () => getUserFollowingCount(userId),
        enabled: !!userId
    })
}


