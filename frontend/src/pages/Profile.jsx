import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useGetUserProfile from '@/hooks/useGetUserProfile'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';



const Profile = () => {
    const params = useParams();
    const userId = params.id
    useGetUserProfile(userId);
    const isLoggedInUserProfile = true;
    const isFollowing = true

    const { userProfile } = useSelector((store) => store.auth);

    return (
        <div className="flex max-w-4xl justify-center mx-auto">
            <div className="flex flex-col gap-20 p-8">
                <div className="grid grid-cols-2">
                    <section className="flex items-center justify-center">
                        <Avatar className=" h-32 w-32" >
                            <AvatarImage src={userProfile?.profilePicture} alt="Profile Picture" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>

                    </section>
                    <section>
                        <div className="flex flex-col gap-5">
                            <div className="flex items-center gap-2">
                                <span>{userProfile?.username}</span>
                                {isLoggedInUserProfile ? (
                                    <>
                                        <Button
                                            variant="secondary"
                                            className="hover:bg-gray-200 h-8"
                                        >
                                            Edit Profile
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            className="hover:bg-gray-200 h-8"
                                        >
                                            View Archive
                                        </Button>
                                    </>
                                ) :  isFollowing ? (
                                        <>

                                            <Button variant="secondary" className="h-8">
                                                UnFollow
                                            </Button>
                                            <Button variant="secondary" className="h-8">Message</Button>
                                        </>
                                    ) : (
                                        <Button className="bg-[#0095f6] hover: bg-[#3192d2] h-8 ">
                                            Follow
                                        </Button>
                                    )}
                            </div>
                        </div>
                    </section>
                </div>
            </div>

        </div>
    )
}

export default Profile
