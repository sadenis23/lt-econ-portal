export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="bg-white bg-opacity-80 border border-blue-100 shadow-2xl rounded-2xl p-8 max-w-md mx-auto flex flex-col gap-6 backdrop-blur-md text-center">
        <h1 className="text-3xl font-extrabold text-red-600 mb-2">Unauthorized</h1>
        <p className="text-lg text-primary">You do not have permission to view this page.</p>
      </div>
    </div>
  );
} 