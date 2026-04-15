import { Link } from 'react-router-dom'

import { multiFormatDateString } from '@/lib/utils';

import { useUserContext } from '@/context/AuthContext';

import PostStats from './PostStats';
import type { PostWithUser } from '@/types';




const PostCard = ({ post }: {post: PostWithUser}) => {

    const { user } = useUserContext();

  return (

    <div className='post-card'>

        <div className='flex-between'>

           <div className='flex items-center gap-3'>

            <Link to={`/profile/${post.user_id}`}>

            <img src={post?.creator?.imageUrl || post?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="profile" className='w-8 h-8 rounded-full' />

            </Link>

            <div className='flex flex-col'>

                <p className='base-medium text-light-1 lg:body-bold'>{post?.creator?.name || 'Unknown User'}</p>

                <div className='flex-center gap-2 text-light-3'>

                    <p className='subtle-semibold lg:small-regular'>{multiFormatDateString(post.$createdAt)}</p>

                    -

                    <p className="subtle-semibold lg:small-regular">{post.location || 'Unknown Location'}</p>

                </div>

                </div>

            </div>



            

        </div>

        <Link to={`/posts/${post.$id}`}>

        <div className="small-medium lg:base-medium lg:base-medium py-5">
            
            {/* Display media (image or video) */}
            <div className="flex justify-center mb-4">
                {post?.imageUrl?.toLowerCase().includes('.mp4') || post?.imageUrl?.toLowerCase().includes('.mov') || post?.imageUrl?.toLowerCase().includes('.avi') || post?.imageUrl?.toLowerCase().includes('.mkv') || post?.imageUrl?.toLowerCase().includes('.webm') ? (
                    <video 
                        src={post.imageUrl} 
                        controls 
                        autoPlay
                        loop
                        className="w-full h-auto max-h-96 rounded-lg object-cover"
                    />
                ) : (
                    <img 
                        src={post.imageUrl} 
                        alt="post" 
                        className="post-card-img"
                    />
                )}
            </div>

            <p>{post.caption}</p>

            <ul className='flex gap-1 mt-2'>

                {(Array.isArray(post.tags) ? post.tags : post.tags?.split(',') || []).map((tag:string) => (

                    <li key={tag.trim()} className="text-light-3">

                        #{tag.trim()}

                    </li>

                ))}

            </ul>

            

        </div>

        </Link>

        <PostStats post={post} user_id={user.id}/>




    </div>

  )

}



export default PostCard