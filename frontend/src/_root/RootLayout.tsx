import Topbar from "@/components/shared/Topbar"
import LeftSidebar from "@/components/shared/LeftSidebar"
import Bottombar from "@/components/shared/Bottombar"


import { Outlet } from "react-router-dom"

//import { RightSidebar } from "@/components/shared"

const RootLayout = () => {
  return (
    <div className="w-full md:flex">

      <Topbar/>
      <LeftSidebar/>
      
        <section className="flex flex-1 h-full">
          <Outlet/>
           {/* <RightSidebar  /> */}
        </section>

      <Bottombar/>

    </div>
  )
}

export default RootLayout

