
import {
  FaMoneyBillWave,
  FaSignInAlt,
  FaList,
  FaChartPie,
  FaQuoteLeft,
} from "react-icons/fa";
import { IoIosStats } from "react-icons/io";
import { FaFilter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const HeroSection = () => {
  // Check if the user is logged in (using localStorage for simplicity)
  //const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Heading */}
          <h1 className="text-5xl font-bold text-center">
            Track Your Expenses Effortlessly
          </h1>
          <h2 className="text-5xl font-bold text-center">
                 with MoneyBuddy
          </h2>

          {/* Subheading */}
          <p className="mt-4 text-xl text-center">
            Manage your finances with a modern solution designed for you.
          </p>

          {/* Feature Icons */}
          <div className="flex space-x-8 mt-10">
            <div className="flex flex-col items-center">
              <FaMoneyBillWave className="text-3xl" />
              <p className="mt-2">Efficient Tracking</p>
            </div>
            <div className="flex flex-col items-center">
              <FaFilter className="text-3xl" />
              <p className="mt-2">Transactions Filtering</p>
            </div>
            <div className="flex flex-col items-center">
              <IoIosStats className="text-3xl" />
              <p className="mt-2">Insightful Reports</p>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="mt-8 space-x-4">
            {/* If user is not logged in, show Sign Up / Login */}
              <>
                <Link to="/register">
                  <button className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-400 transition duration-300">
                    Get Started
                  </button>
                </Link>
                <Link to="/login">
                  <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-400 transition duration-300">
                    Login (Already have an account)
                  </button>
                </Link>
              </>
            
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800">How It Works</h2>
        <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-teal-500 text-white mb-4">
              <FaSignInAlt className="text-xl" />
            </div>
            <h3 className="mb-2 font-semibold">Sign Up</h3>
            <p>Register and start managing your expenses in a minute.</p>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-orange-500 text-white mb-4">
              <FaList className="text-xl" />
            </div>
            <h3 className="mb-2 font-semibold">Add Transactions</h3>
            <p>Quickly add income and expenses to your account.</p>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-purple-500 text-white mb-4">
              <FaChartPie className="text-xl" />
            </div>
            <h3 className="mb-2 font-semibold">View Reports</h3>
            <p>See insightful reports & graphs of your finances.</p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-100 py-20 px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          What Our Users Say
        </h2>
        <div className="mt-10 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaQuoteLeft className="text-xl text-gray-400" />
            <p className="mt-4">
              &ldquo;This app has revolutionized the way I track my expenses. Highly intuitive and user-friendly.&ldquo;
            </p>
            <p className="mt-4 font-bold">- Jane Doe</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <FaQuoteLeft className="text-xl text-gray-400" />
            <p className="mt-4">
              &ldquo;Finally, a hassle-free way to manage my finances. The insights feature is a game changer!&quot;
            </p>
            <p className="mt-4 font-bold">- John Smith</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="mt-4">
            Join us now and start managing your expenses like a pro!
          </p>
          <Link to="/register">
            <button className="mt-8 px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-400 transition duration-300">
              Sign Up For Free
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
