import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import api from '../api/axios';

const Calendar = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('scheduling/appointments/');

            const formattedEvents = response.data.map(appt => ({
                id: appt.id,
                title: `${appt.service_name || 'Appointment'} - ${appt.patient_name}`,
                start: appt.start_time,
                end: appt.end_time,
                backgroundColor: getStatusColor(appt.status),
                extendedProps: {
                    status: appt.status,
                    room: appt.room
                }
            }));

            setEvents(formattedEvents);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'CONFIRMED': return '#10B981'; // Green
            case 'SCHEDULED': return '#3B82F6'; // Blue
            case 'CANCELLED': return '#EF4444'; // Red
            case 'COMPLETED': return '#6B7280'; // Gray
            default: return '#3B82F6';
        }
    };

    const handleEventClick = (info) => {
        alert(`Appointment: ${info.event.title}\nStatus: ${info.event.extendedProps.status}`);
    };

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Appointment Calendar</h1>

            <div className="bg-white p-6 rounded-xl shadow-lg">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    eventClick={handleEventClick}
                    height="auto"
                    slotMinTime="08:00:00"
                    slotMaxTime="20:00:00"
                    allDaySlot={false}

                    slotLabelFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }}

                    eventTimeFormat={{
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }}
                />
            </div>
        </div>
    );
};

export default Calendar;