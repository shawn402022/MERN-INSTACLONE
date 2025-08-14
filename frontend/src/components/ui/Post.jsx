
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from '@/components/ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
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
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";



const Post = ({ post }) => {

    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector((store) => store.auth)
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length)

    const { posts } = useSelector((store) => store.post)
    const [comment, setComment] = useState(post.comments)
    const dispatch = useDispatch();
    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("")
        }
    };

    const likeOrDislikeHandler = async () => {
        try {
            //Determine the action: If already liked, user wants dislike otherwise liked
            const action = liked ? 'dislike' : 'like'
            // send Get request to like or disliek the post
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`,
                {
                    withCredentials: true
                });
            if (res.data.success) {
                // update the local like count
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                //toggle the liked state
                setLiked(!liked);

                //Update the post data in teh redux store
                const updatedPostData = posts.map((p) => p._id === post._id ? {
                    ...p,
                    //  if the post was liked, remove the user's Id from the lies array, otherwise, add it
                    likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                } : p
                );
                //Dispatch updated  posts to the redux store
                dispatch(setPosts(updatedPostData));
                // show a success toast notification
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
        }
    };

    const commentHandler = async () => {
        try {
            //Make an http post request to add a comment
            const res = await axios.post(`http://localhost:8000/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json' // Specify content type as JSON
                },
                withCredentials: true // Include credentials (cookies ) with request
            });

            console.log(res.data)
            //Check if the API response is successful
            if (res.data.success) {
                //Update the comment state with the new comment added
                const updatedCommentData = [...comment, res.data.comment]
                setComment(updatedCommentData)

                // Update the posts state by finding the matching the post and updating its comments
                const updatedPostData = posts.map((p) => p._id === post._id ? { ...p, comments: updatedCommentData } : p
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

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`
                http://localhost:8000/api/v1/post/delete/${post._id}`, {
                withCredentials: true,
            });
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem._id !== post._id);
                dispatch(setPosts(updatedPostData))
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 '>
                    <Avatar >
                        <AvatarImage src={post.author?.profilePicture} alt='User' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>{post.author?.username}</h1>

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
                        {
                            user && user?._id === post?.author._id &&
                            (
                                <Button onClick={deletePostHandler} variant='ghost' className='cursor-pointer w-fit'>
                                    Delete
                                </Button>
                            )

                        }


                    </DialogContent>
                </Dialog>
            </div>
            <img src={post.image}
                alt="post-img"
                className="rounded-sm my-2 w-full aspect-square object-cover "
            />
            <div className="flex items-center justify-between my-2">
                <div className='flex items-center gap-3'>
                    {
                        liked ? (
                            <FaHeart
                                onClick={likeOrDislikeHandler}
                                size={'22px'}
                                className='cursor-pointer hover: text-red-600'
                            />
                        ) : (
                            <FaRegHeart
                                onClick={likeOrDislikeHandler}
                                size={"22px"}
                                className="cursor-pointer hover:text-grey-600" />
                        )
                    }
                    <MessageCircle onClick={() => setOpen(true)} className="cursor-pointer hover:text-grey-600" />
                    <Send className="cursor-pointer hover:text-grey-600" />
                </div>
                <Bookmark className="cursor-pointer hover:text-grey-600" />
            </div>
            <span className="font-medium block mb-2">{postLike}</span>
            <p>
                <span className="font-medium mr-2">{post?.author.username}</span>
                {post.caption}
            </p>
            <span
                onClick={() => setOpen(true)}
                className="cursor-pointer text-sm text-gray-400"
            >
                View all {comment.length} comments
            </span>
            <CommentDialog open={open} setOpen={setOpen} />
            <div className="flex items-center justify-between">
                <input
                    type="text"
                    value={text}
                    onChange={changeEventHandler}
                    placeholder="Add a comment..."
                    className="outline-none text-sm w-full"
                />
                {text &&
                    <span
                        onClick={commentHandler}
                        className="text-[#3BADF8] cursor-pointer"
                    >Post
                    </span>}
            </div>
        </div>

    )
}


export default Post
