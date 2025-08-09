import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Comment from './Comment'
import { useState } from 'react'
import { Button } from '@/components/ui/button'


const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState("");
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("")
        }
    }

    const sendMessageHandler = async () => {
        alert(text)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="sm:max-w-[1024] p-0flex flex-col">
                <div className="flex flex-1">
                    <div className='w-1/2'>
                        <img src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="post-img"
                            className="w-full h-full object-cover rounded-l-lg"
                        />

                    </div>
                    <div className="w-1/2 flex flex-col justify-between">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex gap-3 items-center">
                                <Link>
                                    <Avatar>
                                        <AvatarImage src=""></AvatarImage>
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className="font-semibold text-xs">username</Link>
                                </div>

                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className="cursor-pointer" />
                                </DialogTrigger>
                                <DialogContent className="flex flex-col items-center text-sm text-center">
                                    <div className="cursor-pointer w-full text-[#ED4956] font-bold">Unfollow</div>
                                    <div className="cursor-pointer w-full">Add to favourites</div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className="flex-1 overflow-y-auto max-h-96 p-4">
                            <Comment />
                        </div>
                        <div className='p-4'>
                            <div className='flex items-center gap-2'>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={changeEventHandler}
                                    placeholder="Add a comment..."
                                    className="outline-none text-sm w-full border-gray-300 p-2 rounded"
                                />
                                <Button disabled={!text.trim()} onClick={sendMessageHandler} varient="outline">Send</Button>
                            </div>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>

    )
}

export default CommentDialog
