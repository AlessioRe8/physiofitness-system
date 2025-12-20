import { useState, useEffect } from "react";
import api from "../api/axios";
import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";

const Billing = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const response = await api.get("billing/invoices/");
            setInvoices(response.data);
        } catch (error) {
            console.error("Error fetching invoices:", error);
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            PAID: "bg-green-100 text-green-700",
            ISSUED: "bg-blue-100 text-blue-700",
            DRAFT: "bg-gray-100 text-gray-700",
            OVERDUE: "bg-red-100 text-red-700"
        };
        const icons = {
            PAID: CheckCircle,
            ISSUED: Clock,
            DRAFT: FileText,
            OVERDUE: AlertCircle
        };
        const Icon = icons[status] || FileText;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${styles[status] || styles.DRAFT}`}>
                <Icon className="w-3 h-3 mr-1" />
                {status}
            </span>
        );
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Billing & Invoices</h1>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
                        <tr>
                            <th className="p-4">Invoice #</th>
                            <th className="p-4">Patient</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="6" className="p-4 text-center">Loading Invoices...</td></tr>
                        ) : invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-mono text-sm text-gray-500">#{inv.id.toString().slice(0, 8)}...</td>
                                <td className="p-4 font-medium text-gray-800">
                                    {inv.patient_name || "Unknown Patient"}
                                </td>
                                <td className="p-4 text-gray-600">{inv.date}</td>
                                <td className="p-4 font-bold text-gray-800">€{inv.total_amount}</td>
                                <td className="p-4">
                                    <StatusBadge status={inv.status} />
                                </td>
                                <td className="p-4 text-center">
                                    <button className="text-blue-600 hover:underline text-sm font-medium">
                                        Download PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {invoices.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">No invoices found.</div>
                )}
            </div>
        </div>
    );
};

export default Billing;