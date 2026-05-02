import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileSettings = () => {
  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [name, setName] = useState(storedUser.name || '');
  const [email, setEmail] = useState(storedUser.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'
  const [showPassSection, setShowPassSection] = useState(false);

  // Auto-clear message after 4 s
  useEffect(() => {
    if (message.text) {
      const t = setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    // Validate password fields if the user wants to change password
    if (showPassSection) {
      if (!currentPassword) {
        return setMessage({ text: 'Please enter your current password.', type: 'error' });
      }
      if (newPassword.length < 6) {
        return setMessage({ text: 'New password must be at least 6 characters.', type: 'error' });
      }
      if (newPassword !== confirmPassword) {
        return setMessage({ text: 'New passwords do not match.', type: 'error' });
      }
    }

    const payload = { name, email };
    if (showPassSection && currentPassword && newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    try {
      setLoading(true);
      const res = await axios.put('/api/auth/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update localStorage so the rest of the app stays in sync
      const updatedUser = res.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPassSection(false);
      setMessage({ text: '✅ Profile updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: `❌ ${err.response?.data?.message || 'Update failed'}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const role = storedUser.role || localStorage.getItem('role') || 'user';
  const roleColors = {
    admin: 'from-blue-600 to-indigo-700',
    teacher: 'from-green-500 to-teal-600',
    student: 'from-orange-500 to-amber-600',
    parent: 'from-purple-600 to-indigo-600',
  };
  const gradient = roleColors[role] || 'from-blue-600 to-indigo-700';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Profile header card */}
      <div className={`bg-gradient-to-r ${gradient} rounded-2xl shadow-lg p-6 text-white mb-6`}>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-3xl font-bold select-none">
            {name.charAt(0).toUpperCase() || '?'}
          </div>
          <div>
            <p className="text-xs text-white text-opacity-70 uppercase tracking-wider mb-0.5">
              {role.charAt(0).toUpperCase() + role.slice(1)} Account
            </p>
            <h2 className="text-2xl font-bold leading-tight">{name}</h2>
            <p className="text-sm text-white text-opacity-80">{email}</p>
          </div>
        </div>
      </div>

      {/* Alert */}
      {message.text && (
        <div
          className={`mb-5 px-4 py-3 rounded-lg text-sm font-medium border ${
            message.type === 'success'
              ? 'bg-green-50 border-green-300 text-green-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Form card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-5">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-3">✏️ Edit Profile</h3>

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="Your full name"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Email Address</label>
          <input
            id="profile-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            placeholder="you@example.com"
            required
          />
        </div>

        {/* Change Password Toggle */}
        <div>
          <button
            type="button"
            id="toggle-change-password"
            onClick={() => setShowPassSection((p) => !p)}
            className="text-sm font-semibold text-blue-600 hover:underline focus:outline-none"
          >
            {showPassSection ? '▲ Hide password change' : '🔒 Change Password'}
          </button>
        </div>

        {/* Password section (collapsible) */}
        {showPassSection && (
          <div className="space-y-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Current Password</label>
              <input
                id="profile-current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Enter current password"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">New Password</label>
              <input
                id="profile-new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Confirm New Password</label>
              <input
                id="profile-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  confirmPassword && confirmPassword !== newPassword
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-gray-300 focus:ring-blue-400'
                }`}
                placeholder="Repeat new password"
              />
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords don't match</p>
              )}
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          id="profile-save-btn"
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Saving…' : '💾 Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
