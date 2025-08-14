import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector((store) => store.auth)
    return (
        <div className="my-10">
            <div className='flex items-center justify-between text-sm'>
                <h1 className='fot-semibold text-grey-600'>Suggested for you</h1>
                <span className='font-medium cursor-pointer'>See All</span>
            </div>
            {(suggestedUsers || []).map((user) => {

                return (
                    <div key={user._id} className="flex items-center justify-between my-5">
                        <div className="flex items-center gap-2">
                            <Link to={`/profile/${user?._id}`} >
                                <Avatar>
                                    <AvatarImage src={user?.profilePicture} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </Link>
                        </div>
                        <h1 className="font-semibold text-sm">
                            <Link to={`/profile/${user?._id}`} >
                                {user?.username}
                            </Link>
                        </h1>
                        <span className="text-grey-900 text-sm">{user?.bio || "Bio here..."}</span>
                        <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]">
                        Follow
                        </span>
                    </div>
                )
            })}


        </div>
    )
}

export default SuggestedUsers
