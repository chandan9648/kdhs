import React, { useEffect, useState } from 'react';
import client from '../api/client';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProfileSettings from '../components/ProfileSettings';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [marks, setMarks] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchStudentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchStudentData = async () => {
    try {
      if (activeTab === 'profile') {
        const res = await client.get('/api/student/profile');
        setStudent(res.data.student);
      } else if (activeTab === 'attendance') {
        const res = await client.get('/api/student/attendance');
        setAttendance(res.data);
      } else if (activeTab === 'marks') {
        const res = await client.get('/api/student/marks');
        setMarks(res.data.marks);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLoading(true);
    fetchStudentData();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="student" isOpen={sidebarOpen} onTabChange={handleTabChange} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="student" toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

        <div className="flex-1 overflow-auto p-3 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">📚 Student Dashboard</h1>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow mb-4 sm:mb-6">
              <div className="flex border-b">
                <button
                  onClick={() => handleTabChange('profile')}
                  className={`flex-1 py-3 font-semibold ${
                    activeTab === 'profile'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-600'
                  }`}
                >
                  👤 Profile
                </button>
                <button
                  onClick={() => handleTabChange('attendance')}
                  className={`flex-1 py-3 font-semibold ${
                    activeTab === 'attendance'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-600'
                  }`}
                >
                  📅 Attendance
                </button>
                <button
                  onClick={() => handleTabChange('marks')}
                  className={`flex-1 py-3 font-semibold ${
                    activeTab === 'marks'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-600'
                  }`}
                >
                  📊 Marks
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* Profile Tab */}
                {activeTab === 'profile' && student && (
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600 text-sm">Name</p>
                        <p className="text-gray-800 font-semibold">{student.userId.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Email</p>
                        <p className="text-gray-800 font-semibold">{student.userId.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Class</p>
                        <p className="text-gray-800 font-semibold">{student.class}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Roll No</p>
                        <p className="text-gray-800 font-semibold">{student.rollNo}</p>
                      </div>
                      {student.parentName && (
                        <>
                          <div>
                            <p className="text-gray-600 text-sm">Parent Name</p>
                            <p className="text-gray-800 font-semibold">{student.parentName}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Parent Phone</p>
                            <p className="text-gray-800 font-semibold">{student.parentPhone}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Attendance Tab */}
                {activeTab === 'attendance' && attendance && (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-gray-600 text-sm">Total Days</p>
                        <p className="text-2xl font-bold text-blue-500">{attendance.totalDays}</p>
                      </div>
                      <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-gray-600 text-sm">Present</p>
                        <p className="text-2xl font-bold text-green-500">{attendance.presentDays}</p>
                      </div>
                      <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-gray-600 text-sm">Absent</p>
                        <p className="text-2xl font-bold text-red-500">{attendance.absentDays}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 mb-4">
                      <p className="text-gray-600 text-sm">Attendance Percentage</p>
                      <p className="text-3xl font-bold text-purple-500">
                        {attendance.attendancePercentage}%
                      </p>
                    </div>

                    <div className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendance.attendance.map((record) => (
                            <tr key={record._id} className="border-t">
                              <td className="px-4 py-2">
                                {new Date(record.date).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-2">
                                <span
                                  className={`px-3 py-1 rounded text-white text-sm ${
                                    record.status === 'present'
                                      ? 'bg-green-500'
                                      : 'bg-red-500'
                                  }`}
                                >
                                  {record.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Marks Tab */}
                {activeTab === 'marks' && marks && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left">Subject</th>
                          <th className="px-4 py-2 text-left">Exam</th>
                          <th className="px-4 py-2 text-left">Semester</th>
                          <th className="px-4 py-2 text-left">Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {marks.map((mark) => (
                          <tr key={mark._id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">{mark.subject}</td>
                            <td className="px-4 py-2">{mark.examType.toUpperCase()}</td>
                            <td className="px-4 py-2">{mark.semester}</td>
                            <td className="px-4 py-2">
                              <span className="font-bold text-lg">{mark.marks}/100</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                )}
                {/* More / Profile Settings Tab */}
                {activeTab === 'more' && <ProfileSettings />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
