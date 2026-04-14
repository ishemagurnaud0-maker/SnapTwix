import {useGetStats} from  '@/lib/react-query/queries&Mutations'
import Loader from '@/components/shared/Loader'
import {Link} from 'react-router-dom';

interface StatBoardProps {
  user_id: string;
  followers:number;
  following:number ;
}

const StatBoard = ({ user_id,followers,following }: StatBoardProps) => {

    const {data: user, isPending:isLoadingStats} = useGetStats(user_id);
    
  return (
        <>
        <div className='flex-center gap-2'>
            {
                isLoadingStats ? (
                    <Loader />
                ) : (
                    <>
                        <div className='text-center'>
                            <p className='text-light-2 small-semibold'>Posts</p>
                            <p className='base-medium text-light-4'>{user?.posts?.length || 0}</p>
                        </div>
                        <Link to='/followers' className='text-center'>
                            <p className='text-light-2 small-semibold'>Followers</p>
                            <p className='base-mediumn text-light-4'>{followers || 0}</p>
                        </Link>
                        <Link to='/following' className='text-center'>
                            <p className='text-light-2 small-semibold'>Following</p>
                            <p className='base-medium text-light-4'>{following || 0}</p>
                        </Link>
                    </>
                )
            }
        </div>
        </>
  )
}

export default StatBoard
