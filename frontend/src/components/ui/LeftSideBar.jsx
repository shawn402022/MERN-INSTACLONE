

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import CreatePost from "@/pages/CreatePost"
import { setAuthUser } from "@/redux/authSlice"
import axios from "axios"
import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"




const LeftSideBar = () => {

    const [open, setOpen] = useState(false)
    const navigate = useNavigate();
    const { user } = useSelector((store) => store.auth)
    const dispatch = useDispatch()

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/user/logout', {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(null))
                navigate('/login')
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message)
        }
    };
    const sidebarHandler = (textType) => {
        if (textType === "Logout") {
            logoutHandler()
        } else if (textType === "Create") {
            setOpen(true)
        }

    }

    const sideBarItems = [
        {
            icon: <Home />,
            text: "Home"
        },
        {
            icon: <Search />,
            text: "Search"
        },
        {
            icon: <TrendingUp />,
            text: "Explore"
        },
        {
            icon: <MessageCircle />,
            text: "Messages"
        },
        {
            icon: <Heart />,
            text: "Notifications"
        },
        {
            icon: <PlusSquare />,
            text: "Create"
        },
        {
            icon: (
                <Avatar className="w-6 h-6">
                    <AvatarImage src={user?.profilePicture} />
                    {
                        console.log("Profile picture URL:", user?.profilePicture)
                    }
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        {
            icon: <LogOut />,
            text: "Logout"
        }
    ]
    return (
        <div className="fixed top-0 z-10 left-0 px-4 border-r border-color-gray-300 w-[16%] h-screen">
            <div className='flex flex-col'>
                <h1 className='my-7 pl-3 font-bold text-xl'>LOGO</h1>
                <div >
                    {sideBarItems.map((item, index) => {
                        return (
                            <div
                                onClick={() => sidebarHandler(item.text)}
                                key={index}
                                className='flex items center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3'>
                                {item.icon}
                                <span>{item.text}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen}></CreatePost>
        </div>

    )
}

export default LeftSideBar
