import { 
  useLocation,
  Link,
  useParams,
  Route,
  Routes,
  Outlet
} from 'react-router-dom'
import { useGetRecentPosts } from '@/lib/react-query/queries&Mutations'
import StatBoard from '@/components/shared/StatBoard'
import { useUserContext } from "@/context/AuthContext"

import GridPostList from '@/components/shared/GridPostList'
import { Button } from '@/components/ui/Button'
import LikedPosts from './LikedPosts'

const Profile = () => {
  const { user } = useUserContext()
  const { id } = useParams();
  const { pathname } = useLocation();

  const { data: postsData } = useGetRecentPosts();
  const posts = postsData?.documents?.filter(post => post.user_id === (id || user.id)) || [];
   


  return (
    <div className='profile-container'>
      <div className='profile-inner_container'>
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
            <img src={`${user?.imageUrl}` || '/assets/icons/profile-placeholder.svg'} alt="icreator-image" className='w-24 h-24 rounded-full'/> 
            <div className="flex flex-col w-full justify-start">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">{user?.name}</h1>
              <p className="medium-semibold text-light-3 ">{user?.username}</p>
              <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20 ">
                <StatBoard user_id={user.id}/>
              </div>
             

            </div>
                 {
                user.id === id && (
                <Link to={`/u[date-profile/${user.id}`} className='h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg'>
                  <img 
                  src='/assets/icons/edit.svg'
                  alt="edit"
                  width={20}
                  height={20}
                  />

                  <p className='flex whitespace-nowrap small-medium'> Edit Profile</p>
                </Link>
                )

              }
           </div>
           <div className={user.id === id ? 'hidden' : 'block'}>
            <Button type='button' className='shad-button_primary px-8' onClick={() => {}}>
              Follow
            </Button>
           </div>
           
        </div> 
              {user.id === id && (
                <div className='flex max-w-5xl w-full'>
                  <Link to={`/profile/${user.id}`} className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>

              <img 
              src='/assets/icons/posts.svg'
              alt="posts"
              width={20}
              height={20}
              />
              Posts
                  
                  </Link>
                <Link to={`/profile/${id}/liked-posts`} className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}>
              <img 
              src='/assets/icons/like.svg'
              alt="like"
              width={20}
              height={20}
              />
              Liked Posts
                </Link>
                </div>
              )}
        <Routes>
        <Route
          index
          element={<GridPostList posts={posts} showUser={false} showStats={false}/>}
        />
        {id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
       
        </div>


     )
    
            
  
}

export default Profile