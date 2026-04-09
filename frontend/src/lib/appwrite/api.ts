import type { INewPost, INewUser,IUpdatePost } from "@/types";
import { account,avatars,databases,appwriteConfig,storage } from "./config";
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
    const { email,password } = user;

    try{
        const currentSession = await account.getSession('current');
        if(currentSession) {
            await account.deleteSession('current');
        }
    }catch(err){
        // No session exists, which is expected for sign-in
        console.log("No existing session to delete");
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
        // Try to get the current account - this will fail if no session exists
        const currentAccount = await account.get();
        
        if(!currentAccount){
            throw new Error("No current account found");
        }

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.usersTableID,
            [Query.equal("accountId",currentAccount.$id)]
        )
        
        if(!currentUser || currentUser.documents.length === 0) {
            return null;
        }

        return currentUser.documents[0];

    }catch(err){
        // This will catch the 401 error when no session exists
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
        const {creator,caption,file, location, tags} = post;

        // Validate file array
        if (!file || !Array.isArray(file) || file.length === 0) {
            throw new Error("No file provided");
        }
        
        // Ensure the first item is a File object
        const fileToUpload = file[0];
        if (!(fileToUpload instanceof File)) {
            throw new Error(`Invalid file type: Expected File object, received ${typeof fileToUpload}`);
        }

       const uploadedFile = await uploadFile(fileToUpload);

        if(!uploadedFile){
            throw new Error("Failed to upload file")
        }

        const fileUrl = await getFileView(uploadedFile.$id);
        console.log('File ID:', uploadedFile.$id);
        console.log('Generated URL:', fileUrl);
        if(!fileUrl){
            deleteFile(uploadedFile.$id);
            throw new Error("Failed to get file preview")
        }


        //turning tags into tags into array of tags
        if(!tags){
            throw new Error("Tags are required")
        }
        const tagsArray = tags.split(",").map((tag) => tag.trim());

        // Save post to database
        const documentData = {
            caption: caption,
            imageUrl: fileUrl,
            location: location || "",
            tags: tagsArray || [],
            creator:creator,
            imageId: uploadedFile.$id
        };
        
        const newPost = await databases.createDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postsTableID,
            ID.unique(),
            documentData
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

export const getFileView = (fileId:string) => {
    try{
        const fileUrl = storage.getFileView(
            appwriteConfig.storageBucketID,
            fileId
        )
        console.log('Generated file URL:', fileUrl);
        return fileUrl;
    }catch(err){
        console.log("Error happened getting file view",err);
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

                const creatorId = typeof post.creator === 'string' ? post.creator : post.creator?.$id;
                const user = await databases.listDocuments(
                    appwriteConfig.databaseID,
                    appwriteConfig.usersTableID,
                    [Query.equal("$id", creatorId)]
                );
                
                return {
                    ...post,
                    Likes: post.Likes || [],
                    creator: user.documents[0] ? {
                        name: user.documents[0].name,
                        username: user.documents[0].username,
                        imageUrl: user.documents[0].imageUrl,
                        $id: user.documents[0].$id
                    } : null,
                    user_id: post.creator 
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


 const likePost = async(postId:string , likesArray:string[]) => {
    try{
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postsTableID,
            postId,
            {
                Likes:likesArray
            }
        )

        if(!updatedPost){
            throw new Error("Failed to update post");
        }

        return updatedPost;
    }catch(err){
        console.log("Error happened liking post",err);
        throw err;
    }
}

const savePost = async(postId:string, userId:string) => {
    try{
        const savedPost = await databases.createDocument(
            appwriteConfig.databaseID,
            appwriteConfig.savesTableID,
            ID.unique(),
            {
                post: postId,
                users: userId
            }
        )
        return {status:"ok",savedPost}
    }catch(err){
        console.log("Error happened saving post",err);
        throw err;
    }
}

const deleteSavedPost = async(savedRecordId:string) => {
    try{
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseID,
            appwriteConfig.savesTableID,
            savedRecordId
        )
        return {status:"ok",statusCode}

    }catch(err){
        console.log("Error happened deleting saved post",err);
        throw err;
    }


}


const getSavedPosts = async(userId:string) => {
    try {
        const savedPosts = await databases.listDocuments(
            appwriteConfig.databaseID,
            appwriteConfig.savesTableID,
            [
                Query.equal("users", userId)
            ]
        )

        return savedPosts;

    } catch (error) {
        console.log("Error happened getting saved posts",error);
        throw error;
    }
}
 
const updatePost = async(post:IUpdatePost) => {
    try{
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseID,
            appwriteConfig.postsTableID,
            post.postId,
            { 
                caption: post.caption,
                location: post.location,
                tags: post.tags
            }
        )
      return updatedPost;
    }catch(err){
        console.log("Error happened updating post",err);
        throw err;
    }
}













export { createUserAccount,signInUser,getCurrentUser,signOutUser,createNewPost,getRecentPosts,likePost,deleteSavedPost,savePost,getSavedPosts,updatePost }
