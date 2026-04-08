import type { Models } from "appwrite";
import { Link } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

type PostWithUser = Models.Document & {
  user_id?: string;
  creator?: {name: string, username?: string, imageUrl?: string} | null;
  location?: string;
  imageUrl?: string;
  caption?: string;
  tags?: string | string[];
};

interface PostStatsProps {
  post: PostWithUser;
  user_id: string;
}

const PostStats = ({ post, user_id }: PostStatsProps) => {
    const { user } = useUserContext();
  return (
    <div className="flex justify-between items-center z-20">
        <div className='flex gap-2 mr-5'>
            <img
                src='assets/icons/like.svg'
                alt='heart'
                width={20}
                height={20}
                onClick={() => {}}
                className='cursor-pointer'
            />
            <p className='small-medium lg:base-medium'>0</p>
        </div>

        <div className='flex gap-3'>
            <Link to={`/update-post/${post.$id}`}
            className={`${user.id === post.user_id ? '' : 'hidden'}`}>
            <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
            </Link>
            <img
                src='assets/icons/save.svg'
                alt='save'
                width={20}
                height={20}
                onClick={() => {}}
                className='cursor-pointer'
            />
            
        </div>
    </div>
  )
}

export default PostStats