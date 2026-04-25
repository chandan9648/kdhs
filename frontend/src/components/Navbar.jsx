import React from 'react';

const Navbar = ({ role, toggleSidebar, isSidebarOpen }) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu for Mobile */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-2xl hover:bg-blue-700 p-2 rounded"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
        <div className="text-lg md:text-xl font-bold truncate">
          🎓 School ERP - {role.charAt(0).toUpperCase() + role.slice(1)} Panel
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-3 md:px-4 py-2 rounded font-semibold text-sm md:text-base"
      >
        🚪 Logout
      </button>
    </nav>
  );
};

export default Navbar;
