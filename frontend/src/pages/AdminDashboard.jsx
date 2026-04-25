import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem('token');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    class: '10A',
    rollNo: '',
    subject: '',
    qualifications: '',
  });

  useEffect(() => {
    if (activeTab === 'students') {
      fetchStudents();
    } else if (activeTab === 'teachers') {
      fetchTeachers();
    }
  }, [activeTab]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/admin/students', config);
      setStudents(res.data.students);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('/api/admin/teachers', config);
      setTeachers(res.data.teachers);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('/api/admin/student', formData, config);
      alert('✅ Student added successfully');
      setFormData({
        name: '',
        email: '',
        password: '',
        class: '10A',
        rollNo: '',
        subject: '',
        qualifications: '',
      });
      setShowAddForm(false);
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      alert('❌ Error adding student');
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post('/api/admin/teacher', formData, config);
      alert('✅ Teacher added successfully');
      setFormData({
        name: '',
        email: '',
        password: '',
        class: '10A',
        rollNo: '',
        subject: '',
        qualifications: '',
      });
      setShowAddForm(false);
      fetchTeachers();
    } catch (error) {
      console.error('Error adding teacher:', error);
      alert('❌ Error adding teacher');
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`/api/admin/student/${id}`, config);
        alert('✅ Student deleted');
        fetchStudents();
      } catch (error) {
        alert('❌ Error deleting student');
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="admin" isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="admin" toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">🧑‍💼 Admin Dashboard</h1>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('students')}
                  className={`flex-1 py-3 font-semibold ${
                    activeTab === 'students'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-600'
                  }`}
                >
                  👨‍🎓 Students
                </button>
                <button
                  onClick={() => setActiveTab('teachers')}
                  className={`flex-1 py-3 font-semibold ${
                    activeTab === 'teachers'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-600'
                  }`}
                >
                  👩‍🏫 Teachers
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`flex-1 py-3 font-semibold ${
                    activeTab === 'reports'
                      ? 'border-b-2 border-blue-500 text-blue-500'
                      : 'text-gray-600'
                  }`}
                >
                  📊 Reports
                </button>
              </div>
            </div>

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="mb-6 bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600"
                >
                  {showAddForm ? '✖️ Cancel' : '➕ Add Student'}
                </button>

                {showAddForm && (
                  <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <form onSubmit={handleAddStudent}>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="px-4 py-2 border rounded-lg"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="px-4 py-2 border rounded-lg"
                          required
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                          }
                          className="px-4 py-2 border rounded-lg"
                          required
                        />
                        <select
                          value={formData.class}
                          onChange={(e) =>
                            setFormData({ ...formData, class: e.target.value })
                          }
                          className="px-4 py-2 border rounded-lg"
                        >
                          <option value="10A">10A</option>
                          <option value="10B">10B</option>
                          <option value="12A">12A</option>
                          <option value="12B">12B</option>
                        </select>
                        <input
                          type="number"
                          placeholder="Roll No"
                          value={formData.rollNo}
                          onChange={(e) =>
                            setFormData({ ...formData, rollNo: e.target.value })
                          }
                          className="px-4 py-2 border rounded-lg"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600"
                      >
                        ✅ Add Student
                      </button>
                    </form>
                  </div>
                )}

                {loading ? (
                  <div className="text-center text-gray-500">Loading...</div>
                ) : (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Class</th>
                          <th className="px-4 py-2 text-left">Roll No</th>
                          <th className="px-4 py-2 text-left">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => (
                          <tr key={student._id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">{student.userId.name}</td>
                            <td className="px-4 py-2">{student.userId.email}</td>
                            <td className="px-4 py-2">{student.class}</td>
                            <td className="px-4 py-2">{student.rollNo}</td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() => handleDeleteStudent(student._id)}
                                className="text-red-500 hover:text-red-700 font-semibold"
                              >
                                🗑️ Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Teachers Tab */}
            {activeTab === 'teachers' && (
              <div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="mb-6 bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600"
                >
                  {showAddForm ? '✖️ Cancel' : '➕ Add Teacher'}
                </button>

                {showAddForm && (
                  <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <form onSubmit={handleAddTeacher}>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="px-4 py-2 border rounded-lg"
                          required
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="px-4 py-2 border rounded-lg"
                          required
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({ ...formData, password: e.target.value })
                          }
                          className="px-4 py-2 border rounded-lg"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Subject"
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({ ...formData, subject: e.target.value })
                          }
                          className="px-4 py-2 border rounded-lg"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Qualifications"
                          value={formData.qualifications}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              qualifications: e.target.value,
                            })
                          }
                          className="px-4 py-2 border rounded-lg"
                        />
                      </div>
                      <button
                        type="submit"
                        className="mt-4 bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600"
                      >
                        ✅ Add Teacher
                      </button>
                    </form>
                  </div>
                )}

                {loading ? (
                  <div className="text-center text-gray-500">Loading...</div>
                ) : (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Email</th>
                          <th className="px-4 py-2 text-left">Subject</th>
                          <th className="px-4 py-2 text-left">Qualifications</th>
                        </tr>
                      </thead>
                      <tbody>
                        {teachers.map((teacher) => (
                          <tr key={teacher._id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">{teacher.userId.name}</td>
                            <td className="px-4 py-2">{teacher.userId.email}</td>
                            <td className="px-4 py-2">{teacher.subject}</td>
                            <td className="px-4 py-2">{teacher.qualifications}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">📊 Reports Coming Soon</h2>
                <p className="text-gray-600">
                  Attendance and marks reports will be displayed here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
