import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';



const Profile = () => {
    const params = useParams();
    const userId = params.id
    useGetUserProfile(userId);

    const {userProfile} = useSelector((store) => store.auth);
    console.log("userprofile", userProfile)

    return (
        <div>
            <Avatar >
                <AvatarImage src={userProfile?.profilePicture} alt="Profile Picture"/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </div>
    )
}

export default Profile
