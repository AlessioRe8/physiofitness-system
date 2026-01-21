import { useState, useEffect } from "react";
import api from "../api/axios";
import Modal from "../components/Modal";
import {
    User, Mail, Shield, CheckCircle, XCircle,
    Pencil, Trash2, Key, Search, KeyRound
} from "lucide-react";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isResetting, setIsResetting] = useState(false);

    const [userData, setUserData] = useState({
        first_name: "",
        last_name: "",
        role: "PHYSIO",
        is_active: true,
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredUsers(users);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = users.filter(u =>
                u.email.toLowerCase().includes(lowerQuery) ||
                (u.first_name + " " + u.last_name).toLowerCase().includes(lowerQuery)
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    const fetchUsers = async () => {
        try {
            const res = await api.get("users/");
            setUsers(res.data);
            setFilteredUsers(res.data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    };


    const handleOpenEdit = (user) => {
        setSelectedUser(user);
        setUserData({
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            is_active: user.is_active,
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`users/${selectedUser.id}/`, userData);
            alert("User updated successfully!");
            fetchUsers();
            setIsEditModalOpen(false);
        } catch (error) {
            console.error(error);
            alert(`Error: ${JSON.stringify(error.response?.data || "Update failed")}`);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        try {
            await api.delete(`users/${id}/`);
            fetchUsers();
        } catch (error) {
            console.error(error);
            alert("Error deleting user.");
        }
    };

    const handleResetPassword = async (user) => {
        if (!confirm(`Generate new random password for ${user.first_name} and email it to ${user.email}?`)) return;

        setIsResetting(true);
        try {
            const res = await api.post(`users/${user.id}/reset-password/`);

            if (res.data.temp_password) {
                alert(`Email failed (Dev Mode). Temporary Password: ${res.data.temp_password}`);
            } else {
                alert("Success! New password sent via email. Check django console.");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to reset password.");
        } finally {
            setIsResetting(false);
        }
    };


    const getRoleBadge = (role) => {
        switch (role) {
            case 'ADMIN': return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold border border-purple-200">Admin</span>;
            case 'PHYSIO': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold border border-blue-200">Physio</span>;
            case 'RECEPTIONIST': return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold border border-green-200">Reception</span>;
            default: return <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-bold">Patient</span>;
        }
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">User List</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage users and permissions</p>
                </div>
                <div className="relative md:w-64">
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search staff..."
                        className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* USERS TABLE */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-bold border-b">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map((u) => (
                            <tr key={u.id} className="hover:bg-gray-50 transition">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800">{u.first_name} {u.last_name}</p>
                                            <div className="flex items-center text-gray-400 text-xs">
                                                <Mail className="w-3 h-3 mr-1" />
                                                {u.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    {getRoleBadge(u.role)}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleResetPassword(u)}
                                            disabled={isResetting}
                                            title="Reset Password"
                                            className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition disabled:opacity-50"
                                        >
                                            <KeyRound className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleOpenEdit(u)}
                                            title="Edit User"
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            title="Delete User"
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL: EDIT USER */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Staff Details">
                <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded mb-2">
                        <strong>Note:</strong> Email addresses cannot be changed here.
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none" required
                                value={userData.first_name} onChange={e => setUserData({...userData, first_name: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-500 outline-none" required
                                value={userData.last_name} onChange={e => setUserData({...userData, last_name: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select className="border p-2 rounded w-full bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={userData.role} onChange={e => setUserData({...userData, role: e.target.value})}>
                            <option value="PHYSIO">Physiotherapist</option>
                            <option value="RECEPTIONIST">Receptionist</option>
                            <option value="ADMIN">Administrator</option>
                            <option value="PATIENT">Patient</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="isActive" className="w-4 h-4 text-blue-600 rounded"
                            checked={userData.is_active} onChange={e => setUserData({...userData, is_active: e.target.checked})} />
                        <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">Active Account</label>
                    </div>

                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow mt-4">
                        Save Changes
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default Users;