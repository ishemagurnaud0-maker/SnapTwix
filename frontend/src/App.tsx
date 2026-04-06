
import { Routes,Route} from 'react-router-dom';

{/*Component imports */}
import SignUpForm from './auth/forms/SignUpForm';
import SignInForm from './auth/forms/SignInForm';
import AuthLayout from './auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import {Home, CreatePosts, LikedPosts,Explore, SavedPosts, AllUsers, EditPost, PostDetails, Profile, UpdateProfile} from './_root/pages';
import { Toaster } from './components/ui/toaster';


const App = () => {
  return (
    <>
    <main className='flex h-screen'>
      <Routes>
        {/*public routes*/}
        <Route element={<AuthLayout/>}>
          <Route path='/sign-up' element={<SignUpForm/>}/>
          <Route path='/sign-in' element={<SignInForm/>}/>
        </Route>
        {/*private routes*/}
        <Route element={<RootLayout/>}>
          <Route index element={<Home/>}/>
          <Route path='/explore' element={<Explore/>}/>
          <Route path='/create-post' element={<CreatePosts/>}/>
          <Route path='/saved' element={<SavedPosts/>}/>
          <Route path='/people' element={<AllUsers/>}/>
          <Route path='/update-post/:id' element={<EditPost/>}/>
          <Route path='/posts/:id' element={<PostDetails/>}/>
          <Route path='/profile/:id/*' element={<Profile/>}/>
          <Route path='/update-profile/:id'  element={<UpdateProfile/>}/>
          <Route path='/liked-posts' element={<LikedPosts/>}/>
        </Route>
        

      </Routes>
    </main>
      <Toaster />
    </>
  )
}

export default App