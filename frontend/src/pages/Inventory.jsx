import { useState, useEffect } from "react";
import api from "../api/axios";
import { Package, AlertTriangle, Plus } from "lucide-react";

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await api.get("inventory/items/");
            setItems(response.data);
        } catch (error) {
            console.error("Error fetching inventory:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    <Plus className="w-5 h-5" />
                    <span>Add Item</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
                        <tr>
                            <th className="p-4">Item Name</th>
                            <th className="p-4">Stock Level</th>
                            <th className="p-4">Unit Price</th>
                            <th className="p-4">Supplier</th>
                            <th className="p-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan="5" className="p-4 text-center">Loading Inventory...</td></tr>
                        ) : items.map((item) => {
                            const isLowStock = item.quantity <= item.reorder_level;

                            return (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-medium text-gray-800 flex items-center space-x-3">
                                        <div className="bg-gray-100 p-2 rounded-full">
                                            <Package className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <span>{item.name}</span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`font-bold ${isLowStock ? "text-red-600" : "text-gray-800"}`}>
                                            {item.quantity}
                                        </span>
                                        <span className="text-gray-400 text-sm ml-1">units</span>
                                    </td>
                                    <td className="p-4 text-gray-600">€{item.unit_price}</td>
                                    <td className="p-4 text-gray-600">{item.supplier}</td>
                                    <td className="p-4">
                                        {isLowStock ? (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                Low Stock
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                In Stock
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Inventory;