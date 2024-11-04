"use client"
import { ThemeProvider } from '@material-tailwind/react'
import { Sidebar } from './_components/sidebar'

export default function layout({ children }) {
    return (
        <ThemeProvider

        >
            <div className='flex w-full h-[100vh]'>
                <Sidebar />
                {children}
            </div>
        </ThemeProvider>
    )
}
