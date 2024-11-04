"use client"
import { BsDeviceSsd } from "react-icons/bs";
import { CgAppleWatch } from "react-icons/cg";
import DashboardCards from './_components/dashboardCards';


export default function DashboardPage() {
    return (
        <div className='p-5'>
            <div className=' flex gap-6'>
                <DashboardCards title="Devices" icon={<BsDeviceSsd className='h-5 w-5' />} value={2} />
                <DashboardCards title="Devices" icon={<CgAppleWatch className='h-5 w-5' />} value={2} />
                <DashboardCards title="Devices" icon={<BsDeviceSsd className='h-5 w-5' />} value={2} />
            </div>
        </div>
    )
}
