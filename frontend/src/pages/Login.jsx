import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'


const Login = () => {

    const [input, setInput] = useState({

        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false)

    //Function to handle input change
    const changeEventHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })
    }

    //Function to handle form submission
    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:8000/api/v1/user/register", input,
                {
                    headers: {
                        "Content-Type": "application/json",
                        withCredentials: true
                    }
                }
            );

            //Check to see if registration was successful or not
            if (res.data.success) {

                toast.success(res.data.message)
                setInput({
                    email: "",
                    password: ""
                })
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        } finally {
            setLoading(false)
        }

    }

    return (
        <div className="flex items-center justify-center w-screen h-screen">
            <form onSubmit={signupHandler} className="shadow-lg flex-col gap-5 p-8">
                <div className="my-4 text-center">
                    <h1 className='text-xl font-bold'>Logo</h1>
                    <p className="text-sm">Login to see photos and videos from our friends </p>
                </div>
                <div>
                    <Label
                        htmlfor='Email'
                        className='mb-1'
                    >Email
                    </Label>
                    <Input
                        type="email"
                        name='email'
                        value={input.email}
                        onChange={changeEventHandler}
                    >
                    </Input>
                </div>
                <div>
                    <Label
                        htmlfor='Password'
                        className='mb-1'
                    >Password
                    </Label>
                    <Input
                        type="password"
                        name='password'
                        value={input.password}
                        onChange={changeEventHandler}
                    >
                    </Input>
                </div>
                {
                    loading ? (
                        <Button>
                            <Loader2 className="mr-2 h-2 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit">Login</Button>
                    )
                }
                <Button type='submit'>Login</Button>
            </form>


        </div>
    )
}

export default Login
