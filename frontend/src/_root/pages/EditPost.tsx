import PostForm from "@/components/forms/PostForm"
import { useParams } from "react-router-dom";
import { useGetPostById } from "@/lib/react-query/queries&Mutations";
import Loader from "@/components/shared/Loader";

const EditPost = () => {
const { id } = useParams();
const { data:post, isPending } = useGetPostById(id || "");

if(isPending) {
  return <Loader/>
}

  return (
    <div className="flex flex-1">
        <div className="common-container">
          <div className='flex-start gap-3 w-full max-w-5xl justify-start'>
            <img src="/assets/icons/add-post.svg" alt="add-post" width={40} height={40}/>
            <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
            </div>
            <PostForm action="Update" post={post} />
        </div>
    </div>
  )
}

export default EditPost