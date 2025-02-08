export default function Loading() {
  return (
    <div className="min-h-screen bg-sandbeige-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          {/* Loading Spinner */}
          <div className="w-16 h-16 border-4 border-sandbeige-200 border-t-sandbeige-800 rounded-full animate-spin"></div>
          
          {/* Logo in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-sandbeige-800">iYo</span>
          </div>
        </div>
        
        <p className="mt-4 text-sandbeige-600 animate-pulse">
          Loading amazing things...
        </p>
      </div>
    </div>
  );
}
