import { useState, useEffect } from "react";
import api from "../api/axios";
import { Briefcase, Plus, Clock, Euro, Pencil, Trash2, Save } from "lucide-react";
import Modal from "../components/Modal";

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        duration_minutes: 30,
        price: 0.00,
        is_active: true
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await api.get("scheduling/services/");
            setServices(res.data);
        } catch (error) { console.error("Error fetching services", error); }
    };

    const handleCreate = () => {
        setSelectedServiceId(null);
        setFormData({ name: "", description: "", duration_minutes: 30, price: 0.00, is_active: true });
        setIsModalOpen(true);
    };

    const handleEdit = (service) => {
        setSelectedServiceId(service.id);
        setFormData({
            name: service.name,
            description: service.description || "",
            duration_minutes: service.duration_minutes,
            price: service.price,
            is_active: service.is_active
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedServiceId) {
                await api.put(`scheduling/services/${selectedServiceId}/`, formData);
            } else {
                await api.post("scheduling/services/", formData);
            }
            fetchServices();
            setIsModalOpen(false);
            alert("Service saved successfully!");
        } catch (error) {
            console.error(error);
            alert("Error saving service.");
        }
    };

    const handleDelete = async (id) => {
        if(!confirm("Are you sure? This might affect existing appointments.")) return;
        try {
            await api.delete(`scheduling/services/${id}/`);
            fetchServices();
        } catch (error) { console.error(error); }
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Clinical Services</h1>
                <button onClick={handleCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow">
                    <Plus className="w-5 h-5" /> Add Service
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div key={service.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 group hover:shadow-lg transition">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{service.name}</h3>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${service.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {service.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition">
                                <button onClick={() => handleEdit(service)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(service.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                            {service.description || "No description provided."}
                        </p>

                        <div className="flex items-center justify-between border-t pt-4 text-sm font-medium">
                            <div className="flex items-center text-gray-600">
                                <Clock className="w-4 h-4 mr-2 text-blue-400" />
                                {service.duration_minutes} min
                            </div>
                            <div className="flex items-center text-gray-800 font-bold text-lg">
                                <Euro className="w-4 h-4 text-green-500 mr-1" />
                                {service.price}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedServiceId ? "Edit Service" : "New Service"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                        <input className="border p-2 rounded w-full" required
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea className="border p-2 rounded w-full" rows="3"
                            value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Minutes)</label>
                            <input type="number" className="border p-2 rounded w-full" required
                                value={formData.duration_minutes} onChange={e => setFormData({...formData, duration_minutes: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
                            <input type="number" step="0.01" className="border p-2 rounded w-full" required
                                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_active" className="w-4 h-4 text-blue-600 rounded"
                            checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} />
                        <label htmlFor="is_active" className="text-sm text-gray-700">Available for booking</label>
                    </div>

                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" />
                        Save Service
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default ServiceList;