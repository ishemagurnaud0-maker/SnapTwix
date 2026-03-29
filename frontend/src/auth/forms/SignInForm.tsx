  import * as z from 'zod';

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {Button} from '@/components/ui/Button';
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from '@/components/ui/Form';
import { Input } from "@/components/ui/Input";
import { SignUpValidation } from "@/lib/validations";
import Loader from "@/components/shared/Loader";
import { Link } from 'react-router-dom';

const SignInForm = () => {
  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    mode: "onChange",
    defaultValues: {
      name:"",
      username: "",
      email: "",
      password: "",
    },
  })
  const isLoading = false;

  function onSubmit(data:z.infer<typeof SignUpValidation>){
    console.log(data);
  }

  return (
  <Form {...form}>
      <div className="flex flex-col items-center justify-center min-h-screen p-2">
        <img src="/assets/images/logo.png" alt="logo" className="w-48 h-46 " />
        <h2 className="h3-bold md:h2-bold pt-1 sm:pt-3">Sign Up to SnapTwix</h2> 
        <p className="text-light-3 small-medium md:base-regular mt-1">Enter your account details to get started</p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
           <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm font-medium" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-600 text-sm font-medium" />
                </FormItem>
              )}
            />
            <Button type="submit" size="lg" className="shad-button_primary">
              {isLoading ?(
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