import { useState, useEffect } from "react";
import api from "../api/axios";
import { Search, Plus, User, Save} from "lucide-react";
import Modal from "../components/Modal";

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        first_name: "", last_name: "", email: "", phone: "", tax_id: ""
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await api.get("patients/");
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("patients/", formData);
            setPatients([...patients, response.data]);
            setIsModalOpen(false);
            setFormData({ first_name: "", last_name: "", email: "", phone: "", tax_id: "" });
            alert("Patient added successfully!");
        } catch (error) {
            alert("Error adding patient. Check if Tax ID is unique.");
        }
    };

    const filteredPatients = patients.filter(patient => {
        const fullName = `${patient.first_name || ""} ${patient.last_name || ""}`.toLowerCase();
        const taxId = (patient.tax_id || "").toLowerCase();
        const search = searchTerm.toLowerCase();

        return fullName.includes(search) || taxId.includes(search);
    });

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Patients</h1>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <Plus className="w-5 h-5" />
                    <span>Add Patient</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name or Tax ID..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Phone</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Tax ID</th>
                            <th className="p-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="p-4 text-center">Loading...</td></tr>
                        ) : filteredPatients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-blue-50 transition-colors">
                                <td className="p-4 flex items-center space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <span className="font-medium text-gray-800">
                                        {patient.first_name} {patient.last_name}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">{patient.phone || "-"}</td>
                                <td className="p-4 text-gray-600">{patient.email || "-"}</td>
                                <td className="p-4 text-gray-600">{patient.tax_id || "-"}</td>
                                <td className="p-4 text-center">
                                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredPatients.length === 0 && !loading && (
                    <div className="p-8 text-center text-gray-500">No patients found.</div>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Patient">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input name="first_name" placeholder="First Name" required onChange={handleInputChange} className="border p-2 rounded w-full" />
                        <input name="last_name" placeholder="Last Name" required onChange={handleInputChange} className="border p-2 rounded w-full" />
                    </div>
                    <input name="email" type="email" placeholder="Email" required onChange={handleInputChange} className="border p-2 rounded w-full" />
                    <input name="phone" placeholder="Phone Number" onChange={handleInputChange} className="border p-2 rounded w-full" />
                    <input name="tax_id" placeholder="Tax ID / SSN" required onChange={handleInputChange} className="border p-2 rounded w-full" />

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 flex justify-center items-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>Save Patient</span>
                    </button>
                </form>
            </Modal>

        </div>
    );
};

export default PatientList;