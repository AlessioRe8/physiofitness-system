import { useState, useEffect } from "react";
import api from "../api/axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsAI = () => {
    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchForecast();
    }, []);

    const fetchForecast = async () => {
        try {
            const response = await api.get("analytics/forecast/");
            setForecastData(response.data.clinic_forecast);
        } catch (error) {
            console.error("Error loading forecast:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">AI & Analytics Hub</h1>

            <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Demand Forecast (Next 7 Days)</h2>
                <div className="h-96 w-full"> {/* Increased height slightly since it's the only item now */}
                    {loading ? <p className="text-center py-10 text-gray-500">Loading AI Model...</p> : (
                        <ResponsiveContainer height={400} width="100%">
                            <LineChart data={forecastData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="weekday" />
                                <YAxis allowDecimals={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="predicted_count"
                                    stroke="#3B82F6"
                                    strokeWidth={4}
                                    activeDot={{ r: 8 }}
                                    name="Expected Appointments"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-800 text-sm">
                    <strong>AI Insight:</strong> This chart uses historical data to predict patient volume for the upcoming week. Use this to optimize staff scheduling.
                </div>
            </div>
        </div>
    );
};

export default AnalyticsAI;