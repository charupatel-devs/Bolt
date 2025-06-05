import { useSelector } from 'react-redux';
import Navbar from '../../components/common/Navbar';

const Home = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Welcome to MyApp
          </h1>
          
          {isAuthenticated ? (
            <div className="mt-8">
              <p className="text-xl text-gray-600 mb-4">
                Hello, {user?.username}! You are logged in as a {user?.role}.
              </p>
              
              <div className="bg-white shadow rounded-lg p-6 mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Your Dashboard
                </h2>
                <p className="text-gray-600">
                  This is your personalized dashboard. Here you can access your account features and settings.
                </p>
                
                {user?.role === 'admin' && (
                  <div className="mt-6">
                    <a
                      href="/admin"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Go to Admin Panel
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <p className="text-xl text-gray-600 mb-8">
                Please sign in to access your personalized dashboard and features.
              </p>
              
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <a
                  href="/login"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Sign Up
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
