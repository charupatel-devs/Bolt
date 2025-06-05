import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats } from '../../store/slices/adminSlice';

const DashboardStats = () => {
  const dispatch = useDispatch();
  const { stats } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  if (!stats) {
    return <div className="text-center py-4">Loading stats...</div>;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      color: 'bg-blue-500',
      icon: '👥'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      color: 'bg-green-500',
      icon: '✅'
    },
    {
      title: 'Admin Users',
      value: stats.adminUsers,
      color: 'bg-purple-500',
      icon: '👨‍💼'
    },
    {
      title: 'New This Month',
      value: stats.recentUsers,
      color: 'bg-orange-500',
      icon: '🆕'
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full text-white text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;