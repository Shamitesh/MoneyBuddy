import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
  const [user, setUser] = useState({ username: '', email: '' });
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const navigate = useNavigate();

  // Fetch user profile when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/users/profile', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(response.data);
        setNewUsername(response.data.username);
        setNewEmail(response.data.email);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Handle saving updated profile
  const handleSaveClick = async () => {
    try {
      const response = await axios.put(
        'http://localhost:8000/api/v1/users/update-profile',
        { newUsername, newEmail },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      console.log(response.data);
      setUser({ username: newUsername, email: newEmail });

      // Navigate back to the profile page after successful update
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  // Handle going back to profile
  const handleBackClick = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="max-w-3xl w-full p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Edit Profile</h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-lg font-medium text-gray-700">Username</label>
            <input
              id="username"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          {/* Back Button */}
          <button
            onClick={handleBackClick}
            className="bg-gray-600 text-white px-6 py-2 rounded-full text-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 transition duration-300"
          >
            Back to Profile
          </button>

          {/* Save Changes Button */}
          <button
            onClick={handleSaveClick}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full text-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
