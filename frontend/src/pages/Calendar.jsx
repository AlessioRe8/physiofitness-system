import { useState, useEffect, useContext } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from "../api/axios";
import AuthContext from "../context/AuthContext";
import Modal from "../components/Modal";
import { Trash2 } from "lucide-react";

const Calendar = () => {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [patients, setPatients] = useState([]);
    const [therapists, setTherapists] = useState([]);
    const [services, setServices] = useState([]);

    const [selectedEventId, setSelectedEventId] = useState(null);

    const [formData, setFormData] = useState({
        patient_id: "",
        therapist_id: "",
        service_id: "",
        start_time: "",
        end_time: "",
        notes: ""
    });

    const isPhysio = user?.role === 'PHYSIO';

    useEffect(() => {
        fetchAppointments();
        fetchPatients();
        fetchTherapists();
        fetchServices();
    }, []);


    const fetchAppointments = async () => {
        try {
            const response = await api.get("scheduling/appointments/");

            let rawData = response.data;
            if (isPhysio) {
                rawData = rawData.filter(appt => appt.therapist === user.user_id);
            }

            const formatted = rawData.map(appt => ({
                id: appt.id,
                title: `${appt.patient_name} (${appt.service_detail?.name || 'Session'})`,
                start: appt.start_time,
                end: appt.end_time,
                backgroundColor: appt.status === 'CONFIRMED' ? '#10B981' : '#F59E0B',
                extendedProps: { ...appt }
            }));
            setEvents(formatted);
        } catch (error) { console.error("Error loading schedule", error); }
    };

    const fetchPatients = async () => {
        try {
            const res = await api.get("patients/");
            setPatients(res.data);
        } catch (error) { console.error(error); }
    };

    const fetchTherapists = async () => {
        try {
            const res = await api.get("users/");
            const staff = res.data.filter(u => u.role === 'PHYSIO');
            setTherapists(staff);
        } catch (error) { console.error(error); }
    };

    const fetchServices = async () => {
        try {
            const res = await api.get("scheduling/services/");
            setServices(res.data);
        } catch (error) { console.error("Error loading services", error); }
    };

    const toLocalInputString = (date) => {
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().slice(0, 16);
    };

    const toUTCISOString = (localString) => {
        if (!localString) return null;
        const date = new Date(localString);
        return date.toISOString();
    };


    const handleDateClick = (arg) => {
        setSelectedEventId(null);

        const startObj = arg.date;
        if (arg.allDay) startObj.setHours(9, 0, 0, 0);
        const endObj = new Date(startObj.getTime() + 60 * 60 * 1000);

        setFormData({
            patient_id: "",
            therapist_id: isPhysio ? user.user_id : "",
            service_id: "",
            start_time: toLocalInputString(startObj),
            end_time: toLocalInputString(endObj),
            notes: ""
        });
        setIsModalOpen(true);
    };

    const handleEventClick = (info) => {
        const appt = info.event.extendedProps;
        setSelectedEventId(appt.id);

        const startLocal = toLocalInputString(new Date(appt.start_time));
        const endLocal = toLocalInputString(new Date(appt.end_time));

        setFormData({
            patient_id: appt.patient,
            therapist_id: appt.therapist,
            service_id: appt.service,
            start_time: startLocal,
            end_time: endLocal,
            notes: appt.notes || ""
        });
        setIsModalOpen(true);
    };

    const handleStartTimeChange = (e) => {
        const newStart = e.target.value;
        if (!newStart) {
            setFormData({ ...formData, start_time: newStart });
            return;
        }
        const startDate = new Date(newStart);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        setFormData({
            ...formData,
            start_time: newStart,
            end_time: toLocalInputString(endDate)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                patient: formData.patient_id,
                therapist: isPhysio ? user.user_id : formData.therapist_id,
                service: formData.service_id,
                start_time: toUTCISOString(formData.start_time),
                end_time: toUTCISOString(formData.end_time),
                status: "CONFIRMED",
                notes: formData.notes
            };

            if (selectedEventId) {
                await api.put(`scheduling/appointments/${selectedEventId}/`, payload);
                alert("Appointment Updated!");
            } else {
                await api.post("scheduling/appointments/", payload);
                alert("Appointment Scheduled!");
            }
            fetchAppointments();
            setIsModalOpen(false);
        } catch (error) {
            alert(`Error: ${JSON.stringify(error.response?.data || "Check fields")}`);
            console.error(error);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this appointment?")) return;
        try {
            await api.delete(`scheduling/appointments/${selectedEventId}/`);
            fetchAppointments();
            setIsModalOpen(false);
        } catch (error) { console.error(error); }
    };

    return (
        <div className="p-8 bg-white min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Clinic Schedule</h1>

            <div className="bg-white p-6 rounded-xl shadow-lg border">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    slotMinTime="08:00:00"
                    slotMaxTime="20:00:00"
                    allDaySlot={false}
                    // FIX 3: Prevent Overlapping Visuals
                    slotEventOverlap={false}
                    events={events}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    height="75vh"
                />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedEventId ? "Edit Appointment" : "Book Appointment"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* PATIENT SELECT */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Patient</label>
                        <select required className="border p-2 rounded w-full bg-white"
                            value={formData.patient_id}
                            onChange={e => setFormData({...formData, patient_id: e.target.value})}>
                            <option value="">Select Patient</option>
                            {patients
                                .filter(p => p.is_active)
                                .map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.first_name} {p.last_name} ({p.date_of_birth || "No DOB"})
                                    </option>
                            ))}
                        </select>
                    </div>

                    {/* THERAPIST SELECT (Hidden for Physios) */}
                    {!isPhysio && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Therapist</label>
                            <select required className="border p-2 rounded w-full bg-white"
                                value={formData.therapist_id}
                                onChange={e => setFormData({...formData, therapist_id: e.target.value})}>
                                <option value="">Assign Therapist</option>
                                {therapists.map(t => (
                                    <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* SERVICE SELECT */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service / Treatment</label>
                        <select required className="border p-2 rounded w-full bg-white"
                            value={formData.service_id}
                            onChange={e => setFormData({...formData, service_id: e.target.value})}>
                            <option value="">Select Treatment Type</option>
                            {services.map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.duration_minutes} min)</option>
                            ))}
                        </select>
                    </div>

                    {/* DATE INPUTS */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                            <input type="datetime-local" className="border p-2 rounded w-full" required
                                value={formData.start_time}
                                onChange={handleStartTimeChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                            <input type="datetime-local" className="border p-2 rounded w-full" required
                                value={formData.end_time}
                                onChange={e => setFormData({...formData, end_time: e.target.value})} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <textarea placeholder="Session Notes" className="border p-2 rounded w-full" rows="3"
                            value={formData.notes}
                            onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">
                            {selectedEventId ? "Update Booking" : "Confirm Booking"}
                        </button>
                        {selectedEventId && (
                            <button type="button" onClick={handleDelete} className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Calendar;