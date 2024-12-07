import React from 'react';

interface StatusMessageProps {
  type: 'error' | 'success';
  message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ type, message }) => {
  const styles = {
    error: 'text-red-400 bg-red-900/20',
    success: 'text-green-400 bg-green-900/20'
  };

  return (
    <div className={`${styles[type]} text-sm p-3 rounded-lg`}>
      {message}
    </div>
  );
};

export default StatusMessage;