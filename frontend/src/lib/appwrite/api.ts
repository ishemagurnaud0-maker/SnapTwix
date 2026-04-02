import type { INewUser } from "@/types";
import { account,avatars,databases,appwriteConfig } from "./config";
import { ID, Query } from "appwrite";

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
            password:password
        });

        return newUser;
        
    } catch (err:any) {
        if(err.code === 409){
            throw new Error("An account with this email or username already exists. Please login instead.")
        }
        throw err;
    }
}

// Saving user to database

const saveUserToDb = async(user:{accountId:string,username?:string,name:string,email:string,imageUrl:string,password:string}) => {
    try {
            const {accountId,username,name,email,imageUrl,password} = user;
        
            const savedUser = await databases.createDocument(
                appwriteConfig.databaseID,
                appwriteConfig.usersTableID,
                ID.unique(),
                {
                    accountId,
                    username,
                    name,
                    email,
                    imageUrl,
                    password
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

    try{
        await account.deleteSession('current');
    }catch(err){
        console.log("Failed to delete session");
        throw err;
    }
        const session = await account.createEmailPasswordSession(email,password);

        if(!session) throw new Error("Failed to generate user session.")
            

        return session;
   
}catch(err){
    console.log("Error happened establishing session",err);
    throw err;
    }
} 


const getCurrentUser = async() => {
    try{
        const currentAccount =  await account.get();
        if(!currentAccount){
            throw new Error("Failed to get current user")
        }

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.usersTableID,
            [Query.equal("accountId",currentAccount.$id)]
        )
        if(!currentUser) throw Error;

        return currentUser.documents[0];
        
        

    }catch(err){
        console.log("Error happened getting current user",err);
        return null;
    }
}



const signOutUser = async() => {
    try{
        const currentSession = await account.getSession('current');

        if(!currentSession){
            throw new Error("No active session found");
        }

       await account.deleteSession('current');
      

    }catch(err){
        console.log("Error happened signing out user",err);
        throw err;
    }
}



export { createUserAccount,signInUser,getCurrentUser,signOutUser}
