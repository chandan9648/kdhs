import React, { useEffect, useState } from 'react';
import client from '../api/client';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProfileSettings from '../components/ProfileSettings';

const ParentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [child, setChild] = useState(null);
  const [relation, setRelation] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [childRes, attRes, marksRes] = await Promise.all([
        client.get('/api/parent/child'),
        client.get('/api/parent/child/attendance'),
        client.get('/api/parent/child/marks'),
      ]);
      setChild(childRes.data.child);
      setRelation(childRes.data.relation);
      setAttendance(attRes.data.attendance);
      setAttendanceSummary(attRes.data.summary);
      setMarks(marksRes.data.marks);
    } catch (error) {
      console.error('Error fetching parent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (percentage) => {
    const p = parseFloat(percentage);
    if (p >= 90) return '#10b981';
    if (p >= 75) return '#3b82f6';
    if (p >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="parent" isOpen={sidebarOpen} onTabChange={setActiveTab} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="parent" toggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">👨‍👩‍👧 Parent Dashboard</h1>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="flex border-b">
                {['overview', 'attendance', 'marks'].map((tab) => (
                  <button
                    key={tab}
                    id={`parent-tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 font-semibold capitalize ${
                      activeTab === tab
                        ? 'border-b-2 border-purple-500 text-purple-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'overview' ? '🏠 Overview' : tab === 'attendance' ? '📅 Attendance' : '📊 Marks'}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" />
              </div>
            ) : (
              <>
                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Child profile card */}
                    {child && (
                      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-lg p-6 text-white">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl font-bold">
                            {child.userId?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm text-purple-200 mb-1">Your Child ({relation})</p>
                            <h2 className="text-2xl font-bold">{child.userId?.name}</h2>
                            <p className="text-purple-200 text-sm">{child.userId?.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mt-6">
                          <div className="bg-white bg-opacity-10 rounded-xl p-3 text-center">
                            <p className="text-xs text-purple-200">Class</p>
                            <p className="text-xl font-bold">{child.class}</p>
                          </div>
                          <div className="bg-white bg-opacity-10 rounded-xl p-3 text-center">
                            <p className="text-xs text-purple-200">Roll No</p>
                            <p className="text-xl font-bold">{child.rollNo}</p>
                          </div>
                          <div className="bg-white bg-opacity-10 rounded-xl p-3 text-center">
                            <p className="text-xs text-purple-200">Attendance</p>
                            <p className="text-xl font-bold">
                              {attendanceSummary ? `${attendanceSummary.percentage}%` : '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick summary cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Total Days</p>
                        <p className="text-2xl font-bold text-gray-800">{attendanceSummary?.totalDays ?? '—'}</p>
                      </div>
                      <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Present</p>
                        <p className="text-2xl font-bold text-green-600">{attendanceSummary?.presentDays ?? '—'}</p>
                      </div>
                      <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Absent</p>
                        <p className="text-2xl font-bold text-red-500">{attendanceSummary?.absentDays ?? '—'}</p>
                      </div>
                      <div className="bg-white rounded-xl shadow p-4">
                        <p className="text-gray-500 text-sm">Exams Recorded</p>
                        <p className="text-2xl font-bold text-indigo-600">{marks.length}</p>
                      </div>
                    </div>

                    {/* Attendance progress bar */}
                    {attendanceSummary && (
                      <div className="bg-white rounded-xl shadow p-5">
                        <p className="text-sm font-semibold text-gray-600 mb-2">Attendance Rate</p>
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                          <div
                            className="h-4 rounded-full transition-all duration-700"
                            style={{
                              width: `${attendanceSummary.percentage}%`,
                              backgroundColor: getGradeColor(attendanceSummary.percentage),
                            }}
                          />
                        </div>
                        <p
                          className="text-right text-sm font-bold mt-1"
                          style={{ color: getGradeColor(attendanceSummary.percentage) }}
                        >
                          {attendanceSummary.percentage}%
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ATTENDANCE TAB */}
                {activeTab === 'attendance' && (
                  <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="p-4 bg-purple-50 border-b">
                      <h2 className="font-semibold text-purple-700">
                        Attendance Records
                        {attendanceSummary && (
                          <span className="ml-2 text-sm font-normal text-gray-500">
                            ({attendanceSummary.presentDays}/{attendanceSummary.totalDays} days present – {attendanceSummary.percentage}%)
                          </span>
                        )}
                      </h2>
                    </div>
                    {attendance.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">No attendance records found.</div>
                    ) : (
                      <table className="w-full">
                        <thead className="bg-gray-100 text-gray-600 text-sm">
                          <tr>
                            <th className="px-4 py-3 text-left">Date</th>
                            <th className="px-4 py-3 text-left">Subject</th>
                            <th className="px-4 py-3 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {attendance.map((rec) => (
                            <tr key={rec._id} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-700">
                                {new Date(rec.date).toLocaleDateString('en-IN')}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{rec.subject || '—'}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    rec.status === 'present'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}
                                >
                                  {rec.status === 'present' ? '✅ Present' : '❌ Absent'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {/* MARKS TAB */}
                {activeTab === 'marks' && (
                  <div className="bg-white rounded-xl shadow overflow-hidden">
                    <div className="p-4 bg-indigo-50 border-b">
                      <h2 className="font-semibold text-indigo-700">Exam Results</h2>
                    </div>
                    {marks.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">No marks recorded yet.</div>
                    ) : (
                      <table className="w-full">
                        <thead className="bg-gray-100 text-gray-600 text-sm">
                          <tr>
                            <th className="px-4 py-3 text-left">Subject</th>
                            <th className="px-4 py-3 text-left">Exam Type</th>
                            <th className="px-4 py-3 text-left">Marks</th>
                            <th className="px-4 py-3 text-left">Max Marks</th>
                            <th className="px-4 py-3 text-left">Grade</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marks.map((m) => {
                            const pct = m.maxMarks > 0 ? ((m.marks / m.maxMarks) * 100).toFixed(0) : 0;
                            return (
                              <tr key={m._id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm font-medium text-gray-800">{m.subject}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{m.examType}</td>
                                <td className="px-4 py-3 text-sm font-bold" style={{ color: getGradeColor(pct) }}>
                                  {m.marks}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">{m.maxMarks}</td>
                                <td className="px-4 py-3">
                                  <span
                                    className="px-2 py-1 rounded text-xs font-bold text-white"
                                    style={{ backgroundColor: getGradeColor(pct) }}
                                  >
                                    {pct >= 90 ? 'A+' : pct >= 75 ? 'B' : pct >= 60 ? 'C' : 'D'} ({pct}%)
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
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

export default ParentDashboard;
