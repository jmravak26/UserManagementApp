import React from 'react';
import type { User } from '../types/User';
import RoleBadge from './RoleBadge';
import StatusIndicator from './StatusIndicator';
import './UserCard.css';

type Props = {
  user: User;
  onClick?: (user: User) => void;
  isSelected?: boolean;
  onSelectionChange?: (userId: number) => void;
};

const UserCard: React.FC<Props> = ({ user, onClick, isSelected = false, onSelectionChange }) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelectionChange?.(user.id);
  };

  const handleCardClick = () => {
    onClick?.(user);
  };

  return (
    <div className={`user-card ${isSelected ? 'selected' : ''}`} onClick={handleCardClick}>
      {onSelectionChange && (
        <input
          type="checkbox"
          className="user-checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <img
        src={user.avatar}
        alt={`${user.name} avatar`}
        className="avatar"
      />
      <div className="info">
        <div className="name">
          {user.name}
          <RoleBadge role={user.role} />
        </div>
        <div className="email">{user.email}</div>
        <StatusIndicator status={user.status} size="small" />
      </div>
    </div>
  );
};

export default UserCard;