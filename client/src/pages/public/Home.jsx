import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="bg-blue-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Your Child's Health is Our Priority
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Lincoln High School provides comprehensive healthcare services
                to ensure students stay healthy and perform at their best. Our
                dedicated medical staff is committed to supporting your child's
                wellbeing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition duration-300"
                >
                  Join Our Health Portal
                </Link>
                <Link
                  to="/resources"
                  className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium py-3 px-6 rounded-md transition duration-300"
                >
                  Explore Resources
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-10">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                alt="School nurse examining student"
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Health Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We offer a wide range of health services to ensure your child's
              wellbeing throughout the school year.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Health Records</h3>
              <p className="text-gray-600">
                Maintain comprehensive health records including allergies,
                medical conditions, and treatment history.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Medication Management
              </h3>
              <p className="text-gray-600">
                Securely send medication to school with proper instructions for
                our trained staff to administer.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Emergency Response</h3>
              <p className="text-gray-600">
                Immediate care for injuries, illness, and medical emergencies
                with proper documentation and parent notification.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Vaccination Programs
              </h3>
              <p className="text-gray-600">
                Coordinate school vaccination programs with parental consent and
                proper follow-up monitoring.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Health Screenings</h3>
              <p className="text-gray-600">
                Regular checks for vision, hearing, growth, and other important
                health indicators with detailed reporting.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Health Education</h3>
              <p className="text-gray-600">
                Resources and workshops on important health topics for students,
                parents, and the wider school community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-blue-600 rounded-xl p-8 md:p-12 shadow-xl">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-2/3 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Join Our School Health Portal Today
                </h2>
                <p className="text-xl text-blue-100">
                  Create an account to access your child's health records,
                  request medication administration, and stay informed about
                  health events at school.
                </p>
              </div>
              <div className="md:w-1/3 text-center">
                <Link
                  to="/register"
                  className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-md transition duration-300 text-lg"
                >
                  Sign Up Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <MagnusHeader />
      <MagnusAbout />
      <MagnusFeatures />
      <MagnusDoctors />
      <MagnusTestimonials />
      <MagnusContact />
    </div>
  );
}

export default Home;
