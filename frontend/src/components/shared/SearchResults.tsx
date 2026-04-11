import type { Models } from "appwrite";
import type { PostWithUser } from "@/types";
import Loader from './Loader';
import GridPostList from "./GridPostList";

interface SearchResultsProps {
  isSearchLoading: boolean;
  searchedPost: Models.DocumentList<Models.Document> | null | undefined
}

const SearchResults = ({ isSearchLoading, searchedPost }: SearchResultsProps) => {

    if(isSearchLoading) return <Loader/>

    if( searchedPost && searchedPost.documents.length > 0 ) {
        return (
        <GridPostList posts={searchedPost.documents as unknown as PostWithUser[]}/>
    )
    }
        
    
  return (
    <div>
        <p className='text-light-4 mt-10 text-cneter w-full'>No results found</p>
    </div>
  )
}

export default SearchResults