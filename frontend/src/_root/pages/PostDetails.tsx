import {useGetPostById} from "@/lib/react-query/queries&Mutations";
import { useParams,Link } from "react-router-dom";
import Loader from '@/components/shared/Loader'
import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import PostStats from "@/components/shared/PostStats";

const PostDetails = () => {

const {id} = useParams();
const { user } = useUserContext();

const {data:post, isPending} = useGetPostById(id as string);

const handleDeletePost = () => {
  
}


  return (
    <div className="post_details-container">

        {isPending ? <Loader/> : 
        <div className="post_details-card">

          <img 
          src={post?.imageUrl || '/assets/icons/profile-placeholder.svg'} 
          alt="post" 
        
           />
              <div className='post_details-info'>

                <div className='flex-between w-full'>

                  <Link to={`/profile/${post?.user_id}`} className="flex items-center gap-4">
                        <img src={post?.creator?.imageUrl || post?.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="profile" className='w-8 h-8 rounded-full lg:w-12 lg:h-12' />
                  
             <div className='flex flex-col'>
                 <p className='base-medium text-light-1 lg:body-bold'>{post?.creator?.name || 'Unknown User'}</p>
              <div className='flex-center gap-2 text-light-3'>
                  <p className='subtle-semibold lg:small-regular'>{multiFormatDateString(post?.$createdAt || '')}</p>
                  -
                  <p className="subtle-semibold lg:small-regular">{post?.location || 'Unknown Location'}</p>
            
                </div>
            
                </div>
            </Link>
            <div className='flex-center gap-1'>
              {user.id === post?.creator?.$id ? (
                <> 
               <Button onClick={handleDeletePost}>
                <img 
                  src='/assets/icons/delete.svg'
                  alt='delete'
                  width={24}
                  height={24}
                  />
                </Button> 
              </>
              ) : (
                <div className="hidden"></div>
              )
              }
              
            </div>
                </div>

                <hr className="border w-full border-dark-4/80" />

               <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">

            <p>{post?.caption}</p>

            <ul className='flex gap-1 mt-2'>

                {(Array.isArray(post?.tags) ? post.tags : post?.tags?.split(',') || []).map((tag:string) => (

                    <li key={tag.trim()} className="text-light-3">

                        #{tag.trim()}

                    </li>

                ))}

            </ul>

            

        </div> 

        <div className="w-full">
                <PostStats post={post} user_id={user.id} />
        </div>
        </div>
        


    </div>
}
    </div>
  
        )}
export default PostDetails