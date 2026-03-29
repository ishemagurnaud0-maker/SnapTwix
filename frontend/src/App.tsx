
import { Routes,Route} from 'react-router-dom';

{/*Component imports */}
import SignUpForm from './auth/forms/SignUpForm';
import SignInForm from './auth/forms/SignInForm';
import AuthLayout from './auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import {Home} from './_root/pages';
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
          <Route path='/' element={<Home/>}/>
        </Route>
        

      </Routes>
    </main>
      <Toaster />
    </>
  )
}

export default App