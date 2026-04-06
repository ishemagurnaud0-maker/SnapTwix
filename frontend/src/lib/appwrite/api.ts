import type { INewPost, INewUser } from "@/types";
import { account,avatars,databases,appwriteConfig,storage } from "./config";
import { ID, ImageGravity, Query } from "appwrite";

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


const createNewPost = async(post:INewPost) => {
    try{
        // Uploading post to the storage media
        const {userId,caption,file, location, tags} = post;

       const uploadedFile = await uploadFile(file[0]);

        if(!uploadedFile){
            throw new Error("Failed to upload file")
        }

        const fileUrl = await getFilePreview(uploadedFile.$id);
        if(!fileUrl){
            deleteFile(uploadedFile.$id);
            throw new Error("Failed to get file preview")
        }

        // Save post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postsTableID,
            ID.unique(),
            {
                caption,
                imageUrl: fileUrl,
                location,
                tags: tags || [],
                userId,
                imageId: uploadedFile.$id
            }
        );

        if(!newPost){
            await deleteFile(uploadedFile.$id);
            throw new Error("Failed to create post");
        }

        return newPost;


        
    }catch(err){
        console.log("Error happened uploading a file",err);
        throw err;
    }
}




export const uploadFile = async(file:File) => {
    const fileId = ID.unique();
    
    try{
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageBucketID,
            fileId,
            file
            
        )
        return uploadedFile;
    
    }catch(err){
    console.log("Error happened uploading a file",err);
    throw err;
}}

export const getFilePreview = (fileId:string) => {
    try{
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageBucketID,
            fileId,
            2000,
            2000,
            "top" as ImageGravity,
            100,
        )
        return fileUrl;
    }catch(err){
        console.log("Error happened getting file preview",err);
        throw err;
    }
}

export const deleteFile = async(fileID:string) => {
    try{
        await storage.deleteFile(
            appwriteConfig.storageBucketID,
            fileID
        )

        return {success:true}
    }catch(err){
        console.log("Error happened deleting file",err);
        throw err;
    }
}

const getRecentPosts = async() => {
    try{

        const posts = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.postsTableID,
            [
                Query.orderDesc("$createdAt"),
                Query.limit(20)
            ]
        )

        // Fetch user data for each post
        const postsWithUsers = await Promise.all(
            posts.documents.map(async (post) => {
                const user = await databases.listDocuments(
                    appwriteConfig.databaseID,
                    appwriteConfig.usersTableID,
                    [Query.equal("$id", post.userId)]
                );
                
                return {
                    ...post,
                    creator: user.documents[0] ? {
                        name: user.documents[0].name,
                        username: user.documents[0].username,
                        imageUrl: user.documents[0].imageUrl
                    } : null
                };
            })
        );

        return {
            ...posts,
            documents: postsWithUsers
        };
    }catch(err){
        console.log("Error happened getting recent posts",err);
        throw err;
    }
}











export { createUserAccount,signInUser,getCurrentUser,signOutUser,createNewPost,getRecentPosts }
