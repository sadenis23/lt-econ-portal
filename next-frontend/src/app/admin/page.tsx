import ProtectedRoute from '../../components/atoms/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
        <div className="bg-white bg-opacity-80 border border-blue-100 shadow-2xl rounded-2xl p-8 max-w-lg mx-auto flex flex-col gap-6 backdrop-blur-md">
          <h1 className="text-3xl font-extrabold text-primary mb-2 text-center">Admin Dashboard</h1>
          <p className="text-lg text-primary text-center">Welcome, admin! Here you can manage users, datasets, and more.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
} 