import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

function VaccinationScheduler() {
    const { currentUser } = useAuth();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const [notificationTargets, setNotificationTargets] = useState([]);

    // Form state for new schedule
    const [newSchedule, setNewSchedule] = useState({
        title: "",
        vaccineType: "",
        targetGroups: [],
        startDate: "",
        endDate: "",
        description: "",
        location: "",
        maxStudentsPerSlot: 30,
        timeSlots: [
            { startTime: "08:00", endTime: "10:00", assigned: "", capacity: 30 },
            { startTime: "10:30", endTime: "12:30", assigned: "", capacity: 30 },
            { startTime: "13:30", endTime: "15:30", assigned: "", capacity: 30 }
        ],
        notifyNurses: true,
        notifyParents: true,
        notifyStudents: false,
        reminderDays: 7
    });

    // Sample existing schedules
    const sampleSchedules = [
        {
            id: 1,
            title: "Cúm mùa 2025",
            vaccineType: "Influenza",
            targetGroups: ["Lớp 1", "Lớp 2", "Lớp 3"],
            startDate: "2025-06-01",
            endDate: "2025-06-03",
            description: "Tiêm chủng cúm mùa cho học sinh tiểu học",
            location: "Hội trường trường",
            status: "upcoming",
            createdBy: currentUser?.name || "Admin",
            createdAt: "2025-05-25",
            notificationsSent: true,
            reminderDays: 7,
            timeSlots: [
                { startTime: "08:00", endTime: "10:00", assigned: "Y tá Sarah", capacity: 30, registered: 25 },
                { startTime: "10:30", endTime: "12:30", assigned: "Y tá Michael", capacity: 30, registered: 28 },
                { startTime: "13:30", endTime: "15:30", assigned: "Y tá Linda", capacity: 30, registered: 22 }
            ]
        },
        {
            id: 2,
            title: "Viêm gan B - Liều nhắc lại",
            vaccineType: "Hepatitis B",
            targetGroups: ["Lớp 6", "Lớp 7"],
            startDate: "2025-06-15",
            endDate: "2025-06-16",
            description: "Liều nhắc lại vaccine viêm gan B cho học sinh THCS",
            location: "Phòng y tế",
            status: "planning",
            createdBy: "BS. Emily Wilson",
            createdAt: "2025-05-24",
            notificationsSent: false,
            reminderDays: 14,
            timeSlots: [{ startTime: "09:00", endTime: "11:00", assigned: "BS. Wilson", capacity: 25, registered: 0 },
            { startTime: "14:00", endTime: "16:00", assigned: "Y tá David", capacity: 25, registered: 0 }
            ]
        }
    ];

    // Available target groups
    const targetGroupOptions = [
        "Mầm non", "Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5",
        "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12"
    ];

    // Vaccine types
    const vaccineTypes = [
        "Influenza (Cúm mùa)",
        "COVID-19",
        "Hepatitis B (Viêm gan B)",
        "MMR (Sởi, Quai bị, Rubella)",
        "Tdap (Uốn ván, Bạch hầu, Ho gà)",
        "HPV (Ung thư cổ tử cung)",
        "Varicella (Thủy đậu)",
        "Khác"
    ]; useEffect(() => {
        setSchedules(sampleSchedules);
    }, [sampleSchedules]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setNewSchedule(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setNewSchedule(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle target group selection
    const handleTargetGroupChange = (group) => {
        setNewSchedule(prev => ({
            ...prev,
            targetGroups: prev.targetGroups.includes(group)
                ? prev.targetGroups.filter(g => g !== group)
                : [...prev.targetGroups, group]
        }));
    };

    // Handle time slot changes
    const handleTimeSlotChange = (index, field, value) => {
        setNewSchedule(prev => ({
            ...prev,
            timeSlots: prev.timeSlots.map((slot, i) =>
                i === index ? { ...slot, [field]: value } : slot
            )
        }));
    };

    // Add new time slot
    const addTimeSlot = () => {
        setNewSchedule(prev => ({
            ...prev,
            timeSlots: [...prev.timeSlots, {
                startTime: "16:00",
                endTime: "18:00",
                assigned: "",
                capacity: 30
            }]
        }));
    };

    // Remove time slot
    const removeTimeSlot = (index) => {
        if (newSchedule.timeSlots.length > 1) {
            setNewSchedule(prev => ({
                ...prev,
                timeSlots: prev.timeSlots.filter((_, i) => i !== index)
            }));
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newSchedule.title || !newSchedule.vaccineType || newSchedule.targetGroups.length === 0) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
            return;
        }

        const newScheduleObj = {
            id: Date.now(),
            ...newSchedule,
            status: "planning",
            createdBy: currentUser?.name || "Admin",
            createdAt: new Date().toISOString().split('T')[0],
            notificationsSent: false,
            timeSlots: newSchedule.timeSlots.map(slot => ({
                ...slot,
                registered: 0
            }))
        };

        setSchedules(prev => [...prev, newScheduleObj]);
        setShowCreateModal(false);

        // Reset form
        setNewSchedule({
            title: "",
            vaccineType: "",
            targetGroups: [],
            startDate: "",
            endDate: "",
            description: "",
            location: "",
            maxStudentsPerSlot: 30,
            timeSlots: [
                { startTime: "08:00", endTime: "10:00", assigned: "", capacity: 30 },
                { startTime: "10:30", endTime: "12:30", assigned: "", capacity: 30 },
                { startTime: "13:30", endTime: "15:30", assigned: "", capacity: 30 }
            ],
            notifyNurses: true,
            notifyParents: true,
            notifyStudents: false,
            reminderDays: 7
        });

        alert("Lịch tiêm chủng đã được tạo thành công!");
    };

    // Send notifications
    const handleSendNotifications = (schedule) => {
        setSelectedSchedule(schedule);

        // Determine notification targets
        const targets = [];
        if (schedule.notifyNurses || newSchedule.notifyNurses) {
            targets.push("Y tá");
        }
        if (schedule.notifyParents || newSchedule.notifyParents) {
            targets.push("Phụ huynh");
        }
        if (schedule.notifyStudents || newSchedule.notifyStudents) {
            targets.push("Học sinh");
        }

        setNotificationTargets(targets);
        setShowNotificationModal(true);
    };

    // Confirm send notifications
    const confirmSendNotifications = () => {
        // Update schedule to mark notifications as sent
        setSchedules(prev => prev.map(schedule =>
            schedule.id === selectedSchedule.id
                ? { ...schedule, notificationsSent: true }
                : schedule
        ));

        setShowNotificationModal(false);
        alert(`Đã gửi thông báo đến ${notificationTargets.join(", ")} thành công!`);
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'planning':
                return 'bg-blue-100 text-blue-800';
            case 'upcoming':
                return 'bg-yellow-100 text-yellow-800';
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Quản lý lịch tiêm chủng</h1>
                    <p className="text-gray-600">Tạo và quản lý lịch tiêm chủng cho học sinh</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Tạo lịch mới</span>
                </button>
            </div>

            {/* Schedules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {schedules.map((schedule) => (
                    <div key={schedule.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{schedule.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                                    {schedule.status === 'planning' ? 'Đang lên kế hoạch' :
                                        schedule.status === 'upcoming' ? 'Sắp diễn ra' :
                                            schedule.status === 'active' ? 'Đang thực hiện' : 'Hoàn thành'}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium text-gray-500">Vaccine:</span>
                                    <span className="ml-2 text-gray-900">{schedule.vaccineType}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-500">Đối tượng:</span>
                                    <span className="ml-2 text-gray-900">{schedule.targetGroups.join(", ")}</span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-500">Thời gian:</span>
                                    <span className="ml-2 text-gray-900">
                                        {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
                                    </span>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-500">Địa điểm:</span>
                                    <span className="ml-2 text-gray-900">{schedule.location}</span>
                                </div>
                            </div>

                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-500">Đăng ký:</span>
                                    <span className="text-sm text-gray-900">
                                        {schedule.timeSlots.reduce((sum, slot) => sum + slot.registered, 0)} / {schedule.timeSlots.reduce((sum, slot) => sum + slot.capacity, 0)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{
                                            width: `${(schedule.timeSlots.reduce((sum, slot) => sum + slot.registered, 0) / schedule.timeSlots.reduce((sum, slot) => sum + slot.capacity, 0)) * 100}%`
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                                Bởi {schedule.createdBy}
                            </span>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleSendNotifications(schedule)}
                                    disabled={schedule.notificationsSent}
                                    className={`px-3 py-1 rounded text-sm font-medium ${schedule.notificationsSent
                                        ? 'bg-green-100 text-green-600 cursor-not-allowed'
                                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                        }`}
                                >
                                    {schedule.notificationsSent ? '✓ Đã thông báo' : 'Gửi thông báo'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Schedule Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Tạo lịch tiêm chủng mới</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Thông tin cơ bản</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên chương trình <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={newSchedule.title}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ví dụ: Tiêm chủng cúm mùa 2025"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Loại vaccine <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="vaccineType"
                                            value={newSchedule.vaccineType}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value="">Chọn loại vaccine</option>
                                            {vaccineTypes.map(type => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mô tả
                                        </label>
                                        <textarea
                                            name="description"
                                            value={newSchedule.description}
                                            onChange={handleInputChange}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Mô tả chi tiết về chương trình tiêm chủng"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Địa điểm
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={newSchedule.location}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ví dụ: Hội trường trường, Phòng y tế"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ngày bắt đầu <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                value={newSchedule.startDate}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Ngày kết thúc <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="endDate"
                                                value={newSchedule.endDate}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Target Groups and Schedule */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Đối tượng và lịch trình</h3>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Đối tượng tiêm chủng <span className="text-red-500">*</span>
                                        </label>
                                        <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                                            {targetGroupOptions.map(group => (
                                                <label key={group} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={newSchedule.targetGroups.includes(group)}
                                                        onChange={() => handleTargetGroupChange(group)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <span className="text-sm">{group}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Khung giờ tiêm chủng
                                            </label>
                                            <button
                                                type="button"
                                                onClick={addTimeSlot}
                                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                <span>Thêm khung giờ</span>
                                            </button>
                                        </div>

                                        <div className="space-y-3 max-h-40 overflow-y-auto">
                                            {newSchedule.timeSlots.map((slot, index) => (
                                                <div key={index} className="grid grid-cols-5 gap-2 items-center bg-gray-50 p-2 rounded">
                                                    <input
                                                        type="time"
                                                        value={slot.startTime}
                                                        onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                    />
                                                    <input
                                                        type="time"
                                                        value={slot.endTime}
                                                        onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={slot.assigned}
                                                        onChange={(e) => handleTimeSlotChange(index, 'assigned', e.target.value)}
                                                        placeholder="Y tá phụ trách"
                                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                    />
                                                    <input
                                                        type="number"
                                                        value={slot.capacity}
                                                        onChange={(e) => handleTimeSlotChange(index, 'capacity', parseInt(e.target.value))}
                                                        min="1"
                                                        max="100"
                                                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTimeSlot(index)}
                                                        disabled={newSchedule.timeSlots.length === 1}
                                                        className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            Thứ tự: Giờ bắt đầu - Giờ kết thúc - Y tá phụ trách - Sức chứa - Xóa
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notification Settings */}
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Cài đặt thông báo</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="notifyNurses"
                                                name="notifyNurses"
                                                checked={newSchedule.notifyNurses}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="notifyNurses" className="text-sm font-medium text-gray-700">
                                                Thông báo đến Y tá
                                            </label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="notifyParents"
                                                name="notifyParents"
                                                checked={newSchedule.notifyParents}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="notifyParents" className="text-sm font-medium text-gray-700">
                                                Thông báo đến Phụ huynh
                                            </label>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id="notifyStudents"
                                                name="notifyStudents"
                                                checked={newSchedule.notifyStudents}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="notifyStudents" className="text-sm font-medium text-gray-700">
                                                Thông báo đến Học sinh
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gửi nhắc nhở trước (ngày)
                                        </label>
                                        <select
                                            name="reminderDays"
                                            value={newSchedule.reminderDays}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value={1}>1 ngày</option>
                                            <option value={3}>3 ngày</option>
                                            <option value={7}>7 ngày</option>
                                            <option value={14}>14 ngày</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end space-x-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Tạo lịch tiêm chủng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Notification Confirmation Modal */}
            {showNotificationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">Xác nhận gửi thông báo</h3>
                                <p className="text-sm text-gray-500">
                                    Bạn có chắc chắn muốn gửi thông báo về lịch tiêm chủng "{selectedSchedule?.title}"?
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-700 mb-2">Thông báo sẽ được gửi đến:</p>
                            <ul className="list-disc list-inside space-y-1">
                                {notificationTargets.map(target => (
                                    <li key={target} className="text-sm text-blue-600">
                                        {target}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowNotificationModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmSendNotifications}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Gửi thông báo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Section */}
            <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Lưu ý quan trọng</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                            <ul className="list-disc list-inside space-y-1">
                                <li>Thông báo sẽ được gửi qua email và hệ thống thông báo trong ứng dụng</li>
                                <li>Phụ huynh cần xác nhận đồng ý trước khi tiêm chủng cho con em</li>
                                <li>Y tá sẽ nhận được chi tiết lịch trình và danh sách học sinh</li>
                                <li>Hệ thống sẽ tự động gửi nhắc nhở theo thời gian đã cài đặt</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VaccinationScheduler;
