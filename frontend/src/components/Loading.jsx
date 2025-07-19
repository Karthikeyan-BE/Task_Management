import React from 'react';
import { Loader } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Loader className="w-12 h-12 text-blue-600 animate-spin" />
    </div>
  );
};

export default Loading;
