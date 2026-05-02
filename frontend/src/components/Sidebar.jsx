import React from 'react';

const menuItem = (label, tab, onTabChange, toggleSidebar) => (
  <div
    onClick={() => {
      if (onTabChange) onTabChange(tab);
      if (toggleSidebar) toggleSidebar();
    }}
    className="p-3 rounded hover:bg-blue-800 cursor-pointer transition"
  >
    {label}
  </div>
);

const Sidebar = ({ role, isOpen, onTabChange, toggleSidebar }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative w-64 bg-blue-900 text-white p-6 shadow-lg h-screen overflow-y-auto transition-transform duration-300 z-40 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold">🎓 ERP</h2>
        </div>

        {/* ── Main Menu ── */}
        <div className="space-y-1">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Menu</h3>

          {role === 'student' && (
            <>
              {menuItem('👤 Profile', 'profile', onTabChange, toggleSidebar)}
              {menuItem('📅 Attendance', 'attendance', onTabChange, toggleSidebar)}
              {menuItem('📊 Marks', 'marks', onTabChange, toggleSidebar)}
            </>
          )}

          {role === 'teacher' && (
            <>
              {menuItem('📅 Mark Attendance', 'attendance', onTabChange, toggleSidebar)}
              {menuItem('📊 Upload Marks', 'marks', onTabChange, toggleSidebar)}
              <div className="p-3 rounded hover:bg-blue-800 cursor-pointer transition">
                👨‍🎓 View Students
              </div>
            </>
          )}

          {role === 'admin' && (
            <>
              {menuItem('👨‍🎓 Manage Students', 'students', onTabChange, toggleSidebar)}
              {menuItem('👩‍🏫 Manage Teachers', 'teachers', onTabChange, toggleSidebar)}
              {menuItem('👨‍👩‍👧 Manage Parents', 'parents', onTabChange, toggleSidebar)}
              {menuItem('📊 Reports', 'reports', onTabChange, toggleSidebar)}
            </>
          )}

          {role === 'parent' && (
            <>
              {menuItem('🏠 Overview', 'overview', onTabChange, toggleSidebar)}
              {menuItem('📅 Attendance', 'attendance', onTabChange, toggleSidebar)}
              {menuItem('📊 Marks', 'marks', onTabChange, toggleSidebar)}
            </>
          )}
        </div>

        {/* ── More Section ── */}
        <div className="mt-6 pt-5 border-t border-blue-800 space-y-1">
          <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">More</h3>
          <div
            id="sidebar-profile-settings"
            onClick={() => {
              if (onTabChange) onTabChange('more');
              if (toggleSidebar) toggleSidebar();
            }}
            className="p-3 rounded hover:bg-blue-800 cursor-pointer transition flex items-center gap-2"
          >
            ⚙️ My Profile
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-blue-800">
          <p className="text-gray-400 text-xs">© 2026 School ERP</p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
