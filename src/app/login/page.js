"use client";
import { ThemeProvider } from '@material-tailwind/react';
import React from 'react'
import CarouselSection from './_components/carousel';
import LoginForm from './_components/form';

export default function Login() {
    return (
        <ThemeProvider>
            <div className='flex w-full h-[100vh] justify-between'>
                <div className='w-[80%] hidden lg:block h-[100vh] p-5'>

                    <CarouselSection />

                </div>
                <div className='w-full my-auto items-center p-5  h-fit  '>
                    <LoginForm />
                </div>
            </div>
        </ThemeProvider>
    )
}
