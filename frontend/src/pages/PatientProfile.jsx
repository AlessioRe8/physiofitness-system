import { useState, useEffect, useContext } from "react";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import { User, Calendar, Clock, ArrowRight, Pencil, Save, X, Video, FileText, Download } from "lucide-react";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

const PatientProfile = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [patientData, setPatientData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [bookingData, setBookingData] = useState({ service_id: "", start_time: "", notes: "" });
    const [services, setServices] = useState([]);

    const [editFormData, setEditFormData] = useState({
        phone_number: "",
        date_of_birth: "",
        gender: "O"
    });

    useEffect(() => {
        if (user) {
            fetchMyPatientProfile();
            fetchMyAppointments();
            fetchServices();
        }
    }, [user]);

    const fetchMyPatientProfile = async () => {
        try {
            const res = await api.get(`patients/?search=${user.email}`);
            if (res.data && res.data.length > 0) {
                const p = res.data[0];
                setPatientData(p);
                setEditFormData({
                    phone_number: p.phone_number || "",
                    date_of_birth: p.date_of_birth || "",
                    gender: p.gender || "O"
                });
            }
        } catch (error) { console.error("Could not find patient profile", error); }
    };

    const fetchMyAppointments = async () => {
        try {
            const res = await api.get("scheduling/appointments/");
            const sorted = res.data.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
            setAppointments(sorted);
        } catch (error) { console.error("Error fetching appointments", error); }
    };

    const fetchServices = async () => {
        try {
            const res = await api.get("scheduling/services/");
            setServices(res.data.filter(s => s.is_active));
        } catch (error) { console.error(error); }
    };

    const handleSaveProfile = async () => {
        console.log("Save button clicked. Current Form Data:", editFormData);

        if (!patientData) {
            console.error("Error: patientData is null. Cannot update.");
            alert("Profile Error: We could not find a Patient Record linked to this account.\n\nPlease ask the clinic to check if your 'Patient' file exists and matches your email.");
            return;
        }

        try {
            const res = await api.patch(`patients/${patientData.id}/`, editFormData);

            setPatientData(res.data);
            setIsEditing(false);
            alert("Profile updated successfully!");

        } catch (error) {
            console.error("Update API failed:", error);
            alert("Failed to update profile. Check console for details.");
        }
    };

    const handleJoinTeleconsult = (appt) => {
        const roomUrl = `https://meet.jit.si/PhysioFitness-${appt.id}`;
        if(window.confirm("Enter our secure Tele-Consultation room?")) {
            window.open(roomUrl, "_blank");
        }
    };

    const handleDownloadInvoice = (appt) => {
        alert(`Downloading Electronic Invoice (XML/PDF) for Appointment #${appt.id}...\n\n(Integration with SDI/Agenzia delle Entrate)`);
    };

    const handleBookMock = (e) => {
        e.preventDefault();
        alert("Booking request received!\n\nWe will contact you at " + user.email + " shortly.");
        setIsBookingOpen(false);
        setBookingData({ service_id: "", start_time: "", notes: "" });
    };

    const isPast = (dateString) => new Date(dateString) < new Date();

    if (!user) return <div className="p-8">Please log in.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative">
                    {!isEditing ? (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-blue-600 transition"
                            title="Edit Profile"
                        >
                            <Pencil className="w-5 h-5" />
                        </button>
                    ) : (
                        <div className="absolute top-6 right-6 flex gap-2">
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                            <button onClick={handleSaveProfile} className="text-green-600 hover:text-green-700">
                                <Save className="w-6 h-6" />
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="bg-blue-100 p-4 rounded-full flex-shrink-0">
                            <User className="w-12 h-12 text-blue-600" />
                        </div>

                        <div className="flex-1 w-full text-center md:text-left">
                            <h1 className="text-2xl font-bold text-gray-800">{user.first_name} {user.last_name}</h1>
                            <p className="text-gray-500 mb-4">{user.email}</p>

                            <div className="grid md:grid-cols-3 gap-6 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editFormData.phone_number}
                                            onChange={e => setEditFormData({...editFormData, phone_number: e.target.value})}
                                            className="w-full border p-1 rounded text-sm"
                                            placeholder="+39..."
                                        />
                                    ) : (
                                        <p className="text-gray-700 font-medium">{patientData?.phone_number || "-"}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date of Birth</label>
                                    {isEditing ? (
                                        <input
                                            type="date"
                                            value={editFormData.date_of_birth}
                                            onChange={e => setEditFormData({...editFormData, date_of_birth: e.target.value})}
                                            className="w-full border p-1 rounded text-sm"
                                        />
                                    ) : (
                                        <p className="text-gray-700 font-medium">{patientData?.date_of_birth || "-"}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Gender</label>
                                    {isEditing ? (
                                        <select
                                            value={editFormData.gender}
                                            onChange={e => setEditFormData({...editFormData, gender: e.target.value})}
                                            className="w-full border p-1 rounded text-sm bg-white"
                                        >
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                            <option value="O">Other</option>
                                        </select>
                                    ) : (
                                        <p className="text-gray-700 font-medium">
                                            {patientData?.gender === 'M' ? 'Male' : patientData?.gender === 'F' ? 'Female' : 'Other'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center md:justify-end border-t pt-4">
                        <button
                            onClick={() => setIsBookingOpen(true)}
                            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-blue-700 shadow-lg transition flex items-center gap-2"
                        >
                            Book New Appointment <ArrowRight className="w-4 h-4"/>
                        </button>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        My Appointments
                    </h2>

                    <div className="grid gap-4">
                        {appointments.length === 0 ? (
                            <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 italic">No appointments found.</p>
                            </div>
                        ) : (
                            appointments.map(appt => {
                                const passed = isPast(appt.end_time);
                                const canJoinVideo = !passed && appt.status === 'CONFIRMED';

                                return (
                                    <div key={appt.id} className={`p-5 rounded-xl shadow-sm border transition-all ${
                                        passed ? 'bg-gray-50 border-gray-100 opacity-70' : 'bg-white border-gray-200'
                                    }`}>
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <div>
                                                <h3 className={`font-bold text-lg ${passed ? 'text-gray-600' : 'text-gray-800'}`}>
                                                    {appt.title || "Physio Session"}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
                                                    <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(appt.start_time).toLocaleString()}
                                                    </span>
                                                    {appt.therapist_name && (
                                                        <span className="text-blue-600">with Dr. {appt.therapist_name}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                                {canJoinVideo && (
                                                    <button
                                                        onClick={() => handleJoinTeleconsult(appt)}
                                                        className="flex items-center gap-1 bg-violet-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-violet-700 transition shadow-sm flex-1 md:flex-none justify-center"
                                                    >
                                                        <Video className="w-4 h-4" /> Tele-Visit
                                                    </button>
                                                )}

                                                {passed && (
                                                    <button
                                                        onClick={() => handleDownloadInvoice(appt)}
                                                        className="flex items-center gap-1 border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-gray-100 transition flex-1 md:flex-none justify-center"
                                                    >
                                                        <Download className="w-4 h-4" /> Invoice
                                                    </button>
                                                )}

                                                <span className={`px-3 py-1.5 rounded-full text-xs font-bold text-center ${
                                                    passed
                                                        ? 'bg-gray-200 text-gray-500 border border-gray-300'
                                                        : appt.status === 'CONFIRMED'
                                                            ? 'bg-green-50 text-green-700 border border-green-200'
                                                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                                                }`}>
                                                    {passed ? "COMPLETED" : appt.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <Modal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} title="Request Appointment">
                    <form onSubmit={handleBookMock} className="space-y-4">
                        <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg">Confirmation sent to: <b>{user.email}</b></div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                            <select className="border p-2 rounded-lg w-full bg-white" required value={bookingData.service_id} onChange={e => setBookingData({...bookingData, service_id: e.target.value})}>
                                <option value="">Select Treatment...</option>
                                {services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.duration_minutes} min)</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <input type="datetime-local" className="border p-2 rounded-lg w-full" required value={bookingData.start_time} onChange={e => setBookingData({...bookingData, start_time: e.target.value})} />
                        </div>
                        <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">Send Request</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
};

export default PatientProfile;