import { Databases,Account,Avatars,Storage,Client }  from 'appwrite';


export const appwriteConfig = {
    url:import.meta.env.VITE_APPWRITE_ENDPOINT,
    projectID:import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseID:import.meta.env.VITE_APPWRITE_DATABASE_ID,
    storageID:import.meta.env.VITE_APPWRITE_STORAGE_ID,
    usersTableID:import.meta.env.VITE_APPWRITE_USERS_TABLE_ID,
    postsTableID:import.meta.env.VITE_APPWRITE_POSTS_TABLE_ID,
    savesTableID:import.meta.env.VITE_APPWRITE_SAVES_TABLE_ID,
    storageBucketID:import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID,
}


export const client = new Client();

client.setProject(appwriteConfig.projectID);
client.setEndpoint(appwriteConfig.url);


export const databases = new Databases(client);
export const account = new Account(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);
