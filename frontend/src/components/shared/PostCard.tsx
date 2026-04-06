import { Link } from 'react-router-dom'
import type { Models } from "appwrite";
import { formatDate } from '@/lib/utils';
import { useUserContext } from '@/context/AuthContext';

   type PostWithUser = Models.Document & {

  userId?: string;
  creator?: {name: string, username?: string, imageUrl?: string} | null;
  location?: string;
  imageUrl?: string;
  caption?: string;
  tags?: string[];
};

const PostCard = ({ post }: {post: PostWithUser}) => {
    const { user } = useUserContext();
  return (
    <div className='post-card'>
        <div className='flex-between'>
           <div className='flex items-center gap-3'>
            <Link to={`/profile/${post.userId}`}>
            <img src={post?.creator?.imageUrl || post?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="profile" className='w-8 h-8 rounded-full' />
            </Link>
            <div className='flex flex-col'>
                <p className='base-medium text-light-1 lg:body-bold'>{post?.creator?.name || 'Unknown User'}</p>
                <div className='flex-center gap-2 text-light-3'>
                    <p className='subtle-semibold lg:small-regular'>{formatDate(post.$createdAt)}</p>
                    -
                    <p className="subtle-semibold lg:small-regular">{post.location || 'Unknown Location'}</p>
                </div>
                </div>
            </div>

            <Link to={`/update-post/${post.$id}`}
            className={`${user.id === post.userId ? '' : 'hidden'}`}>
            <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
            </Link>
        </div>
        <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium lg:base-medium py-5">
            <p>{post.caption}</p>
            <ul className='flex gap-1 mt-2'>
                {post.tags?.map((tag:string) => (
                    <li key={tag} className="text-light-3">
                        #{tag}
                    </li>
                ))}
            </ul>
            
        </div>
        <img src={post.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="post image" className='post-card_img' />
        </Link>


    </div>
  )
}

export default PostCard