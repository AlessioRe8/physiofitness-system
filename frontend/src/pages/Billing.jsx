import { useState, useEffect } from "react";
import api from "../api/axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Modal from "../components/Modal";

const Billing = () => {
    const [invoices, setInvoices] = useState([]);
    const [patients, setPatients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

    const [formData, setFormData] = useState({ patient_id: "", amount: "", status: "ISSUED", description: "" });

    useEffect(() => {
        fetchInvoices();
        api.get("patients/").then(res => setPatients(res.data)).catch(console.error);
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await api.get("billing/invoices/");
            setInvoices(res.data);
        } catch (error) { console.error("Error fetching invoices", error); }
    };

    const handleCreate = () => {
        setSelectedInvoiceId(null);
        setFormData({ patient_id: "", amount: "", status: "PARTIAL", description: "" });
        setIsModalOpen(true);
    };

    const handleEdit = (inv) => {
        setSelectedInvoiceId(inv.id);
        setFormData({
            patient_id: inv.patient,
            amount: inv.total_amount,
            status: inv.status,
            description: inv.notes || ""
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                patient: formData.patient_id,
                total_amount: parseFloat(formData.amount),
                status: formData.status,
                notes: formData.description,
                issue_date: new Date().toISOString().split('T')[0]
            };

            if (selectedInvoiceId) {
                await api.put(`billing/invoices/${selectedInvoiceId}/`, payload);
            } else {
                await api.post("billing/invoices/", payload);
            }
            fetchInvoices();
            setIsModalOpen(false);
            alert("Invoice Saved!");
        } catch (error) {
            console.error("Billing Error:", error.response?.data);
            alert(`Error: ${JSON.stringify(error.response?.data || "Check that a patient is selected.")}`);
        }
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Billing & Invoices</h1>
                <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow">
                    <Plus className="w-5 h-5" /> Create Invoice
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4">ID</th>
                            <th className="p-4">Patient</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Amount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {invoices.map((inv) => (
                            <tr key={inv.id} className="hover:bg-gray-50 transition">
                                <td className="p-4 font-mono text-gray-500">#{inv.id}</td>
                                <td className="p-4 font-medium text-gray-800">{inv.patient_name || inv.patient}</td>
                                <td className="p-4 text-gray-500">{inv.issue_date}</td>
                                <td className="p-4 font-bold text-gray-900">€{inv.total_amount}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        inv.status === "PAID" ? "bg-green-100 text-green-700" :
                                        inv.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                                        inv.status === "PARTIAL" ? "bg-blue-100 text-blue-700" :
                                        "bg-yellow-100 text-yellow-800" // Default for ISSUED
                                    }`}>
                                        {inv.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <button onClick={() => handleEdit(inv)} className="text-blue-600 hover:text-blue-800">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedInvoiceId ? "Edit Invoice" : "Issue New Invoice"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                        <select required className="border p-2 rounded w-full bg-white"
                            value={formData.patient_id} onChange={e => setFormData({...formData, patient_id: e.target.value})}>
                            <option value="">Choose Patient</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.first_name} {p.last_name} ({p.fiscal_code})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (€)</label>
                            <input type="number" className="border p-2 rounded w-full" placeholder="0.00" required step="0.01"
                                value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select className="border p-2 rounded w-full bg-white"
                                value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                                <option value="ISSUED">Issued (Unpaid)</option>
                                <option value="PARTIAL">Partially Paid</option>
                                <option value="PAID">Paid</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea className="border p-2 rounded w-full" placeholder="Transaction details" rows="3"
                            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>

                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">
                        {selectedInvoiceId ? "Update Invoice" : "Generate Invoice"}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Billing;