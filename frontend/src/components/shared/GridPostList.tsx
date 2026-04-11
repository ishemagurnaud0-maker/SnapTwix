import type { PostWithUser } from "@/types";
import { useUserContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

interface GridListProps {
  posts: PostWithUser[];
  showUser?:boolean;
  showStats?:boolean;
}

const GridPostList = ({ posts, showUser = true , showStats = true  }: GridListProps) => {

    const { user } = useUserContext();
  return (
    <ul className='grid-container'>
    {posts.map((post) => (
        <li key={post.$id} className='relative min-w-80 h-80'>
            <Link to={`/posts/${post.$id}`} className='grid-post_link'>
            <img src={post.imageUrl} alt= "post" className='h-full w-full object-cover'/>
            </Link>

            <div className='grid-post_user'>
                {showUser && (
                <div className='flex items-center gap-2 justify-center flex-1'>
                <img src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt='creator' className='w-8 h-8 rounded-full'/>
                <p className="line-clamp-1 ">{post?.creator?.name || 'Unknown'}</p>
                </div>
                )}
                {showStats  &&  (<PostStats post={post} user_id={user.id}/>)}

            </div>
        </li>
    ))}
    </ul>
  )
}

export default GridPostList