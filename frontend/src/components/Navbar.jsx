import React from 'react';

const Navbar = ({ role }) => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-lg">
      <div className="text-xl font-bold">
        🎓 School ERP - {role.charAt(0).toUpperCase() + role.slice(1)} Panel
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold"
      >
        🚪 Logout
      </button>
    </nav>
  );
};

export default Navbar;
