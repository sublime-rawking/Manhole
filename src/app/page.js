"use client";
import { laila } from "@/assets/fonts";
import { Button, ThemeProvider } from "@material-tailwind/react";


export default function Home() {
  return (
    <>
      <ThemeProvider>
        <div className="text-5xl font-bold text-center h-full "  style={{...laila.style}} >Landing Page</div>
      </ThemeProvider>
    </>
  );
}
