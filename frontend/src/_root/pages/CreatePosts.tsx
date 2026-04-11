
import PostForm from "@/components/forms/PostForm"
                                                                                                                                                                                                                                                                                                                                                                       
const CreatePosts = () => {
  return (
    <div className="flex flex-1">
        <div className="common-container">
          <div className='flex-start gap-3 w-full max-w-5xl justify-start'>
            <img src="/assets/icons/add-post.svg" alt="add-post" width={40} height={40}/>
            <h2 className="h3-bold md:h2-bold text-left w-full">Create Post</h2>
            </div>
            <PostForm action='Create'/>
        </div>
    </div>
  )
}

export default CreatePosts