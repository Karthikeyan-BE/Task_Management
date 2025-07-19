import React from 'react';
import { LoaderCircle } from 'lucide-react';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <LoaderCircle className="animate-spin w-8 h-8 text-blue-500 mb-2" />
      <p className="text-blue-600 font-medium">{message}</p>
    </div>
  );
};

export default Loading;
