   import * as z from 'zod';
import {useToast} from '@/hooks/use-toast';
import { useForm, type ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {Button} from '@/components/ui/Button';
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from '@/components/ui/Form';
import { Input } from "@/components/ui/Input";
import { SignInValidation } from "@/lib/validations";
import Loader from "@/components/shared/Loader";
import { Link,useNavigate } from 'react-router-dom';
import {useUserContext} from '@/context/AuthContext';

import { useSignInAccount } from '@/lib/react-query/queries&Mutations';
import { useState } from 'react'
import { EyeOff, Eye } from 'lucide-react'


const SignInForm = () => {

  const {toast} = useToast();
  const navigate = useNavigate();
  const {checkAuthUser} = useUserContext();
  const { user } = useUserContext();
  const {mutateAsync: signInUser, isPending:isSigningIn} = useSignInAccount();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  })
  
  async function onSubmit(data: z.infer<typeof SignInValidation>) {
      
      
  
    try{
         // const session = await signInAccount(data);
          const session = await signInUser({
            email:data.email,
            password:data.password
          })
              console.log('Session:',session);
          if(!session){
             
                return toast({
              title: "Sign in failed. Please try again",
            })

          }
            
  
          const isLoggedIn = await checkAuthUser();
            console.log('Is logged in:',isLoggedIn);
          
            if(isLoggedIn){
            form.reset();
            navigate('/');
            toast({title:`Welcome back,${user?.name}`})
          }else{
           return  toast({title:'Sign in failed. Please try again. '});
          }
  
            }catch(error){
        console.log("Error:",error);
      }
      
    }

 

  return (
  <Form {...form}>
      <div className="flex flex-col items-center justify-center min-h-screen p-2">
        <img src="/assets/images/logo.png" alt="logo" className="w-48 h-46 " />
        <h2 className="h3-bold md:h2-bold pt-1 sm:pt-3">Sign In to SnapTwix</h2> 
        <p className="text-light-3 small-medium md:base-regular mt-1">Enter your account details to get started</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
           <FormField
              control={form.control}
              name="email"
              render={({ field }: { field: ControllerRenderProps<any> }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm font-medium" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }: { field: ControllerRenderProps<any> }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className='relative flex gap-2'>
                      <Input type={showPassword ? "text" : "password"} className="shad-input" {...field} />
                      <button className='absolute right-3 top-1/2 transform -translate-y-1/2 px-4' onClick={togglePasswordVisibility}>
                        {showPassword ? <Eye className='text-light-4 w-5 h-5' /> : <EyeOff  className='text-light-4 w-5 h-5' />}
                   </button>
                    </div>
                    
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm font-medium" />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="shad-button_primary">
              {isSigningIn ?(
                <div className="flex-center gap-2 ">
                  <Loader/> Loading up...
                  </div>  
               ) : "Sign In"}
               </Button>
               <p className="text-light-3 text-center">
                Don't have an account? <Link to="/sign-up" className="text-primary-500">Sign up</Link>
               </p>
           </form>
           </div>
           </Form>
  )
}

export default SignInForm;