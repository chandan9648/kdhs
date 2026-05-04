import React, { useState, useEffect } from 'react';
import client from '../api/client';

// Eye icon SVGs (no library needed)
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className="w-5 h-5">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// Reusable password field with show/hide toggle
const PasswordInput = ({ id, value, onChange, placeholder, extraClass = '' }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${extraClass}`}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
        tabIndex={-1}
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
};

const ProfileSettings = () => {
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [name, setName] = useState(storedUser.name || '');
  const [email, setEmail] = useState(storedUser.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showPassSection, setShowPassSection] = useState(false);

  useEffect(() => {
    if (message.text) {
      const t = setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (showPassSection) {
      if (!currentPassword) return setMessage({ text: 'Please enter your current password.', type: 'error' });
      if (newPassword.length < 6) return setMessage({ text: 'New password must be at least 6 characters.', type: 'error' });
      if (newPassword !== confirmPassword) return setMessage({ text: 'New passwords do not match.', type: 'error' });
    }

    const payload = { name, email };
    if (showPassSection && currentPassword && newPassword) {
      payload.currentPassword = currentPassword;
      payload.newPassword = newPassword;
    }

    try {
      setLoading(true);
      const res = await client.put('/api/auth/profile', payload);
      localStorage.setItem('user', JSON.stringify(res.data.user));
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
        <div className={`mb-5 px-4 py-3 rounded-lg text-sm font-medium border ${
          message.type === 'success'
            ? 'bg-green-50 border-green-300 text-green-800'
            : 'bg-red-50 border-red-300 text-red-800'
        }`}>
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
              <PasswordInput
                id="profile-current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">New Password</label>
              <PasswordInput
                id="profile-new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Confirm New Password</label>
              <PasswordInput
                id="profile-confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                extraClass={
                  confirmPassword && confirmPassword !== newPassword
                    ? 'border-red-400 focus:ring-red-300'
                    : ''
                }
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
