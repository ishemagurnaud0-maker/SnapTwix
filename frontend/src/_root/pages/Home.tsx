import Loader from "@/components/shared/Loader";
import { useGetRecentPosts } from "@/lib/react-query/queries&Mutations";
import type { PostWithUser } from "@/types";
import PostCard from "@/components/shared/PostCard.tsx";
import RightSidebar from "@/components/shared/RightSidebar"

const Home = () => {
  const {data:posts, isPending:isPostLoading} = useGetRecentPosts();

  return (
    <div className="flex flex-1">
      <div className='home-container'>
        <div className='home-posts'>
          <h2 className='h3-bold md:h2-bold text-left w-full'>Home Feed</h2>
          {isPostLoading && !posts ? (
            <Loader/>
          ) : (
            <div className='flex flex-col gap-10'>
              {/* Posts */}
              <ul className="flex flex-col flex-1 gap-9 w-full">
                {posts?.documents.map((post:PostWithUser) => {
                  return (
                    <PostCard key={post.$id} post={post}/>
                  )
                }) }
              </ul>
            </div>
          )}
        </div>
      </div>
      

      
    </div>
  )
}

export default Home