import { useState } from 'react';
import type {Models} from 'appwrite'
import {Button} from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import { useUserContext } from '@/context/AuthContext'
import { useFollowUser } from '@/lib/react-query/queries&Mutations'

interface UserDocument extends Models.Document {
    accountId?: string;
    username?: string;
    name?: string;
    email?: string;
    imageUrl?: string;
    password?: string;
}

interface userCardProps {
    user: UserDocument
}

const UserCard = ({user}: userCardProps) => {
  const [isfollower,setIsFollower] = useState<string>('');
const { user:currentUser} = useUserContext();
const {mutateAsync:followUser, isLoading:isFollowing} = useFollowUser();

const handleFollowRequest = async() => {

  const follower = 
}

  return (
    <Link to={`/profile/${user.$id}`}>
        <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt='creator' className='rounded-full w-14 h-14' />

        <div className='flex-center flex-col gap-1'>
            <p className='base-medium text-light-1 text-center line-clamp-1'>
                {user.name}
            </p>
            <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>

        </div>

        <Button type='button'  size="sm"className={` ${currentUser.id === user.$id  ? 'hidden' : 'shad-button_primary px-5' }`} onClick={() => {}}>
          Follow
        </Button>
    </Link>
  )
}

export default UserCard
