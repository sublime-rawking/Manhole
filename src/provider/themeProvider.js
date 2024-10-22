"use client"
import { ThemeProvider } from '@material-tailwind/react'
import React from 'react'

export default function CustomThemeProvider({ children }) {
    return (
        <ThemeProvider>{children}</ThemeProvider>
    )
}
