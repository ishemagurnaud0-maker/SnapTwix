import { Link, useNavigate } from "react-router-dom"
import { useEffect } from 'react'
import { Button } from "../ui/Button"
import { useSignOutAccount } from "@/lib/react-query/queries&Mutations"
import { useUserContext } from "@/context/AuthContext"

const Topbar = () => {
  const navigate = useNavigate();
  const { mutate: signOutUser ,isPending:isSigningOut} = useSignOutAccount();
  const {user} = useUserContext();
    

useEffect(() => {
    if(isSigningOut) {
        navigate('/sign-in');
    }
}, [isSigningOut])

  return (
   <section className="topbar">
    <div className="flex-between py-1 px-5">
        <Link to="/" className="flex gap-3 items-center">
        <img src="/assets/icons/logo.png" alt="logo" width={50} height={50} />
        </Link>
        <div className="flex gap-4">
            <Button variant="ghost" className="shad-button_ghost" onClick={() => signOutUser()}>
               <img src="/assets/icons/logout.svg" alt="logout" /> 
            </Button>
            <Link to={`/profile/${user.id}`} className="flex-center gap-3">
                <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="profile" width={40} height={40} className="rounded-full" />
            </Link>
        </div>
    </div>


   </section>
  )
}

export default Topbar