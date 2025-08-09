import React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import { Link, Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'


const Signup = () => {

    // State to handle form input(username, email, password)
    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = Navigate()

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
                navigate('/')
                toast.success(res.data.message)
                setInput({
                    username: "",
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
                    <p className="text-sm">Sign up to see photos and videos from our friends </p>
                </div>
                <div>
                    <Label
                        htmlfor='Username'
                        className='mb-1'
                    >Username
                    </Label>
                    <Input
                        type="text"
                        name='username'
                        value={input.username}
                        onChange={changeEventHandler}
                    >
                    </Input>
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
                        <Button type="submit">Signup</Button>
                    )
                }
                <span>Already have an account?{' '}
                    <Link className='text-blue-500' to='/Login'
                    >Login
                    </Link>
                </span>

            </form>


        </div>
    )
}

export default Signup
