import { Link, useNavigate } from "react-router-dom"
import { useEffect } from 'react'
import { Button } from "../ui/Button"
import { useSignOutAccount } from "@/lib/react-query/queries&Mutations"
import { useUserContext } from "@/context/AuthContext"



const LeftSidebar = () => {
  const navigate = useNavigate();
  const { mutate: signOutUser ,isPending:isSigningOut} = useSignOutAccount();

  const { user } = useUserContext();
  
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-10">
         <Link to="/" className="flex gap-3 items-center">
        <img src="/assets/icons/logo.png" alt="logo" width={50} height={50} />
        </Link>

        <Link to={`profile/${user.id}`}>
          <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="profile" className="h-12 w-12 rounded-full" />

          <div className="flex flex-col">
            <p className="body-semibold">{user.name}</p>
            <p className="small-regular">{user.username}</p>
          </div>
        </Link>

    <ul className="flex flex-col gap-6">
        <Link to=''></Link>
    </ul>
        
        

      </div>
    </nav>
  )
}

export default LeftSidebar