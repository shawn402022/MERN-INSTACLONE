import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { readFileAsDataURL } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import React, { useRef } from 'react'
import { useState } from 'react'

const CreatePost = ({ open, setOpen }) => {

    const [file, setFile] = useState("")
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);

    const imageRef = useRef()


    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl)
        }
    };

    const createPostHandler = async (e) => {
        e.preventDefault();
        console.log(file, caption);

        try {

        } catch (error) {

        }
    }

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onInteractOutside={() => setOpen(false)}>
                    <DialogHeader className='sm:text-center font-semibold '>
                        Create New Post
                    </DialogHeader>
                    <div className="flex gap-3 items-center">
                        <Avatar>
                            <AvatarImage src="" alt="Avatar" />
                            <AvatarFallback>
                                CN
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="font-semibold text-xs">Username</h1>
                            <span className="text-gray-600 text-xs">Bio here...</span>
                        </div>
                    </div>
                    <Textarea
                        value={caption}
                        onChange={(e)=> setCaption(e.target.value)}
                        className="focus-visible:ring-transparent border-none"
                        placeholder="Write Caption"
                    />
                    {
                        imagePreview && (
                            <div className='w-full h-64 flex items-center'>
                                <img src={imagePreview}
                                    alt="Preview Image"
                                    className='object-cover h-full w-full rounded-md'
                                />
                            </div>
                        )
                    }
                    <input
                        ref={imageRef} type="file"
                        onChange={fileChangeHandler}
                        className="hidden"
                    />
                    <Button
                        onClick={() => imageRef.current.click()}
                        className="w-fit mx-auto bg-[#0095f6] hove:bg-[#258bcf]"
                    >
                        Select from computer
                    </Button>
                    {
                        imagePreview && (
                            loading ? <Button>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait

                            </Button> : (
                                <Button type="submit" onClick={createPostHandler} className="w-full">Post</Button>
                            )
                        )
                    }
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default CreatePost
