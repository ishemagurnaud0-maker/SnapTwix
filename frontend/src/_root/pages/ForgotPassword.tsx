import {Link,useNavigate} from 'react-router-dom';
import * as z from 'zod';
import {useForm} from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import {Button} from '@/components/ui/Button';
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from '@/components/ui/Form';
import { Input } from "@/components/ui/Input";
import { SignUpValidation } from "@/lib/validations";
import Loader from "@/components/shared/Loader";
import { checkPasswordValidation } from '@/lib/validations';



const ForgotPassword = () => {
    const form = useForm<z.infer<typeof checkPasswordValidation>>({
        resolver:zodResolver(checkPasswordValidation),
        mode:"onChange",
        defaultValues:{
            email:"",
        }
    })

    const onSubmit = (data:z.infer<typeof checkPasswordValidation>) => {


    }



  return (
    <></>
  )
}

export default ForgotPassword