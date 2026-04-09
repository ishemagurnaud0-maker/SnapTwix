import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
import {useLikePost,useSavePost,useDeletePost,useGetSavedPosts} from '@/lib/react-query/queries&Mutations'
import type { PostWithUser, SavedPost } from '@/types';
import {useState,useEffect} from 'react'
import { checkIsLiked } from "@/lib/utils";
import type { Models } from "appwrite";
import Loader from './Loader';

interface PostStatsProps {
  post: PostWithUser;
  user_id: string;
}

const PostStats = ({ post, user_id }: PostStatsProps) => {
        
        

        
        const [ likes,setLikes ] = useState<string[]>([]);
        const [ isSaved,setIsSaved ] = useState(false);

        // Sync likes state with post data when it changes
        useEffect(() => {
            if (post?.Likes) {
                const likeIds = post.Likes.map((user:any) =>
                  typeof user === 'string' ? user : user.$id
                );
                setLikes(likeIds);
            }

              
        }, [post]);

    const { user } = useUserContext();
    //const {data: currentUser} = useGetCurrentUser();
    const {data: savedPosts, error: savedPostsError} = useGetSavedPosts(user?.id || '');

    // Log error for debugging
    if (savedPostsError) {
        console.error('Error fetching saved posts:', savedPostsError);
    }

    const { mutate: likePost } = useLikePost();
    const { mutate: savePost, isPending:isSavingPost } = useSavePost();
    const { mutate: deleteSavedPost, isPending:isDeletingSavedPost } = useDeletePost();

    

     const savedPostRecord = savedPosts?.documents.find((record: Models.Document) => (record as unknown as SavedPost).post === post?.$id) as SavedPost | undefined;

     useEffect(() =>{
      setIsSaved(!!savedPostRecord);
     },[savedPosts])
  

const handleLikePost = (e: React.MouseEvent) => {
  e.stopPropagation();

  let newLikes = [...likes];
  const hasLiked = newLikes.includes(user_id);

  if(hasLiked){
    newLikes = newLikes.filter((id) => id !== user_id);
  } else {
    newLikes.push(user_id);
  }

  setLikes(newLikes);
  if (post?.$id) {
    likePost({ postId: post.$id, likesArray: newLikes });
  }

}

const handleSavePost = (e: React.MouseEvent) => {
  e.stopPropagation();

    if(savedPostRecord){
        setIsSaved(false);
        deleteSavedPost(savedPostRecord.$id);
      }else if (post?.$id && user?.id){
        savePost({ postId: post.$id, userId: user.id });
      }
}


  return (
    <div className="flex justify-between items-center z-20">
        <div className='flex gap-2 mr-5'>
            <img
                src={checkIsLiked(likes,user_id) ? '/assets/icons/liked.svg' : '/assets/icons/like.svg'}
                alt='heart'
                width={20}
                height={20}
                onClick={handleLikePost}
                className='cursor-pointer'
            />
            <p className='small-medium lg:base-medium'>{likes.length}</p>
        </div>

        <div className='flex gap-3'>
            <Link to={`/update-post/${post?.$id || ''}`}
            className={`${user?.id === post?.user_id ? '' : 'hidden'}`}>
            <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
            </Link>
{isSavingPost || isDeletingSavedPost ? (
    <Loader/>
) : (
            <img
                src={isSaved ? '/assets/icons/saved.svg' : '/assets/icons/save.svg'}
                alt='save'
                width={20}
                height={20}
                onClick={handleSavePost}
                className='cursor-pointer'
            />
)} 
        </div>
    </div>
  )
}

export default PostStats