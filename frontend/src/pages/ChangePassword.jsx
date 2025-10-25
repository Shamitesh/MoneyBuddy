import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();  // Hook to programmatically navigate

  const handleChangePassword = async () => {
    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match.");
      return;
    }

    try {
      // Make the API request to change password
      const response = await axios.put(
        'https://moneybuddy.onrender.com/api/v1/users/change-password', 
        { currentPassword, newPassword },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add your token if needed
          },
        }
      );

      // Clear input fields and any previous error
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordError('');

      // Show success message (optional)
      alert('Password changed successfully!');

      // Navigate to the profile page
      navigate('/profile');  // Navigate to the profile page
    } catch (error) {
      // Handle error (e.g., invalid current password)
      setPasswordError(error.response?.data?.message || 'Error changing password');
      console.error('Error changing password:', error);
    }
  };

  // Handle going back to profile
  const handleBackClick = () => {
    navigate('/profile'); // Navigate to the profile page
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="max-w-3xl w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Change Password</h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-lg font-medium text-gray-700">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-lg font-medium text-gray-700">New Password</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {passwordError && (
            <p className="text-red-500 text-sm mt-2">{passwordError}</p>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="bg-gray-600 text-white px-6 py-2 rounded-full text-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 transition duration-300"
          >
            Back to Profile
          </button>

          {/* Change Password Button */}
          <button
            onClick={handleChangePassword}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full text-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
