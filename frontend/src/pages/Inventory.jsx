import { useState, useEffect } from "react";
import api from "../api/axios";
import { Package, Plus, AlertTriangle, Pencil, Trash2, Save } from "lucide-react";
import Modal from "../components/Modal";

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [formData, setFormData] = useState({ name: "", quantity: "", unit_price: "", supplier: "", reorder_threshold: 5, unit: "pcs" });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await api.get("inventory/items/");
            setItems(res.data);
        } catch (error) { console.error("Error fetching inventory", error); }
    };

    const handleEdit = (item) => {
        setSelectedItemId(item.id);
        setFormData({
            name: item.name,
            current_stock: item.current_stock,
            unit_price: item.unit_price,
            supplier: item.supplier || "",
            reorder_threshold: item.reorder_threshold || 5,
            unit: item.unit || "pcs"
        });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedItemId(null);
        setFormData({ name: "", quantity: "", unit_price: "", supplier: "", reorder_threshold: 5, unit: "pcs" });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                current_stock: parseInt(formData.current_stock),
                unit_price: parseFloat(formData.unit_price),
                supplier: formData.supplier,
                reorder_threshold: parseInt(formData.reorder_threshold),
                unit: formData.unit
            };

            if (selectedItemId) {
                await api.put(`inventory/items/${selectedItemId}/`, payload);
            } else {
                await api.post("inventory/items/", payload);
            }
            fetchInventory();
            setIsModalOpen(false);
            alert("Item Saved Successfully!");
        } catch (error) {
            console.error("Save Error:", error.response?.data);
            alert(`Error: ${JSON.stringify(error.response?.data || "Check console")}`);
        }
    };

    const handleDelete = async (id) => {
        if(!confirm("Delete this item?")) return;
        try {
            await api.delete(`inventory/items/${id}/`);
            fetchInventory();
        } catch (error) { console.error(error); }
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
                <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 shadow transition">
                    <Plus className="w-5 h-5" /> Add Item
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex justify-between items-start group hover:shadow-lg transition">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Package className="text-blue-500 w-5 h-5" />
                                <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                            </div>
                            <p className="text-sm text-gray-500 mb-1">Supplier: {item.supplier || "N/A"}</p>

                            <div className="mt-4">
                                <span className={`text-3xl font-bold ${item.current_stock < item.reorder_threshold ? 'text-red-600' : 'text-gray-900'}`}>
                                    {item.current_stock}
                                </span>
                                <span className="text-xs text-gray-400 ml-1 uppercase">{item.unit}</span>
                            </div>
                        </div>

                        <div className="text-right flex flex-col items-end h-full justify-between">
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                                <button onClick={() => handleEdit(item)} className="text-gray-400 hover:text-blue-600 p-1">
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600 p-1">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div>
                                <p className="font-mono font-medium text-gray-600 text-lg">€{item.unit_price}</p>
                                {item.current_stock < item.reorder_threshold && (
                                    <div className="mt-2 flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full font-bold animate-pulse">
                                        <AlertTriangle className="w-3 h-3" /> Low Stock
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedItemId ? "Edit Item" : "Add Inventory Item"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                        <input className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. Kinesio Tape" required
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                            <input className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. Sixtus"
                                value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
                            <input className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 outline-none" placeholder="e.g. pcs, box, kg" required
                                value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                            <input className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 outline-none" type="number" placeholder="0" required
                                value={formData.current_stock} onChange={e => setFormData({...formData, current_stock: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Threshold</label>
                            <input className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 outline-none" type="number" placeholder="5" required
                                value={formData.reorder_threshold} onChange={e => setFormData({...formData, reorder_threshold: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (€)</label>
                        <input className="border p-2 rounded w-full focus:ring-2 focus:ring-green-500 outline-none" type="number" placeholder="0.00" step="0.01" required
                            value={formData.unit_price} onChange={e => setFormData({...formData, unit_price: e.target.value})} />
                    </div>

                    <button className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" />
                        {selectedItemId ? "Update Item" : "Save Item"}
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Inventory;