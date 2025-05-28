import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function MedicationSchedule() {
    const { id } = useParams();
    const [medication, setMedication] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock data for schedule
    const mockScheduleData = {
        weekdays: [
            { day: 'Thứ Hai', times: ['7:30 AM', '12:00 PM', '4:30 PM'] },
            { day: 'Thứ Ba', times: ['7:30 AM', '12:00 PM', '4:30 PM'] },
            { day: 'Thứ Tư', times: ['7:30 AM', '12:00 PM', '4:30 PM'] },
            { day: 'Thứ Năm', times: ['7:30 AM', '12:00 PM', '4:30 PM'] },
            { day: 'Thứ Sáu', times: ['7:30 AM', '12:00 PM'] },
            { day: 'Thứ Bảy', times: [] },
            { day: 'Chủ Nhật', times: [] },
        ]
    };

    // Simulate loading medication data
    useEffect(() => {
        // In a real app, this would fetch data from an API
        setTimeout(() => {
            setMedication({
                id: parseInt(id),
                studentName: "Emma Johnson",
                medication: "Ibuprofen",
                dosage: "200mg",
                frequency: "3 lần mỗi ngày",
                startDate: "2023-05-01",
                endDate: "2023-05-30",
                status: "Active",
                instructions: "Uống sau bữa ăn",
                schedule: mockScheduleData
            });
            setLoading(false);
        }, 800);
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!medication) {
        return (
            <div className="text-center py-10">
                <p className="text-lg text-red-600">Không tìm thấy thông tin thuốc.</p>
                <Link to="/parent/medications" className="text-blue-500 hover:underline mt-4 inline-block">
                    Quay lại danh sách thuốc
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
                <Link
                    to="/parent/medications"
                    className="mr-4 text-blue-500 hover:text-blue-700"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <h1 className="text-3xl font-bold">Lịch trình uống thuốc</h1>
            </div>

            <div className="bg-white shadow rounded-lg mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {medication.medication}
                    </h2>
                    <p className="text-sm text-gray-600">
                        Cho: {medication.studentName}
                    </p>
                </div>

                <div className="p-6">
                    {/* Medication Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Liều lượng</p>
                            <p>{medication.dosage}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Tần suất</p>
                            <p>{medication.frequency}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Ngày bắt đầu</p>
                            <p>{medication.startDate}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Ngày kết thúc</p>
                            <p>{medication.endDate}</p>
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-4">Lịch trình hàng tuần</h3>

                    <div className="bg-gray-50 border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày trong tuần
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thời gian uống thuốc
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {medication.schedule.weekdays.map((day, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {day.day}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {day.times.length > 0 ? (
                                                day.times.map((time, i) => (
                                                    <span key={i} className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                                                        {time}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400">Không có lịch uống thuốc</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 001-1v-4a1 1 0 10-2 0v4a1 1 0 001 1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    <strong>Lưu ý:</strong> {medication.instructions}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <Link
                    to="/parent/medications"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Quay lại
                </Link>
            </div>
        </div>
    );
}

export default MedicationSchedule;
