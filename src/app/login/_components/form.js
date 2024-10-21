'use client'
import { laila } from '@/assets/fonts';
import { Button, Card, Input, Typography } from '@material-tailwind/react'
import React, { useState } from 'react'
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <div className='my-5 h-full'>
            <Card color="transparent" shadow={false} className="">
                <p className={`text-xl text-center md:text-2xl lg:text-5xl text-black font-bold ${laila.className}`}>Admin Login </p>

                <form className="mt-6 w-full mx-auto  md:w-96">
                    <div className="mb-1 flex flex-col gap-6">

                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                            Your Email
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="name@mail.com"
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                        <Typography variant="h6" color="blue-gray" className="-mb-3">
                            Password
                        </Typography>
                        <Input
                            type={showPassword ? "text" : "password"}
                            size="lg"

                            icon={showPassword ? <IoEyeOff onClick={() => setShowPassword(false)} /> : <IoEye onClick={() => setShowPassword(true)} />
                            }
                            placeholder="********"
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                    </div>

                    <Button className="mt-6 bg-primary" fullWidth>
                        Login
                    </Button>

                </form>
            </Card>
        </div>
    )
}
