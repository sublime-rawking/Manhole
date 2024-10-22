"use client"
import { appName } from "@/assets/constants";
import {
    Card,
} from "@material-tailwind/react";
import { GrHomeRounded } from "react-icons/gr";
import { MdOutlineDeviceHub } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from 'next/navigation'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const sideBarContent = [
    {
        title: "Dashboard",
        icon: <GrHomeRounded className="h-5 w-5" />,
        route: "/dashboard"
    }, {
        title: "Devices",
        icon: <MdOutlineDeviceHub className="h-5 w-5" />,
        route: "/dashboard/devices"
    }, {
        title: "Settings",
        icon: <IoSettingsOutline className="h-5 w-5" />,
        route: "/dashboard/settings"
    },

]
export function Sidebar() {
    const [minimize, setMinimize] = useState(false);
    const pathname = usePathname()

    // const selectedRoute = sideBarContent.find(item => item.route === currentRoute);
    const handleMinimize = () => {
        setMinimize(!minimize);
    }

    return (
        <Card className={`h-full w-full  ${minimize ? "md:w-fit hover:md:w-full group" : ""} md:max-w-[12rem] p-4 rounded-none  bg-white text-black shadow-xl shadow-blue-gray-900/5`}>
            <div className="mb-2 p-4 text-center mx-auto">
                <p className="text-2xl font-semibold text-primary" >
                    {minimize ? "AE" : appName}
                </p>
            </div>
            <div className="w-full p-0 m-0 h-full items-center">
                {sideBarContent.map((item, index) => (
                    <Link href={item.route} key={index} >
                        <div className={` my-2 hover:bg-primary/15 hover:text-black p-2 pl-4 rounded-lg  flex items-center gap-4 ${minimize ? "w-fit" : "w-full"}  ${pathname == item.route ? "bg-secondary text-white font-medium" : ""} `}>
                            {item.icon}
                            <div className={`${minimize ? "hidden group-hover:block" : "block"}`} >
                                {item.title}
                            </div>
                        </div>
                    </Link>))}

            </div>
            <div className="mt-auto mb-2">

                <div className={`   my-2 hover:bg-white/10 p-2 rounded-lg w-full flex items-center gap-2  `}>
                    <AiOutlineLogout className="h-5 w-5" />
                    <div className={`${minimize ? "hidden group-hover:block" : "block"}`} >

                        Logout
                    </div>
                </div>
                <div className={` my-2 hover:bg-primary/15 hover:text-black p-2 pl-4 rounded-lg  flex items-center gap-4 ${minimize ? "w-fit" : "w-full"}   `}>
                    {minimize ?
                        <IoIosArrowForward onClick={handleMinimize} className="h-5 w-5" />
                        : <IoIosArrowBack onClick={handleMinimize} className="h-5 w-5" />
                    }

                </div>


            </div>
        </Card>
    );
}