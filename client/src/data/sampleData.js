// Sample data for development and testing
export const sampleStudents = [
    {
        _id: '1',
        name: 'Nguyễn Văn An',
        studentCode: 'HS001',
        gender: 'male',
        birthdate: '2015-03-15',
        medicalConverageId: 'BH123456789',
        healthProfile: {
            height: 125,
            weight: 30,
            bloodType: 'A+',
            vision: '10/10',
            allergies: 'Không có',
            chronicDiseases: 'Không có',
            devicesSupport: 'Không có'
        }
    },
    {
        _id: '2',
        name: 'Trần Thị Bình',
        studentCode: 'HS002',
        gender: 'female',
        birthdate: '2014-08-22',
        medicalConverageId: 'BH987654321',
        healthProfile: {
            height: 130,
            weight: 32,
            bloodType: 'O+',
            vision: '9/10',
            allergies: 'Dị ứng phấn hoa',
            chronicDiseases: 'Hen suyễn nhẹ',
            devicesSupport: 'Kính cận thị'
        }
    },
    {
        _id: '3',
        name: 'Lê Minh Cường',
        studentCode: 'HS003',
        gender: 'male',
        birthdate: '2015-12-10',
        medicalConverageId: 'BH456789123',
        healthProfile: {
            height: 120,
            weight: 28,
            bloodType: 'B+',
            vision: '10/10',
            allergies: 'Dị ứng tôm cua',
            chronicDiseases: 'Không có',
            devicesSupport: 'Không có'
        }
    },
    {
        _id: '4',
        name: 'Phạm Thị Dung',
        studentCode: 'HS004',
        gender: 'female',
        birthdate: '2015-05-18',
        medicalConverageId: 'BH789123456',
        healthProfile: {
            height: 128,
            weight: 31,
            bloodType: 'AB+',
            vision: '8/10',
            allergies: 'Không có',
            chronicDiseases: 'Không có',
            devicesSupport: 'Không có'
        }
    },
    {
        _id: '5',
        name: 'Hoàng Văn Em',
        studentCode: 'HS005',
        gender: 'male',
        birthdate: '2014-11-03',
        medicalConverageId: 'BH321654987',
        healthProfile: {
            height: 135,
            weight: 35,
            bloodType: 'O-',
            vision: '10/10',
            allergies: 'Dị ứng bụi',
            chronicDiseases: 'Viêm mũi dị ứng',
            devicesSupport: 'Máy xông mũi'
        }
    }
];

export const sampleStats = {
    totalStudents: 156,
    todayCheckups: 12,
    pendingOrders: 5,
    healthAlerts: 3,
    monthlyCheckups: 89,
    emergencyCases: 2
};

export const sampleMedicalOrders = [
    {
        id: '1',
        studentName: 'Nguyễn Văn An',
        studentCode: 'HS001',
        orderType: 'Khám định kỳ',
        status: 'pending',
        date: '2025-06-11',
        priority: 'normal'
    },
    {
        id: '2',
        studentName: 'Trần Thị Bình',
        studentCode: 'HS002',
        orderType: 'Khám cấp cứu',
        status: 'completed',
        date: '2025-06-10',
        priority: 'high'
    }
];

export const sampleHealthAlerts = [
    {
        id: '1',
        studentName: 'Phạm Thị Dung',
        alertType: 'Cần theo dõi thị lực',
        severity: 'medium',
        date: '2025-06-11'
    },
    {
        id: '2',
        studentName: 'Hoàng Văn Em',
        alertType: 'Cần kiểm tra dị ứng',
        severity: 'low',
        date: '2025-06-10'
    }
];
