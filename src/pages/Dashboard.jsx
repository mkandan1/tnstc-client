import { useEffect, useState } from "react";
import { Card } from "../components/common/Card";
import { PanelContainer } from "../components/Layouts/Container";
import { Icon } from "@iconify/react/dist/iconify.js";
import statisticsService from "../services/statistics.service";

const Dashboard = () => {
    const [statistics, setStatistics] = useState({
        users: 0,
        buses: 0,
        busStops: 0,
        routes: 0,
        onLive: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const data = await statisticsService.getStatistics();
                setStatistics({
                    users: data.user,
                    buses: data.buses,
                    busStops: data.busStops,
                    routes: data.routes,
                    onLive: data.onLive
                });
                setLoading(false);
            } catch (err) {
                setError("Failed to load statistics");
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <PanelContainer>
            <div className="h-80">
                <div className="pt-2">
                    <h1 className="font-bold text-xl text-blueGray-700">Dashboard</h1>
                    <p className="text-sm text-coolGray-500 mt-1">Welcome to Rural Area Bus Tracking System!</p>
                </div>
                <div className="py-6 flex gap-4 flex-wrap">
                    <Card title={'Users'} value={statistics.users} icon={'mingcute:group-3-fill'} iconBg={'bg-red-500'} />
                    <Card title={'Bus Stops'} value={statistics.busStops} icon={'fa6-solid:indian-rupee-sign'} iconBg={'bg-green-500'} />
                    <Card title={'Buses'} value={statistics.buses} icon={'f7:chart-pie-fill'} iconBg={'bg-orange-500'} />
                    <Card title={'Routes'} value={statistics.routes} icon={'clarity:employee-solid'} iconBg={'bg-rose-500'} />
                    <Card title={'On Live'} value={statistics.onLive} icon={'solar:bus-bold'} iconBg={'bg-blue-500'} />
                </div>
                <div className="bg-coolGray-100 p-3 border rounded shadow-md absolute right-5 flex flex-col justify-center items-center bottom-4 text-coolGray-400">
                    <h5 className="flex gap-2 items-center text-sm"><Icon icon={'raphael:info'} className="text-md" /> Some features are under development.</h5>
                </div>
            </div>
        </PanelContainer>
    );
}

export default Dashboard;
