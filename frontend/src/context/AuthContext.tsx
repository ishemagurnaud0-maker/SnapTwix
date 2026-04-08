import type { IContextType, IUser } from '@/types';
import {createContext,useContext,useEffect,useState} from 'react';
import { getCurrentUser, signOutUser } from '@/lib/appwrite/api';
import { useNavigate } from 'react-router-dom';

export 
const INITIAL_USER = {
    id:'',
    name:'',
    username:'',
    email:'',
    imageUrl:'',
    bio:''
}

const INITIAL_STATE = {
    user:INITIAL_USER,
    isLoading:false,
    isAuthenticated:false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    checkAuthUser: async () => false as boolean, 
    handleSignOut: async () => {},
}

const AuthContext = createContext<IContextType>(INITIAL_STATE);



const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const[user,setUser] = useState<IUser>(INITIAL_USER);
    const [isLoading,setIsLoading] = useState(false);
    const [isAuthenticated,setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    const checkAuthUser = async () => {
        try{
            const currentAccount = await getCurrentUser(); 

            if(currentAccount){
                setUser({
                    id:currentAccount.$id,
                    name:currentAccount.name,
                    username:currentAccount.username,
                    email:currentAccount.email,
                    imageUrl:currentAccount.imageUrl,
                    bio:currentAccount.bio
                })
                setIsAuthenticated(true);
                // Set fallback to indicate user is authenticated
                localStorage.setItem('cookiefallback', 'authenticated');
                return true;
            }

            return false;

        }catch(error){
            console.log(error);
            return false;
        }finally{
            setIsLoading(false);
        }
    }

    const handleSignOut = async () => {
        try {
            await signOutUser();
            setUser(INITIAL_USER);
            setIsAuthenticated(false);
            localStorage.removeItem('cookiefallback');
            navigate('/sign-in');
        } catch (error) {
            console.log('Error signing out:', error);
        }
    }

    useEffect(() =>{
        const cookieFallback = localStorage.getItem('cookiefallback');
        
        // If there's no cookie fallback, user is not authenticated
        if(cookieFallback === '[]' || cookieFallback === null) {
            navigate('/sign-in');
            return;
        }
        
        // Only check auth if there might be a session
        checkAuthUser();
        
    },[]);

  return (
    <AuthContext.Provider value={{
        user,
        isLoading,
        isAuthenticated,
        setUser,
        setIsAuthenticated,
        checkAuthUser,
        handleSignOut,
    }}>
        {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;


export const useUserContext = () => {
    return useContext(AuthContext);
}