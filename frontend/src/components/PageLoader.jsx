import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      {/* Classic circular spinner — no text */}
      <div
        className="w-14 h-14 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin"
        style={{ animationDuration: '0.75s' }}
      />
    </div>
  );
};

export default PageLoader;
