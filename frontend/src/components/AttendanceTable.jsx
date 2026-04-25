import React from 'react';

const AttendanceTable = ({ attendance }) => {
  if (!attendance || attendance.length === 0) {
    return <div className="text-center text-gray-500 p-4">No attendance data</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2 text-left">Date</th>
            <th className="border px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record._id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">
                {new Date(record.date).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                <span
                  className={`px-3 py-1 rounded text-white font-semibold ${
                    record.status === 'present' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {record.status === 'present' ? '✅ Present' : '❌ Absent'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
