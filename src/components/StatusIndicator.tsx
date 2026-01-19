import React from 'react';
import { UserStatus } from '../types/User';
import './StatusIndicator.css';

type Props = {
  status: UserStatus;
  size?: 'small' | 'medium' | 'large';
};

const StatusIndicator: React.FC<Props> = ({ status, size = 'small' }) => {
  
  return (
    <div className={`status-indicator ${status.toLowerCase()} ${size}`}>
      <span className="status-dot"></span>
      <span className="status-text">{status}</span>
    </div>
  );
};

export default StatusIndicator;