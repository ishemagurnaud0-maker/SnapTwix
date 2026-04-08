export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
};

export type IUpdateUser = {
    userId:string;
    name:string;
    username:string;
    url:string;
    bio:string;
    file:File[];
};

export type INewPost = {
    creator:string;
    caption:string;
    file:File[];
    location?:string;
    tags?:string;
};

export type IUpdatePost = {
    postId:string;
    caption:string;
    file:File[];
    location?:string;
    tags?:string;
};

export type IDeletePost = {
    postId:string;
    imageId:string;
};

export type IComment = {
    postId:string;
    comment:string;
    userId:string;
};

export type INewUser = {
    name:string;
    username:string;
    email:string;
    password:string;
};

export type ILoginUser = {
    email:string;
    password:string;
};

export type ILikePost = {
    postId:string;
    userId:string;
};

export type IContextType = {
    user:IUser,
    isLoading:boolean,
    setUser:React.Dispatch<React.SetStateAction<IUser>>,
    isAuthenticated:boolean,
    setIsAuthenticated:React.Dispatch<React.SetStateAction<boolean>>,
    checkAuthUser: () => Promise<boolean>;
    handleSignOut: () => Promise<void>;
}


export type IUser = {
     id: string;
    name: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
};


