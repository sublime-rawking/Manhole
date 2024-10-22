import React from 'react'

export default function DashboardCards({ title, icon, value }) {
    return (
        <div className='rounded-xl shadow-md shadow-blue-gray-900/5 p-4 mx-auto my-4 h-fit  w-fit'>
            <div className='flex justify-between gap-4 items-center'>
                {icon}
                <div className=' flex flex-col justify-end items-end'>
                    <h1 className='text-xl font-semibold'>{title}</h1>
                    <p className='text-2xl font-semibold'>{value}</p>
                </div>
            </div>
        </div>
    )
}
