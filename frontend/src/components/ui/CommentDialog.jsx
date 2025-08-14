import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger,} from "@/components/ui/dialog"
import Comment from './Comment'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setPosts } from '@/redux/postSlice'
import { toast } from 'sonner'
import Posts from './Posts'
import { useEffect } from 'react'


const CommentDialog = ({ open, setOpen }) => {
    const [text, setText] = useState("");
    const [comment, setComment] = useState([])
    const { selectedPost, posts } = useSelector((store) => store.post)
    const dispatch = useDispatch()

    useEffect(() => {
        if (selectedPost) {
            setComment(selectedPost.comments)
        }
    }, [selectedPost])

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("")
        }
    }

    const sendMessageHandler = async () => {
        try {
            //Make an http post request to add a comment
            const res = await axios.post(`http://localhost:8000/api/v1/post/${selectedPost._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json' // Specify content type as JSON
                },
                withCredentials: true // Include credentials (cookies ) with request
            });

            //Check if the API response is successful
            if (res.data.success) {
                //Update the comment state with the new comment added
                const updatedCommentData = [...comment, res.data.comment]
                setComment(updatedCommentData)

                // Update the posts state by finding the matching the post and updating its comments
                const updatedPostData = posts.map((p) =>
                    p._id === selectedPost._id
                        ? { ...p, comments: updatedCommentData }
                        : p
                );

                //Dispatch the updated posts to the Redux store
                dispatch(setPosts(updatedPostData));

                //Display a success message to the user using a toast notification
                toast.success(res.data.message);

                //Reset the comment input field after successful submission
                setText("");
            }

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent onInteractOutside={() => setOpen(false)} className="sm:max-w-[1024] p-0flex flex-col">
                <div className="flex flex-1">
                    <div className='w-1/2'>
                        <img src={selectedPost?.image} alt="post-img"
                            className="w-full h-full object-cover rounded-l-lg"
                        />

                    </div>
                    <div className="w-1/2 flex flex-col justify-between">
                        <div className="flex items-center justify-between p-4">
                            <div className="flex gap-3 items-center">
                                <Link>
                                    <Avatar>
                                        <AvatarImage src={selectedPost?.author?.profilePicture} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className="font-semibold text-xs">{selectedPost?.author?.username}</Link>
                                </div>

                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className="cursor-pointer" />
                                </DialogTrigger>
                                <DialogContent className="flex flex-col items-center text-sm text-center">
                                    <div className="cursor-pointer w-full text-[#ED4956] font-bold">Unfollow</div>
                                    <div className="cursor-pointer w-full">Add to favorites</div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className="flex-1 overflow-y-auto max-h-96 p-4">
                            {comment.map((comment) => (
                                <Comment key={comment._id} comment={comment} />
                            ))}
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
                                <Button
                                    disabled={!text.trim()}
                                    onClick={sendMessageHandler}
                                    variant="outline">Send</Button>
                            </div>
                        </div>
                    </div>

                </div>
            </DialogContent>
        </Dialog>

    )
}

export default CommentDialog
