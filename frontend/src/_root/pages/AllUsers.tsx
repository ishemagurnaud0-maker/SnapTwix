import {useNavigate,Link} from 'react-router-dom'
import  Loader from "@/components/shared/Loader"
import {useGetUsers} from '@/lib/react-query/queries&Mutations'
import {toast, useToast} from '@/hooks/use-toast'
import UserCard from '@/components/shared/UserCard.tsx'

const AllUsers = () => {
  const {data: creators, isPending ,isError:isErrorCreators} = useGetUsers();
  const {toast} = useToast();

if(isErrorCreators){
     toast({title:"Something went wrong"})
    return; 
}



  return (
    <div className='common-container'>
      <div className='user-container'>
        <h2 className='h3-bold md:h2-bold text-left w-full'>All Users</h2>

        {isPending && !creators ? 
          (
          <Loader />
        )
        : (
            <ul className='user-grid'>
              {creators?.documents.map((creator) => (
                <li key={creator.$id} className='flex-1 min-w-[200px] w-full'>
                  <UserCard user={creator}/>
                </li>
              ))}
            </ul>
        )
        
      }
      </div>

    </div>
  )
}

export default AllUsers