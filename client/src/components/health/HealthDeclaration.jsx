import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function HealthDeclaration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    temperature: '',
    symptoms: [],
    contact: false,
    travel: false,
    additionalNotes: ''
  });

  const symptoms = [
    'Fever',
    'Cough',
    'Shortness of breath',
    'Fatigue',
    'Body aches',
    'Loss of taste/smell'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý submit form
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/dashboard" className="text-white text-xl font-bold">
            Magnus Health
          </Link>
          <Link to="/dashboard" className="text-white">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">          <h2 className="text-2xl font-bold mb-6">Tờ khai Y tế</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nhiệt độ hiện tại (°C)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Symptoms Checklist */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Các triệu chứng hiện tại (nếu có)
              </label>
              <div className="grid grid-cols-2 gap-4">
                {symptoms.map((symptom) => (
                  <div key={symptom} className="flex items-center">
                    <input
                      type="checkbox"
                      id={symptom}
                      checked={formData.symptoms.includes(symptom)}
                      onChange={(e) => {
                        const newSymptoms = e.target.checked
                          ? [...formData.symptoms, symptom]
                          : formData.symptoms.filter(s => s !== symptom);
                        setFormData({ ...formData, symptoms: newSymptoms });
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={symptom} className="ml-2 text-sm text-gray-600">
                      {symptom}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact with COVID-19 */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />                <span className="ml-2 text-sm text-gray-600">
                  Đã tiếp xúc với người mắc COVID-19 trong 14 ngày qua
                </span>
              </label>
            </div>

            {/* Recent Travel */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.travel}
                  onChange={(e) => setFormData({ ...formData, travel: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">
                  Đã đi nước ngoài trong 14 ngày qua
                </span>
              </label>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Declaration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HealthDeclaration;