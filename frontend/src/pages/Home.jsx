import Feed from '@/components/ui/Feed'
import React from 'react'
import RightSideBar from '@/components/ui/RightSideBar'

const Home = () => {
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
