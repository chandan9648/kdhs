import React from 'react';
import { toast } from 'react-toastify';

const Navbar = ({ role, toggleSidebar, isSidebarOpen }) => {
  const handleLogout = () => {
    toast.info('Logged out successfully. See you soon! 👋', { autoClose: 1500 });
    setTimeout(() => {
      localStorage.clear();
      window.location.reload();
    }, 1600);
  };

  return (
    <nav className="bg-blue-600 text-white px-3 py-3 flex justify-between items-center shadow-lg min-w-0">
      <div className="flex items-center gap-2 min-w-0">
        {/* Hamburger Menu for Mobile */}
        <button
          onClick={toggleSidebar}
          className="md:hidden flex-shrink-0 text-xl hover:bg-blue-700 p-2 rounded"
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>
        <div className="text-sm sm:text-base md:text-lg font-bold truncate min-w-0">
          🎓 <span className="hidden sm:inline">School ERP - </span>
          {role.charAt(0).toUpperCase() + role.slice(1)} Panel
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="flex-shrink-0 bg-red-500 hover:bg-red-600 px-2 sm:px-4 py-1.5 sm:py-2 rounded font-semibold text-xs sm:text-sm md:text-base ml-2"
      >
        🚪 <span className="hidden sm:inline">Logout</span><span className="sm:hidden">Exit</span>
      </button>
    </nav>
  );
};

export default Navbar;
