import { Link, NavLink, useNavigate,useLocation } from "react-router-dom"
import { useEffect } from 'react'
import { Button } from "../ui/Button"
import { useSignOutAccount } from "@/lib/react-query/queries&Mutations"
import { useUserContext } from "@/context/AuthContext"
import { sidebarLinks } from "@/constants"
import type { INavLink } from "@/types"



const LeftSidebar = () => {
  
  const { pathname } = useLocation();
  const { mutate: signOutUser ,isPending:isSigningOut} = useSignOutAccount();
  const navigate = useNavigate();

  const isActive = (path:string) => pathname === path;

  const { user } = useUserContext();

  useEffect(() => {
    if(isSigningOut) {
      navigate('/sign-in');
    }
  }, [isSigningOut])
  
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-10 pb-5">
         <Link to="/" className="flex gap-3 items-center -mt-8">
        <img src="/assets/images/logo.png" alt="logo" width={180} height={325} />
        </Link>

        <Link to={`profile/${user.id}`}>
          <img src={user.imageUrl || '/assets/icons/profile-placeholder.svg'} alt="profile" className="h-12 w-12 rounded-full" />

          <div className="flex flex-col">
            <p className="body-semibold">{user.name}</p>
            <p className="small-regular text-light-3">{user.username}</p>
          </div>
        </Link>

    <ul className="flex flex-col gap-6">
        {sidebarLinks.map((link:INavLink) => {
          const isCurrentPage = isActive(link.route);
          return (
          <li key={link.label} className={`leftsidebar-link group ${isCurrentPage ? "bg-primary-500" : ""}`}>
            <NavLink to={link.route} className="flex gap-4 items-center p-3">
              <img src={link.imgURL} alt={link.label} className={`group-hover:invert-white ${isCurrentPage ? "invert-white" : ""}`}/>
              <p>{link.label}</p>
            </NavLink>
          </li>
          ) 
        })}
    </ul>
        
        

      </div>

      <Button variant="ghost" className="shad-button_ghost" onClick={() => signOutUser()}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar