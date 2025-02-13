import { useState } from "react";
import { Card } from "../components/common/Card";
import { PanelContainer } from "../components/Layouts/Container";
import { Icon } from "@iconify/react/dist/iconify.js";

const Dashboard = () => {
    const [lastMonthStatistics, setLastMonthStatistics] = useState({ students: 2678, revenue: 22005, sales: 345, instructors: 3 })
    return (
        <PanelContainer>
            <div className="h-80">
                <div className="pt-2">
                    <h1 className="font-bold text-xl text-blueGray-700">Dashboard</h1>
                    <p className="text-sm text-coolGray-500 mt-1">Welcome to Learning Management System!</p>
                </div>
                <div className="py-6 flex gap-4 flex-wrap ">
                    <Card title={'Students'} value={lastMonthStatistics.students} icon={'mingcute:group-3-fill'} iconBg={'bg-red-500'} />
                    <Card title={'Revenue'} value={lastMonthStatistics.revenue} icon={'fa6-solid:indian-rupee-sign'} iconBg={'bg-green-500'} />
                    <Card title={'Saless'} value={lastMonthStatistics.sales} icon={'f7:chart-pie-fill'} iconBg={'bg-orange-500'} />
                    <Card title={'Instructors'} value={lastMonthStatistics.instructors} icon={'clarity:employee-solid'} iconBg={'bg-rose-500'} />
                </div>
                <div className="bg-coolGray-100 p-3 border rounded shadow-md absolute right-5 flex flex-col justify-center items-center bottom-4 text-coolGray-400">
                    <h5 className="flex gap-2 items-center text-sm"><Icon icon={'raphael:info'} className="text-md" /> Some features are under development.</h5>
                </div>
            </div>
        </PanelContainer>
    );
}

export default Dashboard;