import React from 'react';
import PropTypes from 'prop-types';
import type { User } from '../types/User';
import './UserCard.css';

type Props = { user: User };

const UserCard: React.FC<Props> = ({ user }) => {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={`${user.name} avatar`} className="avatar" />
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
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired
  }).isRequired
};

export default UserCard;