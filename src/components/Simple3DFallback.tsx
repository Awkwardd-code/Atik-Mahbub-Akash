'use client';

const Simple3DFallback = () => {
  return (
    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-96 h-96 pointer-events-none">
      <div className="relative w-full h-full">
        {/* Animated gradient orbs */}
        <div className="absolute top-16 right-16 w-32 h-32 bg-linear-to-r from-cyan-500 to-blue-600 rounded-full opacity-60 animate-pulse blur-sm"></div>
        <div className="absolute top-32 right-32 w-24 h-24 bg-linear-to-r from-purple-500 to-pink-600 rounded-full opacity-40 animate-bounce blur-sm"></div>
        <div className="absolute bottom-16 right-8 w-20 h-20 bg-linear-to-r from-blue-500 to-indigo-600 rounded-full opacity-50 animate-ping blur-sm"></div>
        
        {/* Floating elements */}
        <div className="absolute top-8 right-24 w-8 h-8 bg-cyan-400 rotate-45 opacity-70 animate-spin" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-8 right-16 w-6 h-6 bg-purple-400 opacity-60 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 right-4 w-4 h-4 bg-blue-400 rounded-full opacity-80 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

export default Simple3DFallback;
