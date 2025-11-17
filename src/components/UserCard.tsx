import React from 'react';
import PropTypes from 'prop-types';
import type { User } from '../types/User';
import { UserRole, UserStatus } from '../types/User';
import RoleBadge from './RoleBadge';
import StatusIndicator from './StatusIndicator';
import './UserCard.css';

type Props = {
  user: User;
  onClick?: (user: User) => void;
};

const UserCard: React.FC<Props> = ({ user, onClick }) => {
  return (
    <div className="user-card" onClick={() => onClick?.(user)}>
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

(UserCard as any).propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    phone: PropTypes.string,
    role: PropTypes.oneOf(Object.values(UserRole)).isRequired,
    status: PropTypes.oneOf(Object.values(UserStatus)).isRequired,
  }).isRequired,
  onClick: PropTypes.func,
};

export default UserCard;