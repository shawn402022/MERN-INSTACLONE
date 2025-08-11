import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import React, { useRef } from 'react'

const CreatePost = ({open, setOpen}) => {
    const imageRef = useRef()
    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onInteractOutside={ ()=> setOpen(false)}>
                    <DialogHeader className='sm:text-center font-semibold '>
                        Create New Post
                    </DialogHeader>
                    <div className="flex gap-3 items-center">
                        <Avatar>
                            <AvatarImage src="" alt="Avatar"/>
                            <AvatarFallback>
                                CN
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="font-semibold text-xs">Username</h1>
                            <span className="text-gray-600 text-xs">Bio here...</span>
                        </div>
                    </div>
                    <Textarea className="focus-visible:ring-transparent border-none" placeholder="Write Caption"
                    />
                    <input ref={imageRef} type="file" className="hidden"/>
                    <Button onClick={()=> imageRef.current.click()}  className="w-fit mx-auto bg-[#0095f6] hove:bg-[#258bcf]">Select from computer</Button>
                </DialogContent>
            </Dialog>

        </div>
    )
}

export default CreatePost
