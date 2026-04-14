import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type ControllerRenderProps } from "react-hook-form"
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
import type { PostDocument } from "@/types/post";

import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useCreatePost } from "@/lib/react-query/queries&Mutations";
import {useUpdatePost} from "@/lib/react-query/queries&Mutations";
import { Loader } from "lucide-react";


interface PostFormProps {
  post?:PostDocument; 
  action?: 'Create' | 'Update';
}


const createPostSchema = z.object({
  caption: z.string().min(1, "Caption is required"),
  location:z.string().min(6, "Location is required"),
  tags: z.string().min(1, "Tags are required"),
  file: z.array(z.custom<File>((val) => val instanceof File, {
    message: "Must be a File object"
  })).min(1, "At least one file is required")
})

const updatePostSchema = z.object({
  caption: z.string().min(1, "Caption is required"),
  location:z.string().min(6, "Location is required"),
  tags: z.string().min(1, "Tags are required"),
  file: z.array(z.custom<File>((val) => val instanceof File, {
    message: "Must be a File object"
  })).optional()
})

const PostForm = ({post, action}: PostFormProps) => {
  const schema = action === 'Create' ? createPostSchema : updatePostSchema;
  const form = useForm<z.infer<typeof schema>>({
    reValidateMode: "onChange",
    resolver: zodResolver(schema),
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
 const {mutateAsync: updatePost, isPending:isLoadingUpdate} = useUpdatePost()

  const onSubmit = async(data: z.infer<typeof schema>) => {
try{

  if(post && action === "Update"){

    const updatedPost = await updatePost({
      ...data,
      postId: post.$id,
      imageId: post.imageId,
      imageUrl: post.imageUrl,
      file: data.file || [],
    })
    
    if(!updatedPost){
      toast({title:"Please try again!", variant:"destructive"})
    }
    
   return navigate(`/posts/${post.$id}`);
  
  }
    
    const postData = {...data, creator: user.id, file: data.file || []}
    
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
          render={({ field }: { field: ControllerRenderProps<any> }) => (
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
          render={({ field }: { field: ControllerRenderProps<any> }) => (
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
          render={({ field }: { field: ControllerRenderProps<any> }) => (
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
          render={({ field }: { field: ControllerRenderProps<any> }) => (
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
            <Button type='submit' className='shad-button_primary' disabled={isCreatingPost || isLoadingUpdate}>{isCreatingPost || isLoadingUpdate && <Loader className='animate-spin' />} {action === 'Create' ? 'Create Post' : 'Update Post'}</Button>
          </div>
        
        
      </form>
    </Form>
  )
}

export default PostForm