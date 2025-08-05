import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


const Signup = () => {
    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <form className="shadow-lg flex-col gap-5 p-8">
                <div className="my-4 text-center">
                    <h1 className='text-xl font-bold'>Logo</h1>
                    <p className="text-sm">Sign up to see photos and videos from our friends </p>
                </div>
                <div>
                    <Label htmlfor='Username' className='mb-1'>Username</Label>
                    <Input type="text" name='username'></Input>
                </div>
                <div>
                    <Label htmlfor='Email' className='mb-1'>Email</Label>
                    <Input type="text" name='email'></Input>
                </div>
                <div>
                    <Label htmlfor='Password' className='mb-1'>Password</Label>
                    <Input type="password" name='password'></Input>
                </div>
                <Button type='submit' className='mb-1'>Sign Up</Button>
            </form>


        </div>
    )
}

export default Signup
