import React from 'react';
import PropTypes from 'prop-types';
import { UserRole } from '../types/User';
import './RoleBadge.css';

type Props = {
  role: UserRole;
};

// Component to display user role as a colored badge
const RoleBadge: React.FC<Props> = ({ role }) => {
  // Get CSS class based on role for different styling
  const getRoleClass = (role: UserRole): string => {
    switch (role) {
      case UserRole.ADMIN:
        return 'role-badge admin'; // Red badge for admin
      case UserRole.MANAGER:
        return 'role-badge manager'; // Blue badge for manager
      case UserRole.USER:
        return 'role-badge user'; // Green badge for regular user
      default:
        return 'role-badge user';
    }
  };

  return (
    <span className={getRoleClass(role)}>
      {role}
    </span>
  );
};

// PropTypes validation as requested in requirements
(RoleBadge as any).propTypes = {
  role: PropTypes.oneOf(Object.values(UserRole)).isRequired,
};

export default RoleBadge;