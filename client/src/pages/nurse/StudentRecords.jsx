import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentRecords() {
    const [students] = useState([
        {
            id: 1,
            studentId: "ST2024001",
            name: "Emma Johnson",
            grade: "5",
            age: 10,
            class: "5A",
            bloodType: "A+",
            allergies: ["Đậu Phộng", "Bụi"],
            lastCheckup: "2025-05-15",
            emergencyContact: "Nguyễn Thị Lan (Mẹ) - 555-0123"
        },
        {
            id: 2,
            studentId: "ST2025002",
            name: "Jane Smith",
            grade: "11",
            age: 17,
            class: "11B",
            bloodType: "O-",
            allergies: ["Penicillin"],
            lastCheckup: "2025-05-01",
            emergencyContact: "Bob Smith (Father) - 555-0124"
        },
        {
            id: 3,
            studentId: "ST2025003",
            name: "Mike Johnson",
            grade: "9",
            age: 15,
            class: "9C",
            bloodType: "B+",
            allergies: [],
            lastCheckup: "2025-05-10",
            emergencyContact: "Sarah Johnson (Mother) - 555-0125"
        },
        {
            id: 4,
            studentId: "ST2025004",
            name: "Emily Brown",
            grade: "12",
            age: 18,
            class: "12A",
            bloodType: "AB+",
            allergies: ["Latex"],
            lastCheckup: "2025-04-20",
            emergencyContact: "Tom Brown (Father) - 555-0126"
        }
    ]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState(''); const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold">Hồ Sơ Sức Khỏe Học Sinh</h1>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc mã học sinh"
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <svg
                        className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                    Tìm thấy {filteredStudents.length} học sinh
                </div>
            </div>
        </div>

            <div className="grid gap-6">
                {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                        <div key={student.id} className="bg-white shadow rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-semibold">{student.name}</h2>                                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2 text-sm">
                                        <p className="text-gray-600">Mã học sinh: <span className="text-gray-900">{student.studentId}</span></p>
                                        <p className="text-gray-600">Khối: <span className="text-gray-900">{student.grade}</span></p>
                                        <p className="text-gray-600">Lớp: <span className="text-gray-900">{student.class}</span></p>
                                        <p className="text-gray-600">Tuổi: <span className="text-gray-900">{student.age}</span></p>
                                        <p className="text-gray-600">Nhóm máu: <span className="text-gray-900">{student.bloodType}</span></p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    {/* View Record Button */}
                                    <div className="relative group">
                                        <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-150 flex items-center group-hover:ring-2 group-hover:ring-blue-300"
                                            onClick={() => navigate(`/nurse/students/${student.id}/record`)}
                                        >
                                            <div className="mr-4 p-2 bg-blue-100 rounded-full">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </div>                                            <div>
                                                <div className="font-medium">Xem Hồ Sơ</div>
                                                <div className="text-sm text-gray-500">Cập nhật cuối: {new Date(student.lastCheckup).toLocaleDateString()}</div>
                                            </div>
                                        </button>
                                        {/* Tooltip */}                                        <div className="absolute hidden group-hover:block -top-12 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded whitespace-nowrap">
                                            Nhấn để xem hồ sơ sức khỏe đầy đủ
                                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
                                        </div>
                                    </div>

                                    {/* Plan Health Screening Button */}
                                    {/* <button
                                        className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-150 flex items-center"
                                        onClick={() => alert(`Open health screening for ${student.name}`)}
                                    >
                                        <div className="mr-4 p-2 bg-purple-100 rounded-full">
                                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                            </svg>
                                        </div>                                        <div>
                                            <div className="font-medium">Lập Kế Hoạch Khám Sức Khỏe</div>
                                            <div className="text-sm text-gray-500">Đặt lịch khám sức khỏe</div>
                                        </div>
                                    </button> */}
                                </div>
                            </div>                            <div className="mt-4">
                                <p className="text-gray-600 text-sm font-medium">Dị ứng:</p>
                                <div className="flex gap-2 mt-1">
                                    {student.allergies.length > 0 ? student.allergies.map((allergy, index) => (
                                        <span key={index} className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm">
                                            {allergy}
                                        </span>
                                    )) : (
                                        <span className="text-sm text-gray-500">Không có dị ứng nào được biết</span>
                                    )}
                                </div>
                            </div>

                            <div className="mt-2">
                                <p className="text-gray-600 text-sm">Khám cuối: <span className="text-gray-900">{new Date(student.lastCheckup).toLocaleDateString()}</span></p>
                                <p className="text-gray-600 text-sm">Liên hệ khẩn cấp: <span className="text-gray-900">{student.emergencyContact}</span></p>
                            </div>
                        </div>
                    ))) : (
                    <div className="text-center py-8 text-gray-500">
                        Không tìm thấy học sinh nào phù hợp với tiêu chí tìm kiếm của bạn
                    </div>
                )}
            </div>

            {/* Info Note */}
            <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            Hồ sơ sức khỏe học sinh là thông tin bảo mật. Vui lòng đảm bảo tuân thủ các quy trình bảo mật thích hợp khi truy cập hoặc chia sẻ thông tin này.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentRecords;