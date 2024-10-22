"use client";
import CarouselSection from './_components/carousel';
import LoginForm from './_components/form';

export default function Login() {
    return (
        <>
            <div className=' w-full h-[100vh] '>
                {/* <div className='w-[80%] hidden lg:block h-[100vh] p-5'> */}

                <CarouselSection />

                {/* </div> */}
                <div className='absolute inset-0 flex justify-center items-center p-5'>
                    <LoginForm />
                </div>
            </div>
        </>
    )
}
