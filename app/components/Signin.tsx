"use client"
import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { User } from './Signup'
import { useRouter } from 'next/navigation'
import axios from 'axios'


const Signin = () => {

    const [user, setUser] = useState<User >({ email: "", password: "" })
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log(user);

        const res = await axios.post("http://localhost:3500/users/signin", user);
        console.log(res.data);

    }

    const handleNavigate = () => {
        router.push("signup")
    }



    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, email: e.target.value })
    }
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, password: e.target.value })
    }


    return (
        <div className=' sm:flex ss:flex-col  sm:flex-row mx-auto bg-form-white justify-center items-center ss:h-[100vh] ss:w-full'>
            <div className=' bg-white h-[70%] md:pt-[1%] ss:w-full  md:w-[40%] flex flex-col'>
                <p className='self-center text-[20px] font-bold mb-[4%]'>Login</p>
                <form className='w-[70%] flex flex-col pl-[20%]' onSubmit={handleSubmit}>
                    <Label className='mb-[3%]' htmlFor="email">Email</Label>
                    <Input className='mb-[3%] h-[30px]' type='email' onChange={handleEmailChange} name='email' />
                    <Label className='mb-[3%]' htmlFor="password">Password</Label>
                    <Input className=' border-[1px] outline-none  mb-[6%] h-[30px] focus:ring-1 focus:ring-gray-100 ' onChange={handlePasswordChange} type='password' name='password' />

                    <div className='mb-[7%]'>
                        <div className="flex items-center space-x-2">
                            <Checkbox id="terms" />
                            <Label htmlFor="terms">Remember Me</Label>
                        </div>
                    </div>


                    <Button className='w-[40%]  self-center mb-3 ' type='submit' onClick={handleSubmit}>Signin</Button>



                    <p className='text-[14px] text-soft-black '>
                        Don&apos;t have an account?
                        <Button variant="link" onClick={handleNavigate} className='text-blue-400'>Signup</Button>
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

export default Signin
