import { useGetSavedPosts} from '@/lib/react-query/queries&Mutations'
import {useUserContext} from '@/context/AuthContext'
import Loader from '@/components/shared/Loader'
import GridPostList from '@/components/shared/GridPostList'
import type { PostWithUser } from '@/types'




const SavedPosts = () => {

  
  const {user} = useUserContext()
  const {data: savedPosts, isPending:isLoadingSavedPosts} = useGetSavedPosts(user?.id || '');

  return (
    
      <div className='saved-container'>
        <div className='flex gap-2 w-full max-w-5xl'>
          <img src="/assets/icons/save.svg" alt="save" width={35} height={35}  className='invert-white'/>
            <h2 className='h3-bold md:h2-bold text-left w-full'>Saved Posts</h2>
        </div>
      


    
    {isLoadingSavedPosts ? (
      <Loader />
    ) : (
      <ul className='w-full flex justify-center max-w-5xl gap-9'>
        {savedPosts?.documents.length === 0  ? (
          <p className='text-light-4'>No saved posts</p>
        ) : (
          <GridPostList posts={savedPosts?.documents as PostWithUser[]} showStats={false} showUser={false}/>
        )}
        
      </ul>
      
    )
  }
      </div>
  )
}

export default SavedPosts