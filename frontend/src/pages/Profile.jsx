import  { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({ username: '', email: '' });
  const navigate = useNavigate(); // Hook for navigation

  // Fetch the user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('https://moneybuddy.onrender.com/api/v1/users/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  // Navigate back to the dashboard
  const handleBackClick = () => {
    navigate('/dashboard'); // Adjust path if necessary
  };

  return (
    <div className="min-h-screen bg-gray-800 flex justify-center items-center">
      <div className="container mx-auto p-4">
        
   {/* Back Button */}
   <div className="mb-6  ">
          <button
            onClick={handleBackClick}
            className="bg-red-500 text-white px-6 py-2 rounded-full text-lg shadow-md hover:bg-gray-700 transition duration-300"
          >
            Back to Dashboard
          </button>
        </div>
        <h1 className="text-3xl font-semibold text-center text-white mb-8">Your Profile</h1>

        <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-4xl text-gray-500">👤</span>
            </div>
          </div>

          {/* Display user info */}
          <div className="space-y-6">
            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-600 w-32">Username:</span>
              <span className="text-lg text-gray-800">{user.username}</span>
            </div>

            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-600 w-32">Email:</span>
              <span className="text-lg text-gray-800">{user.email}</span>
            </div>
          </div>

          {/* Profile Edit Button */}
          <div className="mt-6 text-center">
            <Link
              to="/edit-profile"
              className="bg-indigo-600 text-white px-6 py-2 rounded-full text-lg shadow-md hover:bg-indigo-700 transition duration-300"
            >
              Edit Profile
            </Link>
          </div>

          {/* Change Password Button */}
          <div className="mt-6 text-center">
            <Link
              to="/change-password"
              className="bg-indigo-600 text-white px-6 py-2 rounded-full text-lg shadow-md hover:bg-indigo-700 transition duration-300"
            >
              Change Password
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Profile;
