import React from 'react';
import { useParams } from 'react-router-dom';

const EventDetails: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Event Details</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Event ID: {id}</p>
        {/* Add more event details here */}
      </div>
    </div>
  );
};

export default EventDetails; 