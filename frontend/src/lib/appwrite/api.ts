import type { INewUser } from "@/types";
import { account,avatars,databases,appwriteConfig } from "./config";
import { ID } from "appwrite";

//creating user account 
const createUserAccount = async(user:INewUser) => {
    try {
        const { email, password,name } = user;
        
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            name
        );

        if(!newAccount){
            throw new Error("Failed to create user account")
        }

        const avatarUrl = avatars.getInitials(name);
        const newUser = await saveUserToDb({
            accountId: newAccount.$id,
            username:user.username,
            name: name,
            email: email,
            imageUrl: avatarUrl,
        });

        return newUser;
        
    } catch (err:any) {
        if(err.code ===409){
            throw new Error("An account with this email already exists. Please login instead.")
        }
        throw err;
    }
}

// Saving user to database

const saveUserToDb = async(user:{accountId:string,username?:string,name:string,email:string,imageUrl:string}) => {
    try {
            const {accountId,username,name,email,imageUrl} = user;
        
            const savedUser = await databases.createDocument(
                appwriteConfig.databaseID,
                appwriteConfig.usersTableID,
                ID.unique(),
                {
                    accountId,
                    username,
                    name,
                    email,
                    imageUrl
                }
            )

            return savedUser;

        
    } catch (err:any) {
        console.log("Error saving user to database:", err);

    }
}


const signInUser = async(user:{email:string,password:string}) => {
    try{
    const {email,password} = user;
        const session = await account.createEmailPasswordSession(email,password);
        return session;
   
}catch(err){
    console.log("Error happened establishing session",err);
    }
} 



export { createUserAccount,signInUser}
