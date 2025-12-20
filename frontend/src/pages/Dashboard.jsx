import { useEffect, useState } from "react";
import api from "../api/axios";
import { Users, Calendar as CalendarIcon, DollarSign, FileText } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_patients: 0,
        today_appointments: 0,
        monthly_revenue: 0,
        pending_invoices: 0,
        role: 'GUEST'
    });

    const [forecastData, setForecastData] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [statsRes, forecastRes, apptRes] = await Promise.all([
                    api.get("analytics/dashboard/"),
                    api.get("analytics/forecast/"),
                    api.get("scheduling/appointments/")
                ]);

                setStats(statsRes.data);

                setForecastData(forecastRes.data.clinic_forecast);

                const formattedEvents = apptRes.data.map(appt => ({
                    id: appt.id,
                    title: appt.patient_name,
                    start: appt.start_time,
                    color: '#3B82F6'
                }));
                setAppointments(formattedEvents);

            } catch (error) {
                console.error("Error loading dashboard:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-xl text-blue-600">Loading Dashboard...</div>
        </div>
    );

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div className="p-6 bg-white rounded-xl shadow-md flex items-center space-x-4 border-l-4" style={{ borderColor: color }}>
            <div className={`p-3 rounded-full bg-opacity-20`} style={{ backgroundColor: color }}>
                <Icon className="w-8 h-8" style={{ color: color }} />
            </div>
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <h4 className="text-2xl font-bold">{value}</h4>
            </div>
        </div>
    );

    const isAdmin = stats.role === 'ADMIN';

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                {isAdmin ? "Clinic Overview" : "My Daily Overview"}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Active Patients"
                    value={stats.total_patients}
                    icon={Users}
                    color="#3B82F6"
                />
                <StatCard
                    title="Appointments Today"
                    value={stats.today_appointments}
                    icon={CalendarIcon}
                    color="#10B981"
                />
                {isAdmin && (
                    <>
                        <StatCard
                            title="Monthly Revenue"
                            value={`€${stats.monthly_revenue}`}
                            icon={DollarSign}
                            color="#F59E0B"
                        />
                        <StatCard
                            title="Pending Invoices"
                            value={stats.pending_invoices}
                            icon={FileText}
                            color="#EF4444"
                        />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col h-96">
                    <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        AI Demand Forecast (Next 7 Days)
                    </h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={forecastData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis
                                    dataKey="weekday"
                                    tick={{fontSize: 12}}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{fontSize: 12}}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="predicted_count"
                                    stroke="#3B82F6"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md h-96 overflow-hidden flex flex-col">
                    <h3 className="text-lg font-bold text-gray-700 mb-2 flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Upcoming Schedule
                    </h3>
                    <div className="flex-1 text-xs">
                        <FullCalendar
                            plugins={[dayGridPlugin]}
                            initialView="dayGridMonth"
                            headerToolbar={{
                                left: 'title',
                                center: '',
                                right: 'prev,next'
                            }}
                            events={appointments}
                            height="100%"
                            eventDisplay="list-item"
                        />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;