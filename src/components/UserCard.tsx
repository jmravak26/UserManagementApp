import React from 'react';
import PropTypes from 'prop-types';
import type { User } from '../types/User';
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
        <div className="name">{user.name}</div>
        <div className="email">{user.email}</div>
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
  }).isRequired,
  onClick: PropTypes.func,
};

export default UserCard;