import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const TeacherDashboard = () => {
  const [classes, setClasses] = useState(['10A', '10B', '12A', '12B']);
  const [selectedClass, setSelectedClass] = useState('10A');
  const [students, setStudents] = useState([]);
  const [activeTab, setActiveTab] = useState('attendance');
  const [loading, setLoading] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [marksData, setMarksData] = useState({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchClassStudents();
  }, [selectedClass]);

  const fetchClassStudents = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`/api/teacher/class/${selectedClass}`, config);
      setStudents(res.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceChange = (studentId, status) => {
    // Update local state for attendance marking
    console.log(`Mark ${studentId} as ${status}`);
  };

  const submitAttendance = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Submit attendance for each student
      for (let student of students) {
        const status = document.getElementById(`status-${student._id}`)?.value || 'absent';
        await axios.post(
          '/api/teacher/attendance',
          {
            studentId: student._id,
            date: attendanceDate,
            status,
          },
          config
        );
      }
      alert('✅ Attendance marked successfully');
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('❌ Error marking attendance');
    }
  };

  const submitMarks = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const subject = document.getElementById('subject')?.value;
      const examType = document.getElementById('examType')?.value;

      for (let student of students) {
        const marks = document.getElementById(`marks-${student._id}`)?.value;
        if (marks !== undefined && marks !== '') {
          await axios.post(
            '/api/teacher/marks',
            {
              studentId: student._id,
              subject,
              marks: parseInt(marks),
              examType,
            },
            config
          );
        }
      }
      alert('✅ Marks uploaded successfully');
    } catch (error) {
      console.error('Error uploading marks:', error);
      alert('❌ Error uploading marks');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="teacher" />

      <div className="flex-1 flex flex-col">
        <Navbar role="teacher" />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">👨‍🏫 Teacher Dashboard</h1>

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
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <>
                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                  <div>
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                      <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                          Attendance Date
                        </label>
                        <input
                          type="date"
                          value={attendanceDate}
                          onChange={(e) => setAttendanceDate(e.target.value)}
                          className="px-4 py-2 border rounded-lg"
                        />
                      </div>

                      <table className="w-full">
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
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                      <div className="grid grid-cols-2 gap-4 mb-6">
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

                      <table className="w-full">
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

                      <button
                        onClick={submitMarks}
                        className="mt-6 bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600"
                      >
                        📤 Upload Marks
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
