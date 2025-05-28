import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFilter, FaEllipsisV, FaUserPlus, FaFileExport, FaUser, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

function UsersList() {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);    // Sample data phù hợp với trường tiểu học
    const [users, setUsers] = useState([
        {
            id: 1,
            name: 'Nguyễn Minh An',
            email: 'minhan.nguyen@tieuhoc.edu.vn',
            role: 'Học sinh',
            grade: 'Lớp 1A',
            school: 'Trường Tiểu học Nguyễn Du',
            status: 'Hoạt động',
            lastActive: '1 giờ trước'
        },
        {
            id: 2,
            name: 'Chị Trần Thị Bình',
            email: 'binh.tran@parent.com',
            role: 'Phụ huynh',
            grade: 'Con học lớp 2B',
            school: 'Trường Tiểu học Nguyễn Du',
            status: 'Hoạt động',
            lastActive: '5 phút trước'
        },
        {
            id: 3,
            name: 'Cô Lê Thị Lan',
            email: 'lan.le@tieuhoc.edu.vn',
            role: 'Y tá trường',
            grade: null,
            school: 'Trường Tiểu học Nguyễn Du',
            status: 'Hoạt động',
            lastActive: '30 phút trước'
        },
        {
            id: 4,
            name: 'Thầy Phạm Văn Minh',
            email: 'minh.pham@tieuhoc.edu.vn',
            role: 'Hiệu trưởng',
            grade: null,
            school: 'Trường Tiểu học Nguyễn Du',
            status: 'Hoạt động',
            lastActive: '2 giờ trước'
        },
        {
            id: 5,
            name: 'Lê Thị Hoa',
            email: 'hoa.le@tieuhoc.edu.vn',
            role: 'Học sinh',
            grade: 'Lớp 3A',
            school: 'Trường Tiểu học Nguyễn Du',
            status: 'Hoạt động',
            lastActive: '4 giờ trước'
        },
        {
            id: 6,
            name: 'Cô Vũ Thị Mai',
            email: 'mai.vu@admin.tieuhoc.edu.vn',
            role: 'Quản trị viên',
            grade: null,
            school: 'Trường Tiểu học Nguyễn Du',
            status: 'Hoạt động',
            lastActive: '1 giờ trước'
        },
        {
            id: 7,
            name: 'Trần Văn Nam',
            email: 'nam.tran@tieuhoc.edu.vn',
            role: 'Học sinh',
            grade: 'Lớp 4B',
            school: 'Trường Tiểu học Nguyễn Du',
            status: 'Hoạt động',
            lastActive: '6 giờ trước'
        },
        {
            id: 8,
            name: 'Anh Hoàng Văn Đức',
            email: 'duc.hoang@parent.com',
            role: 'Phụ huynh',
            grade: 'Con học lớp 5A',
            school: 'Trường Tiểu học Nguyễn Du',
            status: 'Hoạt động',
            lastActive: '1 ngày trước'
        },
        {
            id: 9,
            name: 'Cô Nguyễn Thị Thu',
            email: 'thu.nguyen@tieuhoc.edu.vn',
            role: 'Giáo viên',
            grade: 'Chủ nhiệm lớp 2A',
            school: 'Trường Tiểu học Nguyễn Du',
            status: 'Hoạt động',
            lastActive: '3 giờ trước'
        },
        {
            id: 10,
            name: 'BS. Trần Văn Cường',
            email: 'cuong.tran@yte.gov.vn',
            role: 'Bác sĩ',
            grade: null,
            school: 'Trạm Y tế Phường 1',
            status: 'Hoạt động',
            lastActive: '5 giờ trước'
        }
    ]);

    // Filter users based on search and filters
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        const matchesStatus = !statusFilter || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

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
        card: {
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid rgba(255,255,255,0.8)'
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
        buttonSecondary: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        },
        filtersContainer: {
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            alignItems: 'center'
        },
        searchInput: {
            padding: '12px 16px 12px 40px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            width: '300px',
            transition: 'border-color 0.2s',
            outline: 'none'
        },
        select: {
            padding: '12px 16px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            minWidth: '150px',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        },
        tableHeader: {
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            fontWeight: '600',
            fontSize: '14px',
            color: '#374151',
            padding: '16px',
            textAlign: 'left',
            borderBottom: '1px solid #e5e7eb'
        },
        tableCell: {
            padding: '16px',
            borderBottom: '1px solid #f3f4f6',
            fontSize: '14px'
        },
        userAvatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '14px'
        },
        userInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        userName: {
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '4px'
        },
        userEmail: {
            color: '#6b7280',
            fontSize: '13px'
        },
        statusBadge: {
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600',
            textAlign: 'center'
        },
        statusActive: {
            background: '#dcfce7',
            color: '#166534'
        },
        statusInactive: {
            background: '#fee2e2',
            color: '#991b1b'
        },
        statusPending: {
            background: '#fef3c7',
            color: '#92400e'
        },
        actionButton: {
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            transition: 'background-color 0.2s, color 0.2s'
        },
        dropdownMenu: {
            position: 'absolute',
            right: '0',
            top: '100%',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            border: '1px solid #e5e7eb',
            minWidth: '180px',
            zIndex: 1000
        },
        dropdownItem: {
            padding: '12px 16px',
            fontSize: '14px',
            color: '#374151',
            cursor: 'pointer',
            borderBottom: '1px solid #f3f4f6',
            transition: 'background-color 0.2s'
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
            zIndex: 1000
        },
        modalContent: {
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            width: '90%',
            maxWidth: '500px',
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
        modalActions: {
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
            marginTop: '24px'
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
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Hoạt động':
                return { ...styles.statusBadge, ...styles.statusActive };
            case 'Tạm ngưng':
                return { ...styles.statusBadge, ...styles.statusInactive };
            default:
                return { ...styles.statusBadge, ...styles.statusPending };
        }
    };

    const getUserInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const [dropdownOpen, setDropdownOpen] = useState(null);

    const toggleDropdown = (userId) => {
        setDropdownOpen(dropdownOpen === userId ? null : userId);
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Quản lý Người dùng</h1>
                <p style={styles.subtitle}>Quản lý tài khoản người dùng trong hệ thống chăm sóc y tế học đường</p>
            </div>

            {/* Statistics */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>
                        <FaUser />
                    </div>
                    <div style={styles.statNumber}>{users.length}</div>
                    <div style={styles.statLabel}>Tổng người dùng</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>
                        <FaUser />
                    </div>
                    <div style={styles.statNumber}>{users.filter(u => u.status === 'Hoạt động').length}</div>
                    <div style={styles.statLabel}>Đang hoạt động</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>
                        <FaUser />
                    </div>
                    <div style={styles.statNumber}>{users.filter(u => u.role === 'Học sinh').length}</div>
                    <div style={styles.statLabel}>Học sinh</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statIcon}>
                        <FaUser />
                    </div>
                    <div style={styles.statNumber}>{users.filter(u => u.role === 'Y tá').length}</div>
                    <div style={styles.statLabel}>Nhân viên y tế</div>
                </div>
            </div>

            {/* Controls */}
            <div style={styles.card}>
                <div style={styles.controlsContainer}>
                    <div style={styles.filtersContainer}>
                        {/* Search */}
                        <div style={{ position: 'relative' }}>
                            <FaSearch style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6b7280',
                                fontSize: '14px'
                            }} />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên hoặc email..."
                                style={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        {/* Role Filter */}
                        <select
                            style={styles.select}
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        >
                            <option value="">Tất cả vai trò</option>
                            <option value="Học sinh">Học sinh</option>
                            <option value="Phụ huynh">Phụ huynh</option>
                            <option value="Y tá">Y tá</option>
                            <option value="Quản lý">Quản lý</option>
                            <option value="Quản trị viên">Quản trị viên</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            style={styles.select}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="Hoạt động">Hoạt động</option>
                            <option value="Tạm ngưng">Tạm ngưng</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                            style={styles.buttonPrimary}
                            onClick={() => setShowAddModal(true)}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                            }}
                        >
                            <FaUserPlus />
                            Thêm người dùng
                        </button>
                        <button
                            style={styles.buttonSecondary}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                            }}
                        >
                            <FaFileExport />
                            Xuất dữ liệu
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div style={styles.card}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.tableHeader}>Người dùng</th>
                            <th style={styles.tableHeader}>Vai trò</th>
                            <th style={styles.tableHeader}>Trường học</th>
                            <th style={styles.tableHeader}>Trạng thái</th>
                            <th style={styles.tableHeader}>Hoạt động cuối</th>
                            <th style={styles.tableHeader}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} style={{ transition: 'background-color 0.2s' }}
                                onMouseEnter={(e) => e.target.closest('tr').style.backgroundColor = '#f9fafb'}
                                onMouseLeave={(e) => e.target.closest('tr').style.backgroundColor = 'transparent'}>
                                <td style={styles.tableCell}>
                                    <div style={styles.userInfo}>
                                        <div style={styles.userAvatar}>
                                            {getUserInitials(user.name)}
                                        </div>
                                        <div>
                                            <div style={styles.userName}>{user.name}</div>
                                            <div style={styles.userEmail}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={styles.tableCell}>
                                    <div style={{ fontWeight: '600', color: '#1f2937' }}>{user.role}</div>
                                    {user.grade && <div style={{ color: '#6b7280', fontSize: '13px' }}>{user.grade}</div>}
                                </td>
                                <td style={styles.tableCell}>
                                    <div style={{ color: '#1f2937' }}>{user.school}</div>
                                </td>
                                <td style={styles.tableCell}>
                                    <span style={getStatusStyle(user.status)}>
                                        {user.status}
                                    </span>
                                </td>
                                <td style={styles.tableCell}>
                                    <div style={{ color: '#6b7280' }}>{user.lastActive}</div>
                                </td>
                                <td style={styles.tableCell}>
                                    <div style={{ position: 'relative' }}>
                                        <button
                                            style={styles.actionButton}
                                            onClick={() => toggleDropdown(user.id)}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = '#f3f4f6';
                                                e.target.style.color = '#374151';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor = 'transparent';
                                                e.target.style.color = '#6b7280';
                                            }}
                                        >
                                            <FaEllipsisV />
                                        </button>
                                        {dropdownOpen === user.id && (
                                            <div style={styles.dropdownMenu}>
                                                <Link to={`/admin/users/${user.id}`} style={{ textDecoration: 'none' }}>
                                                    <div style={styles.dropdownItem}
                                                         onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                                         onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                                                        <FaEye style={{ marginRight: '8px' }} />
                                                        Xem thông tin
                                                    </div>
                                                </Link>
                                                <Link to={`/admin/users/${user.id}/edit`} style={{ textDecoration: 'none' }}>
                                                    <div style={styles.dropdownItem}
                                                         onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                                                         onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                                                        <FaEdit style={{ marginRight: '8px' }} />
                                                        Chỉnh sửa
                                                    </div>
                                                </Link>
                                                <div style={{...styles.dropdownItem, color: '#dc2626', borderBottom: 'none'}}
                                                     onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                                                     onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}>
                                                    <FaTrash style={{ marginRight: '8px' }} />
                                                    Vô hiệu hóa
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div style={styles.modal} onClick={() => setShowAddModal(false)}>
                    <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 style={styles.modalTitle}>Thêm người dùng mới</h2>
                        <form>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Họ và tên</label>
                                <input
                                    type="text"
                                    style={styles.input}
                                    placeholder="Nhập họ và tên đầy đủ"
                                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Email</label>
                                <input
                                    type="email"
                                    style={styles.input}
                                    placeholder="Nhập địa chỉ email"
                                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Vai trò</label>
                                <select style={styles.input}
                                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}>
                                    <option value="">Chọn vai trò</option>
                                    <option value="Học sinh">Học sinh</option>
                                    <option value="Phụ huynh">Phụ huynh</option>
                                    <option value="Y tá">Y tá</option>
                                    <option value="Quản lý">Quản lý</option>
                                    <option value="Quản trị viên">Quản trị viên</option>
                                </select>
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Trường học</label>
                                <select style={styles.input}
                                        onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}>
                                    <option value="">Chọn trường học</option>
                                    <option>Trường THPT Nguyễn Du</option>
                                    <option>Trường THCS Lê Lợi</option>
                                    <option>Trường THCS Trần Hưng Đạo</option>
                                    <option>Trường Tiểu học Kim Đồng</option>
                                    <option>Sở Giáo dục</option>
                                </select>
                            </div>
                            <div style={styles.modalActions}>
                                <button
                                    type="button"
                                    style={styles.buttonCancel}
                                    onClick={() => setShowAddModal(false)}
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
                                    Thêm người dùng
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UsersList;
