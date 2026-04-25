import React from 'react';

const Sidebar = ({ role }) => {
  return (
    <div className="w-64 bg-blue-900 text-white p-6 shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">🎓 ERP</h2>
      </div>

      <div className="space-y-4">
        <h3 className="text-gray-400 text-sm font-semibold uppercase">Menu</h3>

        {role === 'student' && (
          <>
            <div className="p-3 rounded hover:bg-blue-800 cursor-pointer">
              👤 Profile
            </div>
            <div className="p-3 rounded hover:bg-blue-800 cursor-pointer">
              📅 Attendance
            </div>
            <div className="p-3 rounded hover:bg-blue-800 cursor-pointer">
              📊 Marks
            </div>
          </>
        )}

        {role === 'teacher' && (
          <>
            <div className="p-3 rounded hover:bg-blue-800 cursor-pointer">
              📅 Mark Attendance
            </div>
            <div className="p-3 rounded hover:bg-blue-800 cursor-pointer">
              📊 Upload Marks
            </div>
            <div className="p-3 rounded hover:bg-blue-800 cursor-pointer">
              👨‍🎓 View Students
            </div>
          </>
        )}

        {role === 'admin' && (
          <>
            <div className="p-3 rounded hover:bg-blue-800 cursor-pointer">
              👨‍🎓 Manage Students
            </div>
            <div className="p-3 rounded hover:bg-blue-800 cursor-pointer">
              👩‍🏫 Manage Teachers
            </div>
            <div className="p-3 rounded hover:bg-blue-800 cursor-pointer">
              📊 Reports
            </div>
            <div className="p-3 rounded hover:bg-blue-800 cursor-pointer">
              ⚙️ Settings
            </div>
          </>
        )}
      </div>

      <div className="mt-12 pt-6 border-t border-blue-800">
        <p className="text-gray-400 text-sm">© 2026 School ERP</p>
      </div>
    </div>
  );
};

export default Sidebar;
