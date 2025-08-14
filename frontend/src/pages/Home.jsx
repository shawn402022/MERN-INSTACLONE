import Feed from '@/components/ui/Feed'
import React from 'react'
import RightSideBar from '@/components/ui/RightSideBar'
import useGetAllPost from '@/hooks/useGetAllPost'
import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'

const Home = () => {
    useGetAllPost();
    useGetSuggestedUsers();
    return (
        <div className="flex">
            <div className='flex-grow'>
                <Feed />
            </div>
            <RightSideBar/>

        </div>
    )
}

export default Home
