
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { FaRegHeart } from "react-icons/fa";
import { MoreHorizontal, Bookmark, MessageCircle, Send } from "lucide-react";



import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


import React, { useState } from 'react'
import CommentDialog from "./CommentDialog";


const Post = () => {

    const [text, setText] = useState("");
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("")
        }
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 '>
                    <Avatar >
                        <AvatarImage src='' alt='User' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>Username</h1>

                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className="cursor-pointer"></MoreHorizontal>
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        <Button variant='ghost' className='cursor-pointer w-fit text-[#ED4956] font-bold'>
                            Unfollow
                        </Button>
                        <Button variant='ghost' className='cursor-pointer w-fit'>
                            Add to favorites
                        </Button>
                        <Button variant='ghost' className='cursor-pointer w-fit'>
                            Delete
                        </Button>
                    </DialogContent>
                </Dialog>
            </div>
            <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="post-img"
                className="rounded-sm my-2 w-full aspect-square object-cover " />
            <div className="flex items-center justify-between my-2">
                <div className='flex items-center gap-3'>
                    <FaRegHeart size={"22px"} className="cursor-pointer hover:text-grey-600" />
                    <MessageCircle className="cursor-pointer hover:text-grey-600" />
                    <Send className="cursor-pointer hover:text-grey-600" />
                </div>
                <Bookmark className="cursor-pointer hover:text-grey-600" />
            </div>
            <span className="font-medium block mb-2">200 likes</span>
            <p>
                <span className="font-medium mr-2">username</span>
            </p>
            <CommentDialog />
            <div className="flex items-center justify-between">
                <input
                    type="text"
                    value={text}
                    onChange={changeEventHandler}
                    placeholder="Add a comment..."
                    className="outline-none text-sm w-full"
                />
                {text && <span className="text-[#3BADF8] cursor-pointer">Post</span>}
            </div>
        </div>

    )
}

export default Post
