"use client"
import React, { ErrorInfo, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { registerUser } from '../constants/files/Constants'

export interface User {
    username?: string,
    email: string,
    password: string
}


const Signup = () => {

    const [user, setUser] = useState<User >({ username: "", email: "", password: "" })
    const router = useRouter()

    const handleNavigate = () => {
        router.replace('/')
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const formData = { ...user, isFather: false, isMother: false, isAdmin: true }
        registerUser(formData, router)
    }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, email: e.target.value })
    }
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, password: e.target.value })
    }
    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, username: e.target.value })
    }

    return (
        <div className=' sm:flex ss:flex-col  sm:flex-row mx-auto bg-form-white justify-center items-center ss:h-[100vh] ss:w-full'>
            <div className=' bg-white h-[70%] md:pt-[1%] ss:w-full  md:w-[40%] flex flex-col'>
                <p className='self-center text-[20px] font-bold mb-[4%]'>Signup</p>
                <form className='w-[70%] flex flex-col pl-[20%]' onSubmit={handleSubmit}>
                    <Label className='mb-[3%]' htmlFor="username" >Username</Label>
                    <Input className=' rounded-md mb-[3%] h-[30px]' type='text' onChange={handleUsernameChange} name='username' />
                    <Label className='mb-[3%]' htmlFor="email">Email</Label>
                    <Input className='mb-[3%] h-[30px]' type='email' onChange={handleEmailChange} name='email' />
                    <Label className='mb-[3%]' htmlFor="password">Password</Label>
                    <Input className=' border-[1px] outline-none  mb-[6%] h-[30px] focus:ring-1 focus:ring-gray-100 ' onChange={handlePasswordChange} type='password' name='password' />



                    <Button className='w-[40%]  self-center mb-3   ' type='submit' onClick={handleSubmit}>Signup</Button>


                    <p className='text-[14px] text-[#201F1F] '>
                        Already have an account?
                        <Button variant="link" onClick={handleNavigate} className='text-blue-400'>Login</Button>
                    </p>
                </form>
            </div>
            <div className='bg-soft-black text-soft-white h-[70%] w-[40%] sm:flex sm:flex-col ss:hidden  items-center justify-center'>
                <div className='flex flex-col justify-center  leading-loose  w-[60%]'>
                    <p className='text-[35px] self-center font-bold'>RCA SDA</p>
                    <p className='self-center text-[22px] font-bold'>Attendance</p>
                    <p className='self-center font-bold text-[20px]'>MIS</p>
                </div>
            </div>
        </div>
    )
}

export default Signup
