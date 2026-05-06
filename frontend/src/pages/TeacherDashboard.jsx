import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import client from '../api/client';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProfileSettings from '../components/ProfileSettings';

const TeacherDashboard = () => {
  // eslint-disable-next-line no-unused-vars
  const [classes, setClasses] = useState(['10A', '10B', '12A', '12B']);
  const [selectedClass, setSelectedClass] = useState('10A');
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('attendance');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  // eslint-disable-next-line no-unused-vars
  const [marksData, setMarksData] = useState({});

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchClassStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClass]);

  const fetchClassStudents = async () => {
    try {
      setLoading(true);
      const res = await client.get(`/api/teacher/class/${selectedClass}`);
      setStudents([...(res.data.students || [])].sort((a, b) => a.rollNo - b.rollNo));
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleAttendanceChange = (studentId, status) => {
    // Update local state for attendance marking
    console.log(`Mark ${studentId} as ${status}`);
  };

  const submitAttendance = async () => {
    try {
      
      if (!attendanceDate) {
        toast.warning('Please select a date');
        return;
      }

      if (students.length === 0) {
        toast.warning('No students found for this class');
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      // Submit attendance for each student
      for (let student of students) {
        const status = document.getElementById(`status-${student._id}`)?.value;
        
        if (!status) {
          errorCount++;
          continue;
        }

        try {
          await client.post(
            '/api/teacher/attendance',
            {
              studentId: student._id,
              date: attendanceDate, // YYYY-MM-DD format
              status,
              remarks: '',
            }
          );
          successCount++;
        } catch (err) {
          console.error(`Error marking attendance for ${student.userId.name}:`, err.response?.data?.message);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Attendance marked for ${successCount} student(s)${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
      } else {
        toast.error('Failed to mark attendance for all students');
      }
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const submitMarks = async () => {
    try {
      const subject = document.getElementById('subject')?.value?.trim();
      const examType = document.getElementById('examType')?.value;

      if (!subject) {
        toast.warning('Please enter a subject name');
        return;
      }

      if (!examType) {
        toast.warning('Please select an exam type');
        return;
      }

      if (students.length === 0) {
        toast.warning('No students found for this class');
        return;
      }

      let successCount = 0;
      let errorCount = 0;

      for (let student of students) {
        const marksValue = document.getElementById(`marks-${student._id}`)?.value;
        
        if (marksValue === undefined || marksValue === '') {
          continue; // Skip empty entries
        }

        const marks = parseInt(marksValue);
        
        if (isNaN(marks) || marks < 0 || marks > 100) {
          console.warn(`Invalid marks for ${student.userId.name}: ${marksValue}`);
          errorCount++;
          continue;
        }

        try {
          await client.post(
            '/api/teacher/marks',
            {
              studentId: student._id,
              subject,
              marks,
              examType,
            }
          );
          successCount++;
        } catch (err) {
          console.error(`Error uploading marks for ${student.userId.name}:`, err.response?.data?.message);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Marks uploaded for ${successCount} student(s)${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
      } else {
        toast.error('No marks were uploaded');
      }
    } catch (error) {
      console.error('Error uploading marks:', error);
      toast.error(error.response?.data?.message || 'Failed to upload marks');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="teacher" isOpen={sidebarOpen} onTabChange={setActiveTab} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="teacher" toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

        <div className="flex-1 overflow-auto p-3 sm:p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">👨‍🏫 Teacher Dashboard</h1>

            {/* Class Selector */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`flex-1 py-3 font-semibold ${
                    activeTab === 'attendance'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-600'
                  }`}
                >
                  📅 Mark Attendance
                </button>
                <button
                  onClick={() => setActiveTab('marks')}
                  className={`flex-1 py-3 font-semibold ${
                    activeTab === 'marks'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-600'
                  }`}
                >
                  📊 Upload Marks
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                  <div>
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
                      <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Attendance Date</label>
                        <input
                          type="date"
                          value={attendanceDate}
                          onChange={(e) => setAttendanceDate(e.target.value)}
                          className="w-full sm:w-auto px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="overflow-x-auto">
                      <table className="w-full min-w-[300px]">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="px-4 py-2 text-left">Roll No</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student._id} className="border-t">
                              <td className="px-4 py-2">{student.rollNo}</td>
                              <td className="px-4 py-2">{student.userId.name}</td>
                              <td className="px-4 py-2">
                                <select
                                  id={`status-${student._id}`}
                                  defaultValue="absent"
                                  className="px-3 py-1 border rounded"
                                >
                                  <option value="present">✅ Present</option>
                                  <option value="absent">❌ Absent</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>

                      <button
                        onClick={submitAttendance}
                        className="mt-6 bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600"
                      >
                        💾 Submit Attendance
                      </button>
                    </div>
                  </div>
                )}

                {/* Marks Tab */}
                {activeTab === 'marks' && (
                  <div>
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Subject
                          </label>
                          <input
                            id="subject"
                            type="text"
                            placeholder="Enter subject name"
                            className="w-full px-4 py-2 border rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Exam Type
                          </label>
                          <select id="examType" className="w-full px-4 py-2 border rounded-lg">
                            <option value="unit1">Unit 1</option>
                            <option value="unit2">Unit 2</option>
                            <option value="midterm">Midterm</option>
                            <option value="final">Final</option>
                          </select>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                      <table className="w-full min-w-[280px]">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="px-4 py-2 text-left">Roll No</th>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Marks (0-100)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {students.map((student) => (
                            <tr key={student._id} className="border-t">
                              <td className="px-4 py-2">{student.rollNo}</td>
                              <td className="px-4 py-2">{student.userId.name}</td>
                              <td className="px-4 py-2">
                                <input
                                  id={`marks-${student._id}`}
                                  type="number"
                                  min="0"
                                  max="100"
                                  placeholder="0"
                                  className="px-3 py-1 border rounded w-20"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>

                      <button
                        onClick={submitMarks}
                        className="mt-6 bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600"
                      >
                        📤 Upload Marks
                      </button>
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

export default TeacherDashboard;
