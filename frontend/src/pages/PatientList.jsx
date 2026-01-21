import { useState, useEffect } from "react";
import api from "../api/axios";
import { Search, Plus, User, Save, Phone, Mail, Pencil, Power, CheckCircle, XCircle } from "lucide-react";
import Modal from "../components/Modal";

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    const [formData, setFormData] = useState({
        first_name: "", last_name: "", email: "",
        phone_number: "", tax_id: "",
        date_of_birth: "", gender: "O", is_active: true
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get("patients/");
            setPatients(response.data);
        } catch (error) { console.error("Error fetching patients:", error); }
    };

    const handleCreate = () => {
        setSelectedPatientId(null);
        setFormData({
            first_name: "", last_name: "", email: "",
            phone_number: "", tax_id: "",
            date_of_birth: "", gender: "O", is_active: true
        });
        setIsModalOpen(true);
    };

    const handleEdit = (patient) => {
        setSelectedPatientId(patient.id);
        setFormData({
            first_name: patient.first_name,
            last_name: patient.last_name,
            email: patient.email || "",
            phone_number: patient.phone_number || "",
            tax_id: patient.tax_id,
            date_of_birth: patient.date_of_birth || "",
            gender: patient.gender || "O",
            is_active: patient.is_active
        });
        setIsModalOpen(true);
    };

    const handleToggleStatus = async (patient) => {
        const newStatus = !patient.is_active;

        if (!window.confirm(`Are you sure you want to change active status to patient ${patient.first_name} ${patient.last_name}?`)) return;

        try {
            await api.patch(`patients/${patient.id}/`, { is_active: newStatus });

            setPatients(patients.map(p =>
                p.id === patient.id ? { ...p, is_active: newStatus } : p
            ));
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedPatientId) {
                await api.put(`patients/${selectedPatientId}/`, formData);
            } else {
                await api.post("patients/", formData);
            }
            fetchPatients();
            setIsModalOpen(false);
            alert("Patient record saved!");
        } catch (error) {
            console.error("Save Error:", error.response?.data);
            let errorMessage = "Error saving patient.";
            if (error.response && error.response.data) {
                const data = error.response.data;
                if (data.non_field_errors) errorMessage = data.non_field_errors[0];
                else if (data.email) errorMessage = `Email error: ${data.email[0]}`;
                else if (data.detail) errorMessage = data.detail;
            }
            alert(errorMessage);
        }
    };

    const filteredPatients = patients
        .filter(patient => {
            const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
            const code = (patient.tax_id || "").toLowerCase();
            const search = searchTerm.toLowerCase();
            return fullName.includes(search) || code.includes(search);
        })
        .sort((a, b) => {
            if (a.is_active === b.is_active) {
                return a.last_name.localeCompare(b.last_name);
            }
            return a.is_active ? -1 : 1;
        });
    // --------------------------------

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Patient Registry</h1>
                <button onClick={handleCreate} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow">
                    <Plus className="w-5 h-5" />
                    <span>Add Patient</span>
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center border">
                <Search className="text-gray-400 w-5 h-5 mr-3" />
                <input
                    type="text"
                    placeholder="Search by name or Fiscal Code..."
                    className="w-full outline-none text-gray-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-bold">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Details</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Tax ID</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredPatients.map((patient) => (
                            <tr key={patient.id} className={`border-b transition duration-200 ${
                                !patient.is_active ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-50'
                            }`}>
                                <td className="p-4 font-bold flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        patient.is_active ? 'bg-blue-100 text-blue-600' : 'bg-gray-300 text-gray-500'
                                    }`}>
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className={!patient.is_active ? "line-through decoration-gray-400" : "text-gray-800"}>
                                        {patient.first_name} {patient.last_name}
                                    </span>
                                </td>
                                <td className="p-4">
                                    Age: {patient.age} • {patient.gender}
                                </td>
                                <td className="p-4 space-y-1">
                                    <div className="flex items-center gap-2"><Phone className="w-3 h-3"/> {patient.phone_number || "-"}</div>
                                    <div className="flex items-center gap-2"><Mail className="w-3 h-3"/> {patient.email || "-"}</div>
                                </td>
                                <td className="p-4 font-mono text-xs">
                                    {patient.fiscal_code}
                                </td>
                                <td className="p-4 flex gap-3">
                                    <button onClick={() => handleEdit(patient)} className="text-blue-600 hover:text-blue-800" title="Edit">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleToggleStatus(patient)}
                                        className={patient.is_active ? "text-red-500 hover:text-red-700" : "text-green-500 hover:text-green-700"}
                                        title={patient.is_active ? "Change Active Status" : "Change Inactive Status"}
                                    >
                                        <Power className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedPatientId ? "Edit Patient" : "Register New Patient"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input name="first_name" placeholder="First Name" required
                            value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} className="border p-2 rounded w-full" />
                        <input name="last_name" placeholder="Last Name" required
                            value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} className="border p-2 rounded w-full" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input name="date_of_birth" type="date" required
                            value={formData.date_of_birth} onChange={e => setFormData({...formData, date_of_birth: e.target.value})} className="border p-2 rounded w-full text-gray-600" />
                        <select name="gender"
                            value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="border p-2 rounded w-full bg-white">
                            <option value="O">Other</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>

                    <input name="tax_id" placeholder="Fiscal Code (Tax ID)" required
                        value={formData.tax_id} onChange={e => setFormData({...formData, tax_id: e.target.value})} className="border p-2 rounded w-full font-mono uppercase" />
                    <input name="email" type="email" placeholder="Email Address"
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="border p-2 rounded w-full" />
                    <input name="phone_number" placeholder="Phone Number"
                        value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} className="border p-2 rounded w-full" />

                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2">
                        <Save className="w-4 h-4" />
                        {selectedPatientId ? "Update Record" : "Save Record"}
                    </button>

                </form>
            </Modal>
        </div>
    );
};

export default PatientList;