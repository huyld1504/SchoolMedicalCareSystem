import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { 
    FaSyringe, 
    FaPlus, 
    FaCalendarAlt, 
    FaClock, 
    FaUsers, 
    FaBell, 
    FaEdit, 
    FaTrash, 
    FaEye,
    FaCheckCircle,
    FaTimesCircle,
    FaHourglassHalf,
    FaMapMarkerAlt,
    FaUserMd,
    FaClipboardList,
    FaExclamationTriangle
} from 'react-icons/fa';

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
    });    // Sample existing schedules phù hợp với trường tiểu học
    const sampleSchedules = [
        {
            id: 1,
            title: "Tiêm chủng Sởi - Rubella",
            vaccineType: "Sởi - Rubella (MR)",
            targetGroups: ["Lớp 1", "Lớp 2"],
            startDate: "2025-06-01",
            endDate: "2025-06-03",
            description: "Tiêm chủng Sởi - Rubella cho học sinh lớp 1-2",
            location: "Phòng y tế trường",
            status: "upcoming",
            createdBy: currentUser?.name || "Quản trị viên",
            createdAt: "2025-05-25",
            notificationsSent: true,
            reminderDays: 7,
            timeSlots: [
                { startTime: "08:00", endTime: "10:00", assigned: "Cô Nguyễn Thị Lan", capacity: 20, registered: 18 },
                { startTime: "10:30", endTime: "12:30", assigned: "Cô Trần Thị Minh", capacity: 20, registered: 20 },
                { startTime: "13:30", endTime: "15:30", assigned: "BS. Lê Thị Hương", capacity: 20, registered: 15 }
            ]
        },
        {
            id: 2,
            title: "Tiêm chủng Bạch hầu - Ho gà - Uốn ván",
            vaccineType: "DPT",
            targetGroups: ["Lớp 3", "Lớp 4"],
            startDate: "2025-06-15",
            endDate: "2025-06-16",
            description: "Tiêm nhắc lại DPT cho học sinh lớp 3-4",
            location: "Hội trường trường",
            status: "planning",
            createdBy: currentUser?.name || "Quản trị viên",
            createdAt: "2025-05-20",
            notificationsSent: false,
            reminderDays: 10,
            timeSlots: [
                { startTime: "08:00", endTime: "10:00", assigned: "", capacity: 25, registered: 0 },
                { startTime: "10:30", endTime: "12:30", assigned: "", capacity: 25, registered: 0 }
            ]
        },
        {
            id: 3,
            title: "Tiêm chủng Viêm gan B",
            vaccineType: "Viêm gan B",
            targetGroups: ["Lớp 5"],
            startDate: "2025-05-15",
            endDate: "2025-05-17",
            description: "Tiêm chủng Viêm gan B cho học sinh lớp 5",
            location: "Phòng y tế trường",
            status: "completed",
            createdBy: "BS. Nguyễn Cường",
            createdAt: "2025-05-01",
            notificationsSent: true,
            reminderDays: 14,
            timeSlots: [
                { startTime: "08:00", endTime: "10:00", assigned: "Y tá Phạm Mai", capacity: 30, registered: 30 },
                { startTime: "10:30", endTime: "12:30", assigned: "Y tá Hoàng An", capacity: 30, registered: 30 },
                { startTime: "13:30", endTime: "15:30", assigned: "Y tá Vũ Linh", capacity: 30, registered: 28 }
            ]
        }
    ];

    useEffect(() => {
        setSchedules(sampleSchedules);
    }, []);

    const styles = {
        container: {
            padding: '24px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh'
        },
        header: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '32px',
            borderRadius: '16px',
            marginBottom: '24px',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
        },
        title: {
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '8px',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        subtitle: {
            fontSize: '16px',
            opacity: 0.9
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
        },
        statCard: {
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
            textAlign: 'center',
            transition: 'transform 0.2s, box-shadow 0.2s'
        },
        statIcon: {
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: 'white',
            fontSize: '20px'
        },
        statNumber: {
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '4px'
        },
        statLabel: {
            fontSize: '14px',
            color: '#6b7280'
        },
        card: {
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid rgba(255,255,255,0.8)'
        },
        controlsContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px'
        },
        buttonPrimary: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
        },
        scheduleGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
            gap: '20px'
        },
        scheduleCard: {
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid #e5e7eb',
            transition: 'transform 0.2s, box-shadow 0.2s'
        },
        scheduleHeader: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '16px'
        },
        scheduleTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '8px'
        },
        scheduleVaccine: {
            fontSize: '14px',
            color: '#6b7280',
            fontWeight: '600'
        },
        statusBadge: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
        },
        statusUpcoming: {
            background: '#dbeafe',
            color: '#1e40af'
        },
        statusPlanning: {
            background: '#fef3c7',
            color: '#92400e'
        },
        statusCompleted: {
            background: '#dcfce7',
            color: '#166534'
        },
        scheduleInfo: {
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            marginBottom: '16px',
            fontSize: '14px'
        },
        infoItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6b7280'
        },
        infoIcon: {
            color: '#9ca3af',
            fontSize: '12px'
        },
        targetGroups: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px',
            marginBottom: '16px'
        },
        groupBadge: {
            background: '#f3f4f6',
            color: '#374151',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500'
        },
        timeSlotsContainer: {
            marginBottom: '16px'
        },
        timeSlotsTitle: {
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
        },
        timeSlot: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '8px 12px',
            background: '#f8fafc',
            borderRadius: '6px',
            marginBottom: '4px',
            fontSize: '12px'
        },
        timeSlotTime: {
            fontWeight: '600',
            color: '#374151'
        },
        timeSlotAssigned: {
            color: '#6b7280'
        },
        timeSlotCapacity: {
            color: '#059669',
            fontWeight: '600'
        },
        actionsContainer: {
            display: 'flex',
            gap: '8px',
            justifyContent: 'flex-end'
        },
        actionButton: {
            padding: '8px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s, color 0.2s'
        },
        viewButton: {
            background: '#dbeafe',
            color: '#2563eb'
        },
        editButton: {
            background: '#fef3c7',
            color: '#d97706'
        },
        deleteButton: {
            background: '#fee2e2',
            color: '#dc2626'
        },
        notifyButton: {
            background: '#dcfce7',
            color: '#059669'
        },
        modal: {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        },
        modalContent: {
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        },
        modalTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '24px',
            textAlign: 'center'
        },
        formGroup: {
            marginBottom: '20px'
        },
        label: {
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            transition: 'border-color 0.2s',
            outline: 'none'
        },
        select: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none'
        },
        textarea: {
            width: '100%',
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            resize: 'vertical',
            minHeight: '80px',
            outline: 'none'
        },
        checkboxGroup: {
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px'
        },
        checkboxItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            background: '#f8fafc',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
        },
        checkboxItemSelected: {
            background: '#dbeafe',
            color: '#2563eb'
        },
        timeSlotsEditor: {
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px'
        },
        timeSlotEditor: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr',
            gap: '12px',
            alignItems: 'center',
            marginBottom: '12px',
            padding: '12px',
            background: '#f8fafc',
            borderRadius: '6px'
        },
        modalActions: {
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '24px',
            paddingTop: '24px',
            borderTop: '1px solid #e5e7eb'
        },
        buttonCancel: {
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer'
        },
        emptyState: {
            textAlign: 'center',
            padding: '48px 24px',
            color: '#6b7280'
        },
        emptyIcon: {
            fontSize: '48px',
            marginBottom: '16px',
            color: '#d1d5db'
        },
        emptyTitle: {
            fontSize: '18px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'upcoming':
                return 'Sắp tới';
            case 'planning':
                return 'Đang lên kế hoạch';
            case 'completed':
                return 'Đã hoàn thành';
            default:
                return status;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'upcoming':
                return { ...styles.statusBadge, ...styles.statusUpcoming };
            case 'planning':
                return { ...styles.statusBadge, ...styles.statusPlanning };
            case 'completed':
                return { ...styles.statusBadge, ...styles.statusCompleted };
            default:
                return styles.statusBadge;
        }
    };

    const getSummaryStats = () => {
        return {
            total: schedules.length,
            upcoming: schedules.filter(s => s.status === 'upcoming').length,
            planning: schedules.filter(s => s.status === 'planning').length,
            completed: schedules.filter(s => s.status === 'completed').length
        };
    };

    const handleInputChange = (field, value) => {
        setNewSchedule(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTargetGroupToggle = (group) => {
        setNewSchedule(prev => ({
            ...prev,
            targetGroups: prev.targetGroups.includes(group)
                ? prev.targetGroups.filter(g => g !== group)
                : [...prev.targetGroups, group]
        }));
    };

    const handleTimeSlotChange = (index, field, value) => {
        setNewSchedule(prev => ({
            ...prev,
            timeSlots: prev.timeSlots.map((slot, i) => 
                i === index ? { ...slot, [field]: value } : slot
            )
        }));
    };

    const addTimeSlot = () => {
        setNewSchedule(prev => ({
            ...prev,
            timeSlots: [...prev.timeSlots, { startTime: "", endTime: "", assigned: "", capacity: 30 }]
        }));
    };

    const removeTimeSlot = (index) => {
        setNewSchedule(prev => ({
            ...prev,
            timeSlots: prev.timeSlots.filter((_, i) => i !== index)
        }));
    };

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
            createdBy: currentUser?.name || "Quản trị viên",
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

    const deleteSchedule = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa lịch tiêm chủng này?")) {
            setSchedules(prev => prev.filter(s => s.id !== id));
        }
    };

    const stats = getSummaryStats();

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Lập lịch Tiêm chủng</h1>
                <p style={styles.subtitle}>Quản lý và lên lịch các chiến dịch tiêm chủng trong trường học</p>
            </div>

            {/* Statistics */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
                        <FaSyringe />
                    </div>
                    <div style={styles.statNumber}>{stats.total}</div>
                    <div style={styles.statLabel}>Tổng lịch tiêm</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'}}>
                        <FaHourglassHalf />
                    </div>
                    <div style={styles.statNumber}>{stats.upcoming}</div>
                    <div style={styles.statLabel}>Sắp tới</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'}}>
                        <FaClipboardList />
                    </div>
                    <div style={styles.statNumber}>{stats.planning}</div>
                    <div style={styles.statLabel}>Đang lên kế hoạch</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{...styles.statIcon, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}}>
                        <FaCheckCircle />
                    </div>
                    <div style={styles.statNumber}>{stats.completed}</div>
                    <div style={styles.statLabel}>Đã hoàn thành</div>
                </div>
            </div>

            {/* Controls */}
            <div style={styles.card}>
                <div style={styles.controlsContainer}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                        Danh sách lịch tiêm chủng
                    </h2>
                    <button
                        style={styles.buttonPrimary}
                        onClick={() => setShowCreateModal(true)}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                        }}
                    >
                        <FaPlus />
                        Tạo lịch tiêm mới
                    </button>
                </div>
            </div>

            {/* Schedules Grid */}
            <div style={styles.card}>
                {schedules.length === 0 ? (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>
                            <FaSyringe />
                        </div>
                        <h3 style={styles.emptyTitle}>Chưa có lịch tiêm chủng nào</h3>
                        <p>Nhấp vào "Tạo lịch tiêm mới" để bắt đầu lên lịch tiêm chủng.</p>
                    </div>
                ) : (
                    <div style={styles.scheduleGrid}>
                        {schedules.map(schedule => (
                            <div key={schedule.id} 
                                 style={styles.scheduleCard}
                                 onMouseEnter={(e) => {
                                     e.currentTarget.style.transform = 'translateY(-4px)';
                                     e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                                 }}
                                 onMouseLeave={(e) => {
                                     e.currentTarget.style.transform = 'translateY(0)';
                                     e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
                                 }}>
                                <div style={styles.scheduleHeader}>
                                    <div>
                                        <h3 style={styles.scheduleTitle}>{schedule.title}</h3>
                                        <p style={styles.scheduleVaccine}>Vắc xin: {schedule.vaccineType}</p>
                                    </div>
                                    <span style={getStatusStyle(schedule.status)}>
                                        {getStatusText(schedule.status)}
                                    </span>
                                </div>

                                <div style={styles.scheduleInfo}>
                                    <div style={styles.infoItem}>
                                        <FaCalendarAlt style={styles.infoIcon} />
                                        <span>{new Date(schedule.startDate).toLocaleDateString('vi-VN')} - {new Date(schedule.endDate).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <div style={styles.infoItem}>
                                        <FaMapMarkerAlt style={styles.infoIcon} />
                                        <span>{schedule.location}</span>
                                    </div>
                                    <div style={styles.infoItem}>
                                        <FaUserMd style={styles.infoIcon} />
                                        <span>Tạo bởi: {schedule.createdBy}</span>
                                    </div>
                                    <div style={styles.infoItem}>
                                        <FaBell style={styles.infoIcon} />
                                        <span>{schedule.notificationsSent ? 'Đã thông báo' : 'Chưa thông báo'}</span>
                                    </div>
                                </div>

                                <div style={styles.targetGroups}>
                                    {schedule.targetGroups.map(group => (
                                        <span key={group} style={styles.groupBadge}>{group}</span>
                                    ))}
                                </div>

                                <div style={styles.timeSlotsContainer}>
                                    <h4 style={styles.timeSlotsTitle}>Khung giờ tiêm:</h4>
                                    {schedule.timeSlots.map((slot, index) => (
                                        <div key={index} style={styles.timeSlot}>
                                            <span style={styles.timeSlotTime}>
                                                {slot.startTime} - {slot.endTime}
                                            </span>
                                            <span style={styles.timeSlotAssigned}>
                                                {slot.assigned || 'Chưa phân công'}
                                            </span>
                                            <span style={styles.timeSlotCapacity}>
                                                {slot.registered || 0}/{slot.capacity}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div style={styles.actionsContainer}>
                                    <button 
                                        style={{...styles.actionButton, ...styles.viewButton}}
                                        title="Xem chi tiết"
                                        onMouseEnter={(e) => e.target.style.background = '#bfdbfe'}
                                        onMouseLeave={(e) => e.target.style.background = '#dbeafe'}
                                    >
                                        <FaEye />
                                    </button>
                                    <button 
                                        style={{...styles.actionButton, ...styles.editButton}}
                                        title="Chỉnh sửa"
                                        onMouseEnter={(e) => e.target.style.background = '#fde68a'}
                                        onMouseLeave={(e) => e.target.style.background = '#fef3c7'}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        style={{...styles.actionButton, ...styles.notifyButton}}
                                        title="Gửi thông báo"
                                        onMouseEnter={(e) => e.target.style.background = '#bbf7d0'}
                                        onMouseLeave={(e) => e.target.style.background = '#dcfce7'}
                                    >
                                        <FaBell />
                                    </button>
                                    <button 
                                        style={{...styles.actionButton, ...styles.deleteButton}}
                                        title="Xóa"
                                        onClick={() => deleteSchedule(schedule.id)}
                                        onMouseEnter={(e) => e.target.style.background = '#fecaca'}
                                        onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Schedule Modal */}
            {showCreateModal && (
                <div style={styles.modal} onClick={() => setShowCreateModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Tạo lịch tiêm chủng mới</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Tiêu đề lịch tiêm *</label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    value={newSchedule.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Nhập tiêu đề lịch tiêm"
                                    required
                                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Loại vắc xin *</label>
                                <select
                                    style={styles.select}
                                    value={newSchedule.vaccineType}
                                    onChange={(e) => handleInputChange('vaccineType', e.target.value)}
                                    required
                                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                >
                                    <option value="">Chọn loại vắc xin</option>
                                    <option value="Influenza">Cúm mùa (Influenza)</option>
                                    <option value="HPV">HPV</option>
                                    <option value="DPT">Bạch hầu - Ho gà - Uốn ván (DPT)</option>
                                    <option value="Hepatitis B">Viêm gan B</option>
                                    <option value="MMR">Sởi - Quai bị - Rubella (MMR)</option>
                                    <option value="COVID-19">COVID-19</option>
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Nhóm đích *</label>
                                <div style={styles.checkboxGroup}>
                                    {['Lớp 1', 'Lớp 2', 'Lớp 3', 'Lớp 4', 'Lớp 5', 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9'].map(group => (
                                        <div
                                            key={group}
                                            style={newSchedule.targetGroups.includes(group) ? 
                                                {...styles.checkboxItem, ...styles.checkboxItemSelected} : 
                                                styles.checkboxItem}
                                            onClick={() => handleTargetGroupToggle(group)}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={newSchedule.targetGroups.includes(group)}
                                                onChange={() => {}}
                                                style={{ pointerEvents: 'none' }}
                                            />
                                            <span>{group}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Ngày bắt đầu *</label>
                                    <input
                                        type="date"
                                        style={styles.input}
                                        value={newSchedule.startDate}
                                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                                        required
                                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    />
                                </div>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Ngày kết thúc *</label>
                                    <input
                                        type="date"
                                        style={styles.input}
                                        value={newSchedule.endDate}
                                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                                        required
                                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                    />
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Địa điểm</label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    value={newSchedule.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    placeholder="Nhập địa điểm tiêm"
                                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Mô tả</label>
                                <textarea
                                    style={styles.textarea}
                                    value={newSchedule.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    placeholder="Nhập mô tả về chiến dịch tiêm chủng"
                                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Khung giờ tiêm</label>
                                <div style={styles.timeSlotsEditor}>
                                    {newSchedule.timeSlots.map((slot, index) => (
                                        <div key={index} style={styles.timeSlotEditor}>
                                            <input
                                                type="time"
                                                style={styles.input}
                                                value={slot.startTime}
                                                onChange={(e) => handleTimeSlotChange(index, 'startTime', e.target.value)}
                                                placeholder="Giờ bắt đầu"
                                            />
                                            <input
                                                type="time"
                                                style={styles.input}
                                                value={slot.endTime}
                                                onChange={(e) => handleTimeSlotChange(index, 'endTime', e.target.value)}
                                                placeholder="Giờ kết thúc"
                                            />
                                            <input
                                                type="number"
                                                style={styles.input}
                                                value={slot.capacity}
                                                onChange={(e) => handleTimeSlotChange(index, 'capacity', parseInt(e.target.value))}
                                                placeholder="Sức chứa"
                                                min="1"
                                            />
                                            <button
                                                type="button"
                                                style={{...styles.actionButton, ...styles.deleteButton}}
                                                onClick={() => removeTimeSlot(index)}
                                                disabled={newSchedule.timeSlots.length <= 1}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        style={{...styles.buttonPrimary, marginTop: '8px', alignSelf: 'flex-start'}}
                                        onClick={addTimeSlot}
                                    >
                                        <FaPlus />
                                        Thêm khung giờ
                                    </button>
                                </div>
                            </div>

                            <div style={styles.modalActions}>
                                <button
                                    type="button"
                                    style={styles.buttonCancel}
                                    onClick={() => setShowCreateModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    style={styles.buttonPrimary}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translateY(-1px)';
                                        e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                                    }}
                                >
                                    Tạo lịch tiêm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default VaccinationScheduler;
