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
    
    if (!posts || posts.length === 0) {
        return (
            <div className="flex-center flex-col w-full h-full gap-8">
                <p className="text-center xl:text-center h3-bold md:h1-semibold w-full text-light-3">Create Your First Post</p>

                <Link to="/create-post" className="flex-center w-full max-w-[260px]">
                    <button className="flex-center w-full max-w-[260px]">
                        <img src='/assets/icons/file-upload.svg' alt='create-post' />
                    </button>
                </Link>
            </div> 
        );
    }
    
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