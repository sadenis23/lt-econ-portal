import ProtectedRoute from '@/components/atoms/ProtectedRoute';
import { motion } from 'framer-motion';
import { FaChartLine, FaUsers, FaFileAlt, FaCog } from 'react-icons/fa';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-primary mb-2">Dashboard</h1>
            <p className="text-lg text-gray-600">Welcome to your personalized dashboard</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 border border-blue-100"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-primary">24</p>
                </div>
                <FaFileAlt className="w-8 h-8 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 border border-blue-100"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-primary">1,234</p>
                </div>
                <FaUsers className="w-8 h-8 text-green-500" />
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 border border-blue-100"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                  <p className="text-2xl font-bold text-primary">+12.5%</p>
                </div>
                <FaChartLine className="w-8 h-8 text-orange-500" />
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 border border-blue-100"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Settings</p>
                  <p className="text-2xl font-bold text-primary">8</p>
                </div>
                <FaCog className="w-8 h-8 text-purple-500" />
              </div>
            </motion.div>
          </motion.div>

          {/* Content Grid */}
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Recent Activity */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 border border-blue-100"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-xl font-bold text-primary mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: 'Report viewed', time: '2 minutes ago', type: 'view' },
                  { action: 'Data exported', time: '1 hour ago', type: 'export' },
                  { action: 'Settings updated', time: '3 hours ago', type: 'settings' },
                  { action: 'New login', time: '1 day ago', type: 'login' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.action}</p>
                      <p className="text-sm text-gray-500">{item.time}</p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      item.type === 'view' ? 'bg-blue-500' :
                      item.type === 'export' ? 'bg-green-500' :
                      item.type === 'settings' ? 'bg-purple-500' : 'bg-orange-500'
                    }`} />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 border border-blue-100"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-xl font-bold text-primary mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Create Report', icon: '📊', color: 'bg-blue-500' },
                  { title: 'Export Data', icon: '📤', color: 'bg-green-500' },
                  { title: 'View Analytics', icon: '📈', color: 'bg-orange-500' },
                  { title: 'Settings', icon: '⚙️', color: 'bg-purple-500' },
                ].map((action, index) => (
                  <motion.button
                    key={index}
                    className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="text-2xl mb-2">{action.icon}</div>
                    <div className="text-sm font-medium">{action.title}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 