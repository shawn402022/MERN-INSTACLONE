import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


const Profile = () => {
    return (
        <div>
            <Avatar >
                <AvatarImage src={post.author?.profilePicture} alt='User' />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </div>
    )
}

export default Profile
