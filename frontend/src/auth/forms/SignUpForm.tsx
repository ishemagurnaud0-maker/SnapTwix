import * as z from 'zod';

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {Button} from '@/components/ui/Button';
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from '@/components/ui/Form';
import { Input } from "@/components/ui/Input";
import { SignUpValidation } from "@/lib/validations";

  

const SignUpForm = () => {
      const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })
 
  function onSubmit(data: z.infer<typeof SignUpValidation>) {
    // Do something with the form values.
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage className="text-red-600 text-sm font-medium" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
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
                  <Input type="password" placeholder="Enter your password" {...field} />
                </FormControl>
                <FormMessage className="text-red-600 text-sm font-medium" />
              </FormItem>
            )}
          />
        <Button type="submit" size="lg" className="w-full bg-blue-800 text-white hover:bg-blue-900">
          Sign Up
        </Button>
      </form>
    </Form>
  )
}

export default SignUpForm