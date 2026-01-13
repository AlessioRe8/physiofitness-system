import { useState, useEffect } from "react";
import api from "../api/axios";
import { Search, Plus, User, Save, Phone, Mail, Pencil } from "lucide-react";
import Modal from "../components/Modal";

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState(null);

    const [formData, setFormData] = useState({
        first_name: "", last_name: "", email: "",
        phone_number: "", fiscal_code: "",
        date_of_birth: "", gender: "O"
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
            phone_number: "", fiscal_code: "",
            date_of_birth: "", gender: "O"
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
            fiscal_code: patient.fiscal_code,
            date_of_birth: patient.date_of_birth || "",
            gender: patient.gender || "O"
        });
        setIsModalOpen(true);
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
            alert("Error saving patient.");
        }
    };

    const filteredPatients = patients.filter(patient => {
        const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
        const code = (patient.fiscal_code || "").toLowerCase();
        const search = searchTerm.toLowerCase();
        return fullName.includes(search) || code.includes(search);
    });

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
                            <th className="p-4">Fiscal Code</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredPatients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-blue-50 transition">
                                <td className="p-4 font-bold text-gray-800 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        <User className="w-4 h-4" />
                                    </div>
                                    {patient.first_name} {patient.last_name}
                                </td>
                                <td className="p-4 text-gray-500">
                                    Age: {patient.age} • {patient.gender}
                                </td>
                                <td className="p-4 text-gray-500 space-y-1">
                                    <div className="flex items-center gap-2"><Phone className="w-3 h-3"/> {patient.phone_number || "-"}</div>
                                    <div className="flex items-center gap-2"><Mail className="w-3 h-3"/> {patient.email || "-"}</div>
                                </td>
                                <td className="p-4 text-gray-500 font-mono bg-gray-50 rounded px-2">
                                    {patient.fiscal_code}
                                </td>
                                <td className="p-4">
                                    <button onClick={() => handleEdit(patient)} className="text-blue-600 hover:text-blue-800">
                                        <Pencil className="w-4 h-4" />
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

                    <input name="fiscal_code" placeholder="Fiscal Code (Tax ID)" required
                        value={formData.fiscal_code} onChange={e => setFormData({...formData, fiscal_code: e.target.value})} className="border p-2 rounded w-full font-mono uppercase" />
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