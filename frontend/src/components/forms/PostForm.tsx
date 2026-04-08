import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod';
import { Button } from "@/components/ui/Button"
import {
  Form,
  FormControl,

  FormField,
  FormItem,
  FormLabel,

  FormMessage,

} from "@/components/ui/Form"

import { Textarea } from "@/components/ui/textarea"
import FileUploader from '@/components/shared/FileUploader'
import { Input } from "../ui/Input";
import type { Models } from "appwrite";


import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useCreatePost } from "@/lib/react-query/queries&Mutations";



interface PostDocument extends Models.Document {
  caption: string;
  location: string;
  tags: string;
  imageUrl: string;
}

interface PostFormProps {
  post?:PostDocument; 
}


const formschema = z.object({
  caption: z.string().min(1, "Caption is required"),
  location:z.string().min(6, "Location is required"),
  tags: z.string().min(1, "Tags are required"),
  file: z.array(z.custom<File>((val) => val instanceof File, {
    message: "Must be a File object"
  })).min(1, "At least one file is required")
})

const PostForm = ({post}: PostFormProps) => {
  const form = useForm<z.infer<typeof formschema>>({
    reValidateMode: "onChange",
    resolver: zodResolver(formschema),
    defaultValues: {
      caption:post ? post.caption : "",
      tags:post ? post.tags : "",
      location:post ? post.location : "",
      file: [],
    }
  })

  const { user} = useUserContext()
  const {toast} = useToast();
  const navigate = useNavigate();
  const {mutateAsync: createNewPost, isPending:isCreatingPost} = useCreatePost()


  const onSubmit = async(data: z.infer<typeof formschema>) => {
try{
    
    const postData = {...data, creator: user.id}
    
    const newPost = await createNewPost(postData);

    if(!newPost){
      toast({title:"Please try again!", variant:"destructive"})
    }

      navigate('/');
}catch(error){
  console.log(error);
}
   

      
      }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-5xl">
       <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Caption</FormLabel>
              <FormControl>
                <Textarea className='shad-textarea custom-scrollbar' {...field} />
              </FormControl>
             
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                fieldChange={field.onChange}
                mediaUrl={post?.imageUrl}
                />
              </FormControl>
             
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Location</FormLabel>
              <FormControl>
                <Input type="text" className='shad-input' {...field} />
              </FormControl>
             
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />

         <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='shad-form_label'>Add Tags (separated by comma ',')</FormLabel>
              <FormControl>
                <Input type="text" className='shad-input' placeholder='e.g #travel, #nature, #business ' {...field} />
              </FormControl>
             
              <FormMessage className='shad-form_message' />
            </FormItem>
          )}
        />
          <div className="flex gap-4 items-center justify-end">
            <Button type='button' variant='ghost' className='shad-button_ghost'>Reset</Button>
            <Button type='submit' className='shad-button_primary'>Submit</Button>
          </div>
        
        
      </form>
    </Form>
  )
}

export default PostForm