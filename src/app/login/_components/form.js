'use client'
import { Button, Card, Input } from '@material-tailwind/react';
import { useState } from 'react';
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <div className='my-5 h-fit  bg-white  flex justify-center  px-5 py-10 rounded-xl '>
            <Card color="transparent" shadow={false} className="">
                <p className={`text-2xl text-center md:text-3xl lg:text-4xl text-primary font-semibold `}>Admin Login </p>

                <form className="mt-6 w-full mx-auto  md:w-96">
                    <div className="mb-1 flex flex-col gap-6">

                        <div className=" text-black text-lg -mb-3 font-medium">
                            Your Email
                        </div>
                        <Input
                            size="lg"
                            placeholder="name@mail.com"
                            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
                        />
                        <div className=" text-black text-lg -mb-3 font-medium">

                            Password
                        </div>
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
