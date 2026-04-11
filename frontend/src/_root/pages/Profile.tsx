import { 
  useNavigate,
  useLocation,
  Link,
  useParams
} from 'react-router-dom'
import { useGetUserById } from '@/lib/react-query/queries&Mutations'
import StatBoard from '@/components/shared/StatBoard'
import { useUserContext } from "@/context/AuthContext"
import Loader from '@/components/shared/Loader'

const Profile = () => {
  const { user } = useUserContext()
  const { id } = useParams();
  return (
    <div className='profile-container'>
      <div className='profile-inner_container'>
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
           {/* <img src={} alt="" /> */}

        </div>

        </div> 
    </div>
  )
}

export default Profile