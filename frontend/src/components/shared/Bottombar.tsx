import { bottomBarLinks } from '@/constants'
import { Link,useLocation } from 'react-router-dom'


const Bottombar = () => {
  const {pathname} = useLocation();
  return (
    <section className='bottom-bar'>
      {bottomBarLinks.map((link) => {
        const isActive = pathname === link.route;
        return(
        <Link 
              to={link.route} 
              key={link.label} 
              className={`flex-center flex-col gap-1 p-2 transition ${isActive && 'bg-primary-500 rounded-[10px]'}`}>
                <img src={link.imgURL} alt={link.label} width={24} height={24} className={`group-hover:invert-white ${isActive && 'invert-white'}`} />
                <p className='tiny-medium text-light-2'>{link.label}</p>
              </Link>
              
        )
      })}
    </section>
  )
}

export default Bottombar