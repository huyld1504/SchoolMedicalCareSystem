import React from 'react';

function HealthResources() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Tài Liệu Sức Khỏe</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Hướng Dẫn Dinh Dưỡng</h3>
          <p className="text-gray-600">Tài liệu về dinh dưỡng hợp lý cho học sinh</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Phòng Chống Bệnh Tật</h3>
          <p className="text-gray-600">Hướng dẫn phòng chống các bệnh thường gặp</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Vệ Sinh Cá Nhân</h3>
          <p className="text-gray-600">Hướng dẫn vệ sinh cá nhân cho học sinh</p>
        </div>
      </div>
    </div>
  );
}

export default HealthResources;
