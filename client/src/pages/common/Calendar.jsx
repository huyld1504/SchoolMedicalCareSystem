import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

function Calendar() {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('month'); // 'month', 'week', or 'day'
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        type: 'appointment',
        start: '',
        end: '',
        allDay: false,
        participants: []
    });

    // Sample events data based on user role
    const generateSampleEvents = (role) => {
        const baseEvents = [
            {
                id: 1,
                title: "Staff Meeting",
                description: "Monthly medical staff meeting",
                type: "meeting",
                start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15, 10, 0),
                end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15, 11, 30),
                allDay: false,
                participants: ["All Medical Staff"]
            },
            {
                id: 2,
                title: "Flu Vaccination Campaign",
                description: "Annual flu vaccination for all students",
                type: "vaccination",
                start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 9, 0),
                end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 15, 0),
                allDay: true,
                participants: ["All Students", "Medical Staff"]
            },
            {
                id: 3,
                title: "Health & Safety Committee",
                description: "Quarterly review of health and safety procedures",
                type: "meeting",
                start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25, 14, 0),
                end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25, 15, 30),
                allDay: false,
                participants: ["Committee Members"]
            }
        ];

        // Role-specific events
        if (role === 'nurse') {
            return [
                ...baseEvents,
                {
                    id: 4,
                    title: "Student Health Screenings",
                    description: "Annual health screenings for 3rd grade",
                    type: "screening",
                    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10, 9, 0),
                    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10, 14, 0),
                    allDay: true,
                    participants: ["3rd Grade Students", "Nursing Staff"]
                },
                {
                    id: 5,
                    title: "Medication Administration",
                    description: "Daily scheduled medications",
                    type: "medication",
                    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 12, 0),
                    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 13, 0),
                    allDay: false,
                    participants: ["Students with Prescriptions"]
                }
            ];
        } else if (role === 'parent') {
            return [
                {
                    id: 6,
                    title: "Annual Physical Exam",
                    description: "Yearly physical examination for your child",
                    type: "appointment",
                    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18, 10, 0),
                    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18, 11, 0),
                    allDay: false,
                    participants: ["Your child"]
                },
                {
                    id: 7,
                    title: "Flu Vaccination",
                    description: "Annual flu vaccination day",
                    type: "vaccination",
                    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 9, 0),
                    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 15, 0),
                    allDay: true,
                    participants: ["All Students"]
                }
            ];
        } else if (role === 'student') {
            return [
                {
                    id: 8,
                    title: "Health Check",
                    description: "Regular health assessment",
                    type: "appointment",
                    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12, 11, 30),
                    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12, 12, 0),
                    allDay: false,
                    participants: ["You"]
                },
                {
                    id: 9,
                    title: "Flu Vaccination",
                    description: "Annual flu vaccination day",
                    type: "vaccination",
                    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 9, 0),
                    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20, 15, 0),
                    allDay: true,
                    participants: ["All Students"]
                }
            ];
        } else if (role === 'manager' || role === 'admin') {
            return [
                ...baseEvents,
                {
                    id: 10,
                    title: "Budget Review",
                    description: "Medical department budget review",
                    type: "meeting",
                    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5, 14, 0),
                    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5, 16, 0),
                    allDay: false,
                    participants: ["Management Team"]
                },
                {
                    id: 11,
                    title: "Staff Performance Reviews",
                    description: "Quarterly performance evaluations",
                    type: "meeting",
                    start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 28, 9, 0),
                    end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 28, 17, 0),
                    allDay: true,
                    participants: ["Management", "Medical Staff"]
                }
            ];
        }

        // Default events
        return baseEvents;
    };

    // Load events data
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);

                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 800));

                // Get role-based sample events
                const roleBasedEvents = generateSampleEvents(currentUser?.role || 'student');
                setEvents(roleBasedEvents);

            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [currentUser]);

    // Calendar helper functions
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year, month) => {
        return new Date(year, month, 1).getDay();
    };

    // Navigate to previous month/week/day
    const handlePrevious = () => {
        if (view === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        } else if (view === 'week') {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 7);
            setCurrentDate(newDate);
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 1);
            setCurrentDate(newDate);
        }
    };

    // Navigate to next month/week/day
    const handleNext = () => {
        if (view === 'month') {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        } else if (view === 'week') {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 7);
            setCurrentDate(newDate);
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 1);
            setCurrentDate(newDate);
        }
    };

    // Handle date click
    const handleDateClick = (date) => {
        setSelectedDate(date);
        setShowModal(true);
        setSelectedEvent(null);

        // Initialize new event with the selected date
        const startDate = new Date(date);
        startDate.setHours(9, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(10, 0, 0);

        setNewEvent({
            title: '',
            description: '',
            type: 'appointment',
            start: startDate.toISOString().slice(0, 16),
            end: endDate.toISOString().slice(0, 16),
            allDay: false,
            participants: []
        });
    };

    // Handle event click
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setSelectedDate(new Date(event.start));
        setShowModal(true);

        // Initialize edit form with event data
        setNewEvent({
            title: event.title,
            description: event.description,
            type: event.type,
            start: new Date(event.start).toISOString().slice(0, 16),
            end: new Date(event.end).toISOString().slice(0, 16),
            allDay: event.allDay,
            participants: [...event.participants]
        });
    };

    // Handle creating or updating an event
    const handleSaveEvent = () => {
        if (!newEvent.title.trim()) {
            alert("Event title is required");
            return;
        }

        const eventToSave = {
            id: selectedEvent ? selectedEvent.id : Date.now(),
            title: newEvent.title,
            description: newEvent.description,
            type: newEvent.type,
            start: new Date(newEvent.start),
            end: new Date(newEvent.end),
            allDay: newEvent.allDay,
            participants: newEvent.participants
        };

        if (selectedEvent) {
            // Update existing event
            setEvents(events.map(event =>
                event.id === selectedEvent.id ? eventToSave : event
            ));
        } else {
            // Add new event
            setEvents([...events, eventToSave]);
        }

        // Close modal and reset form
        setShowModal(false);
        setSelectedEvent(null);
        setSelectedDate(null);
    };

    // Handle deleting an event
    const handleDeleteEvent = () => {
        if (selectedEvent) {
            setEvents(events.filter(event => event.id !== selectedEvent.id));
            setShowModal(false);
            setSelectedEvent(null);
            setSelectedDate(null);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewEvent({
            ...newEvent,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Add or remove participant
    const handleParticipantChange = (e) => {
        const participant = e.target.value.trim();
        if (participant && !newEvent.participants.includes(participant)) {
            setNewEvent({
                ...newEvent,
                participants: [...newEvent.participants, participant]
            });
            e.target.value = '';
        }
    };

    const removeParticipant = (participant) => {
        setNewEvent({
            ...newEvent,
            participants: newEvent.participants.filter(p => p !== participant)
        });
    };

    // Build the calendar for month view
    const buildMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = getFirstDayOfMonth(year, month);

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }

        // Create weeks array
        const weeks = [];
        let week = [];

        days.forEach((day, index) => {
            week.push(day);
            if ((index + 1) % 7 === 0 || index === days.length - 1) {
                // Fill the last week with null values if needed
                while (week.length < 7) {
                    week.push(null);
                }
                weeks.push(week);
                week = [];
            }
        });

        return weeks;
    };

    // Build week view
    const buildWeekView = () => {
        const startDate = new Date(currentDate);
        // Adjust to start from Sunday
        const day = startDate.getDay();
        startDate.setDate(startDate.getDate() - day);

        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            days.push(date);
        }

        return days;
    };

    // Get events for a specific date
    const getEventsForDate = (date) => {
        if (!date) return [];

        return events.filter(event => {
            const eventDate = new Date(event.start);
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            );
        });
    };

    // Get event color based on type
    const getEventColor = (type) => {
        switch (type) {
            case 'meeting':
                return 'bg-blue-200 text-blue-800 border-blue-300';
            case 'appointment':
                return 'bg-green-200 text-green-800 border-green-300';
            case 'vaccination':
                return 'bg-purple-200 text-purple-800 border-purple-300';
            case 'screening':
                return 'bg-yellow-200 text-yellow-800 border-yellow-300';
            case 'medication':
                return 'bg-red-200 text-red-800 border-red-300';
            default:
                return 'bg-gray-200 text-gray-800 border-gray-300';
        }
    };

    // Format dates for display
    const formatDate = (date) => {
        if (!date) return '';

        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Is date today?
    const isToday = (date) => {
        if (!date) return false;

        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    // Get time slots for day view
    const getTimeSlots = () => {
        const slots = [];
        for (let hour = 8; hour < 18; hour++) {
            slots.push(`${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`);
        }
        return slots;
    };

    // Render events for a specific time slot in day view
    const getEventsForTimeSlot = (date, timeSlot) => {
        if (!date) return [];

        const hour = parseInt(timeSlot.split(':')[0]);
        const isPM = timeSlot.includes('PM');
        const slotHour = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour);

        return events.filter(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);

            if (
                eventStart.getDate() !== date.getDate() ||
                eventStart.getMonth() !== date.getMonth() ||
                eventStart.getFullYear() !== date.getFullYear()
            ) {
                return false;
            }

            const eventStartHour = eventStart.getHours();
            const eventEndHour = eventEnd.getHours();

            return slotHour >= eventStartHour && slotHour < eventEndHour;
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Medical Calendar</h1>
                    <p className="text-gray-600">View and manage medical events and appointments</p>
                </div>

                <div className="flex gap-2">
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        onClick={() => handleDateClick(new Date())}
                    >
                        Add Event
                    </button>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center">
                        <button
                            className="p-2 hover:bg-gray-100 rounded-full"
                            onClick={handlePrevious}
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                            </svg>
                        </button>

                        <h2 className="text-xl font-semibold mx-4">
                            {view === 'month'
                                ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                : view === 'week'
                                    ? `Week of ${formatDate(buildWeekView()[0])}`
                                    : formatDate(currentDate)
                            }
                        </h2>

                        <button
                            className="p-2 hover:bg-gray-100 rounded-full"
                            onClick={handleNext}
                        >
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>

                        <button
                            className="ml-4 px-3 py-1 border rounded text-sm"
                            onClick={() => setCurrentDate(new Date())}
                        >
                            Today
                        </button>
                    </div>

                    <div className="flex border rounded overflow-hidden">
                        <button
                            className={`px-4 py-2 text-sm ${view === 'month' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            onClick={() => setView('month')}
                        >
                            Month
                        </button>
                        <button
                            className={`px-4 py-2 text-sm border-l ${view === 'week' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            onClick={() => setView('week')}
                        >
                            Week
                        </button>
                        <button
                            className={`px-4 py-2 text-sm border-l ${view === 'day' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            onClick={() => setView('day')}
                        >
                            Day
                        </button>
                    </div>
                </div>
            </div>

            {/* Loading Indicator */}
            {loading && (
                <div className="bg-white rounded-lg shadow p-12 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Calendar Views */}
            {!loading && (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {/* Month View */}
                    {view === 'month' && (
                        <div className="min-h-[600px]">
                            {/* Days of Week */}
                            <div className="grid grid-cols-7 border-b">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                    <div key={index} className="p-2 text-center text-sm font-medium text-gray-500">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Calendar Dates */}
                            <div className="flex-1">
                                {buildMonthView().map((week, weekIndex) => (
                                    <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
                                        {week.map((day, dayIndex) => (
                                            <div
                                                key={dayIndex}
                                                className={`min-h-[100px] p-2 border-r last:border-r-0 ${day ? (
                                                        isToday(day)
                                                            ? 'bg-blue-50'
                                                            : day.getMonth() !== currentDate.getMonth()
                                                                ? 'bg-gray-50 text-gray-400'
                                                                : ''
                                                    ) : 'bg-gray-50'
                                                    }`}
                                                onClick={() => day && handleDateClick(day)}
                                            >
                                                {day && (
                                                    <>
                                                        <div className={`text-sm mb-1 font-semibold ${isToday(day) ? 'text-blue-600' : ''
                                                            }`}>
                                                            {day.getDate()}
                                                        </div>

                                                        <div className="space-y-1">
                                                            {getEventsForDate(day).slice(0, 3).map((event, index) => (
                                                                <div
                                                                    key={index}
                                                                    className={`px-2 py-1 text-xs rounded cursor-pointer border ${getEventColor(event.type)}`}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEventClick(event);
                                                                    }}
                                                                >
                                                                    {event.title}
                                                                </div>
                                                            ))}

                                                            {getEventsForDate(day).length > 3 && (
                                                                <div className="text-xs text-gray-500 pl-2">
                                                                    +{getEventsForDate(day).length - 3} more
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Week View */}
                    {view === 'week' && (
                        <div className="min-h-[600px]">
                            {/* Days Headers */}
                            <div className="grid grid-cols-7 border-b">
                                {buildWeekView().map((day, index) => (
                                    <div key={index} className={`p-3 text-center ${isToday(day) ? 'bg-blue-50' : ''}`}>
                                        <div className="text-sm font-medium text-gray-500">
                                            {day.toLocaleDateString('en-US', { weekday: 'short' })}
                                        </div>
                                        <div className={`text-lg font-semibold ${isToday(day) ? 'text-blue-600' : ''}`}>
                                            {day.getDate()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Time Slots */}
                            <div className="overflow-y-auto" style={{ height: '600px' }}>
                                {getTimeSlots().map((timeSlot, index) => (
                                    <div key={index} className="grid grid-cols-7 border-b">
                                        <div className="col-span-1 p-2 text-right text-xs text-gray-500 border-r">
                                            {timeSlot}
                                        </div>

                                        {buildWeekView().map((day, dayIndex) => {
                                            const eventsForSlot = getEventsForTimeSlot(day, timeSlot);
                                            return (
                                                <div
                                                    key={dayIndex}
                                                    className={`p-1 border-r ${isToday(day) ? 'bg-blue-50' : ''}`}
                                                    onClick={() => handleDateClick(day)}
                                                >
                                                    {eventsForSlot.map((event, eventIndex) => (
                                                        <div
                                                            key={eventIndex}
                                                            className={`px-2 py-1 text-xs mb-1 rounded cursor-pointer border ${getEventColor(event.type)}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEventClick(event);
                                                            }}
                                                        >
                                                            {event.title}
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Day View */}
                    {view === 'day' && (
                        <div className="min-h-[600px]">
                            {/* Day Header */}
                            <div className={`p-4 text-center border-b ${isToday(currentDate) ? 'bg-blue-50' : ''}`}>
                                <div className="text-sm font-medium text-gray-500">
                                    {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
                                </div>
                                <div className={`text-xl font-semibold ${isToday(currentDate) ? 'text-blue-600' : ''}`}>
                                    {currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div className="overflow-y-auto" style={{ height: '600px' }}>
                                {getTimeSlots().map((timeSlot, index) => {
                                    const eventsForSlot = getEventsForTimeSlot(currentDate, timeSlot);
                                    return (
                                        <div key={index} className="flex border-b">
                                            <div className="w-20 p-2 text-right text-xs text-gray-500 border-r">
                                                {timeSlot}
                                            </div>

                                            <div
                                                className="flex-1 p-2 min-h-[60px]"
                                                onClick={() => handleDateClick(currentDate)}
                                            >
                                                {eventsForSlot.map((event, eventIndex) => (
                                                    <div
                                                        key={eventIndex}
                                                        className={`px-3 py-2 mb-2 rounded cursor-pointer border ${getEventColor(event.type)}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEventClick(event);
                                                        }}
                                                    >
                                                        <div className="font-medium">{event.title}</div>
                                                        <div className="text-xs">
                                                            {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                            {new Date(event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Event Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-semibold">
                                {selectedEvent ? 'Edit Event' : 'Add New Event'}
                            </h3>
                        </div>

                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Event Title<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newEvent.title}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={newEvent.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Event Type
                                    </label>
                                    <select
                                        name="type"
                                        value={newEvent.type}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="appointment">Appointment</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="vaccination">Vaccination</option>
                                        <option value="screening">Health Screening</option>
                                        <option value="medication">Medication</option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="allDay"
                                        name="allDay"
                                        checked={newEvent.allDay}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="allDay" className="ml-2 block text-sm text-gray-900">
                                        All Day Event
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Start Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="start"
                                            value={newEvent.start}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            End Date & Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            name="end"
                                            value={newEvent.end}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Participants
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            placeholder="Add participant and press Enter"
                                            className="flex-1 px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleParticipantChange(e);
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            onClick={(e) => handleParticipantChange({ target: { value: e.target.previousSibling.value } })}
                                        >
                                            Add
                                        </button>
                                    </div>

                                    {newEvent.participants.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {newEvent.participants.map((participant, index) => (
                                                <div key={index} className="px-2 py-1 bg-gray-100 rounded-full flex items-center">
                                                    <span className="text-sm">{participant}</span>
                                                    <button
                                                        type="button"
                                                        className="ml-1 text-gray-500 hover:text-gray-700"
                                                        onClick={() => removeParticipant(participant)}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 flex justify-between">
                            <div>
                                {selectedEvent && (
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                        onClick={handleDeleteEvent}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSelectedEvent(null);
                                        setSelectedDate(null);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    onClick={handleSaveEvent}
                                >
                                    {selectedEvent ? 'Update Event' : 'Add Event'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Legend */}
            <div className="mt-6 bg-white rounded-lg shadow p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Event Types</h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 rounded bg-blue-200 border border-blue-300"></div>
                        <span className="text-sm text-gray-700">Meeting</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 rounded bg-green-200 border border-green-300"></div>
                        <span className="text-sm text-gray-700">Appointment</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 rounded bg-purple-200 border border-purple-300"></div>
                        <span className="text-sm text-gray-700">Vaccination</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 rounded bg-yellow-200 border border-yellow-300"></div>
                        <span className="text-sm text-gray-700">Health Screening</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 rounded bg-red-200 border border-red-300"></div>
                        <span className="text-sm text-gray-700">Medication</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calendar;
