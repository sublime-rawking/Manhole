import React from 'react'

export default function DashboardCards({ title, icon, value }) {
    return (
        <div className='rounded-xl shadow-md shadow-black/25 p-4 mx-auto my-4 h-fit  w-fit'>
            <div className='flex justify-between gap-8  items-center'>
                <div className='text-white bg-primary p-3 rounded-lg'>
                    {icon}
                </div>
                <div className=' flex flex-col justify-end items-end'>
                    <h1 className='text-base font-light '>{title}</h1>
                    <p className='text-2xl font-semibold'>{value}</p>
                </div>
            </div>
        </div>
    )
}
