import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [attendanceReport, setAttendanceReport] = useState(null);
  const [marksReport, setMarksReport] = useState(null);
  const [selectedClass, setSelectedClass] = useState('10A');
  const [reportType, setReportType] = useState('attendance');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');
  const classes = ['10A', '10B', '12A', '12B'];

  useEffect(() => {
    if (reportType === 'attendance') {
      fetchAttendanceReport();
    } else {
      fetchMarksReport();
    }
  }, [selectedClass, reportType]);

  const fetchAttendanceReport = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(
        `/api/admin/reports/attendance?className=${selectedClass}`,
        config
      );
      setAttendanceReport(res.data.report);
    } catch (error) {
      console.error('Error fetching attendance report:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarksReport = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(
        `/api/admin/reports/marks?className=${selectedClass}`,
        config
      );
      setMarksReport(res.data.marks);
    } catch (error) {
      console.error('Error fetching marks report:', error);
    } finally {
      setLoading(false);
    }
  };

  // Attendance Chart Data
  const getAttendanceChartData = () => {
    if (!attendanceReport || attendanceReport.length === 0) return null;

    const labels = attendanceReport.map((item) =>
      item.student?.userId?.name || 'Unknown'
    );
    const attendancePercentages = attendanceReport.map(
      (item) => parseFloat(item.attendancePercentage) || 0
    );
    const presentDays = attendanceReport.map((item) => item.presentDays);
    const totalDays = attendanceReport.map((item) => item.totalDays);

    return {
      labels,
      datasets: [
        {
          label: 'Attendance %',
          data: attendancePercentages,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
        },
      ],
    };
  };

  // Marks Chart Data
  const getMarksChartData = () => {
    if (!marksReport || marksReport.length === 0) return null;

    const subjects = [...new Set(marksReport.map((m) => m.subject))];
    const studentNames = [...new Set(marksReport.map((m) => m.studentId?.userId?.name || 'Unknown'))];

    // Create datasets for each subject
    const datasets = subjects.map((subject, idx) => {
      const colors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ];

      const data = studentNames.map((student) => {
        const mark = marksReport.find(
          (m) => m.subject === subject && m.studentId?.userId?.name === student
        );
        return mark ? mark.marks : 0;
      });

      return {
        label: subject,
        data,
        backgroundColor: colors[idx % colors.length],
        borderColor: colors[idx % colors.length].replace('0.6', '1'),
        borderWidth: 1,
      };
    });

    return {
      labels: studentNames,
      datasets,
    };
  };

  // Summary Statistics
  const getAttendanceSummary = () => {
    if (!attendanceReport || attendanceReport.length === 0) return null;

    const totalStudents = attendanceReport.length;
    const avgAttendance = (
      attendanceReport.reduce((sum, item) => sum + parseFloat(item.attendancePercentage), 0) /
      totalStudents
    ).toFixed(2);
    const studentsBelow75 = attendanceReport.filter(
      (item) => parseFloat(item.attendancePercentage) < 75
    ).length;

    return { totalStudents, avgAttendance, studentsBelow75 };
  };

  const getMarksSummary = () => {
    if (!marksReport || marksReport.length === 0) return null;

    const totalMarks = marksReport.reduce((sum, item) => sum + item.marks, 0);
    const avgMarks = (totalMarks / marksReport.length).toFixed(2);
    const highestMark = Math.max(...marksReport.map((m) => m.marks));
    const lowestMark = Math.min(...marksReport.map((m) => m.marks));

    return { avgMarks, highestMark, lowestMark, totalRecords: marksReport.length };
  };

  // Pie Chart for Attendance Distribution
  const getAttendanceDistribution = () => {
    if (!attendanceReport || attendanceReport.length === 0) return null;

    const excellent = attendanceReport.filter(
      (item) => parseFloat(item.attendancePercentage) >= 90
    ).length;
    const good = attendanceReport.filter(
      (item) =>
        parseFloat(item.attendancePercentage) >= 75 &&
        parseFloat(item.attendancePercentage) < 90
    ).length;
    const average = attendanceReport.filter(
      (item) =>
        parseFloat(item.attendancePercentage) >= 60 &&
        parseFloat(item.attendancePercentage) < 75
    ).length;
    const poor = attendanceReport.filter(
      (item) => parseFloat(item.attendancePercentage) < 60
    ).length;

    return {
      labels: ['Excellent (90%+)', 'Good (75-89%)', 'Average (60-74%)', 'Poor (<60%)'],
      datasets: [
        {
          data: [excellent, good, average, poor],
          backgroundColor: [
            'rgba(75, 192, 75, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(255, 99, 132, 0.8)',
          ],
          borderColor: [
            'rgba(75, 192, 75, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 2,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-8">Loading reports...</div>;
  }

  return (
    <div>
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="attendance">📅 Attendance Report</option>
              <option value="marks">📊 Marks Report</option>
            </select>
          </div>

          <div>
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
        </div>
      </div>

      {/* Attendance Reports */}
      {reportType === 'attendance' && attendanceReport && (
        <>
          {/* Statistics Cards */}
          {getAttendanceSummary() && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-blue-500">
                  {getAttendanceSummary().totalStudents}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600 text-sm">Average Attendance</p>
                <p className="text-3xl font-bold text-green-500">
                  {getAttendanceSummary().avgAttendance}%
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600 text-sm">Students Below 75%</p>
                <p className="text-3xl font-bold text-red-500">
                  {getAttendanceSummary().studentsBelow75}
                </p>
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            {getAttendanceChartData() && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">📊 Attendance % by Student</h3>
                <Bar data={getAttendanceChartData()} options={chartOptions} />
              </div>
            )}

            {/* Pie Chart */}
            {getAttendanceDistribution() && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold mb-4">🥧 Attendance Distribution</h3>
                <Pie
                  data={getAttendanceDistribution()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>

          {/* Detailed Table */}
          <div className="bg-white rounded-lg shadow mt-6 overflow-hidden">
            <h3 className="text-lg font-bold p-6 border-b">📋 Detailed Attendance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Student Name</th>
                    <th className="px-4 py-2 text-left">Total Days</th>
                    <th className="px-4 py-2 text-left">Present</th>
                    <th className="px-4 py-2 text-left">Absent</th>
                    <th className="px-4 py-2 text-left">Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceReport.map((item, idx) => (
                    <tr key={idx} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{item.student?.userId?.name || 'N/A'}</td>
                      <td className="px-4 py-2">{item.totalDays}</td>
                      <td className="px-4 py-2 text-green-600 font-semibold">
                        {item.presentDays}
                      </td>
                      <td className="px-4 py-2 text-red-600 font-semibold">
                        {item.absentDays}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded font-bold text-white ${
                            parseFloat(item.attendancePercentage) >= 75
                              ? 'bg-green-500'
                              : 'bg-red-500'
                          }`}
                        >
                          {item.attendancePercentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Marks Reports */}
      {reportType === 'marks' && marksReport && (
        <>
          {/* Statistics Cards */}
          {getMarksSummary() && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600 text-sm">Avg Marks</p>
                <p className="text-3xl font-bold text-blue-500">{getMarksSummary().avgMarks}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600 text-sm">Highest Mark</p>
                <p className="text-3xl font-bold text-green-500">
                  {getMarksSummary().highestMark}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600 text-sm">Lowest Mark</p>
                <p className="text-3xl font-bold text-red-500">
                  {getMarksSummary().lowestMark}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600 text-sm">Total Records</p>
                <p className="text-3xl font-bold text-purple-500">
                  {getMarksSummary().totalRecords}
                </p>
              </div>
            </div>
          )}

          {/* Bar Chart - Marks by Subject */}
          {getMarksChartData() && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-bold mb-4">📊 Marks Distribution</h3>
              <Bar data={getMarksChartData()} options={chartOptions} />
            </div>
          )}

          {/* Detailed Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <h3 className="text-lg font-bold p-6 border-b">📋 Detailed Marks</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Student</th>
                    <th className="px-4 py-2 text-left">Subject</th>
                    <th className="px-4 py-2 text-left">Exam</th>
                    <th className="px-4 py-2 text-left">Marks</th>
                    <th className="px-4 py-2 text-left">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {marksReport.map((mark, idx) => {
                    const marks = mark.marks;
                    let grade = 'F';
                    if (marks >= 90) grade = 'A+';
                    else if (marks >= 80) grade = 'A';
                    else if (marks >= 70) grade = 'B';
                    else if (marks >= 60) grade = 'C';
                    else if (marks >= 50) grade = 'D';

                    return (
                      <tr key={idx} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{mark.studentId?.userId?.name || 'N/A'}</td>
                        <td className="px-4 py-2">{mark.subject}</td>
                        <td className="px-4 py-2">{mark.examType.toUpperCase()}</td>
                        <td className="px-4 py-2 font-bold">{mark.marks}/100</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-3 py-1 rounded font-bold text-white ${
                              grade === 'A+' || grade === 'A'
                                ? 'bg-green-500'
                                : grade === 'B'
                                ? 'bg-blue-500'
                                : grade === 'C'
                                ? 'bg-yellow-500'
                                : grade === 'D'
                                ? 'bg-orange-500'
                                : 'bg-red-500'
                            }`}
                          >
                            {grade}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!attendanceReport && !marksReport && reportType === 'attendance' && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No attendance data available for {selectedClass}</p>
        </div>
      )}

      {!marksReport && reportType === 'marks' && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">No marks data available for {selectedClass}</p>
        </div>
      )}
    </div>
  );
};

export default Reports;
