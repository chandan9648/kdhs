import React from 'react';

const Sidebar = ({ role, isOpen }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30" />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative w-64 bg-blue-900 text-white p-6 shadow-lg h-screen overflow-y-auto transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold">🎓 ERP</h2>
        </div>

        <div className="space-y-4">
          <h3 className="text-gray-400 text-sm font-semibold uppercase">Menu</h3>

          {role === 'student' && (
            <>
              <div className="p-3 rounded hover:bg-blue-800 cursor-pointer transition">
                👤 Profile
              </div>
              <div className="p-3 rounded hover:bg-blue-800 cursor-pointer transition">
                📅 Attendance
              </div>
              <div className="p-3 rounded hover:bg-blue-800 cursor-pointer transition">
                📊 Marks
              </div>
            </>
          )}

          {role === 'teacher' && (
            <>
              <div className="p-3 rounded hover:bg-blue-800 cursor-pointer transition">
                📅 Mark Attendance
              </div>
              <div className="p-3 rounded hover:bg-blue-800 cursor-pointer transition">
                📊 Upload Marks
              </div>
              <div className="p-3 rounded hover:bg-blue-800 cursor-pointer transition">
                👨‍🎓 View Students
              </div>
            </>
          )}

          {role === 'admin' && (
            <>
              <div className="p-3 rounded hover:bg-blue-800 cursor-pointer transition">
                👨‍🎓 Manage Students
              </div>
              <div className="p-3 rounded hover:bg-blue-800 cursor-pointer transition">
                👩‍🏫 Manage Teachers
              </div>
              <div className="p-3 rounded hover:bg-blue-800 cursor-pointer transition">
                📊 Reports
              </div>
              <div className="p-3 rounded hover:bg-blue-800 cursor-pointer transition">
                ⚙️ Settings
              </div>
            </>
          )}
        </div>

        <div className="mt-12 pt-6 border-t border-blue-800">
          <p className="text-gray-400 text-sm">© 2026 School ERP</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
