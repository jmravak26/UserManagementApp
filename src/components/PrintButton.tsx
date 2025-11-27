import React from 'react';
import PropTypes from 'prop-types';
import type { User } from '../types/User';
import { printUserDirectory } from '../utils/printDirectory';
import './PrintButton.css';

interface PrintButtonProps {
  allUsers: User[];
  selectedUsers: User[];
}

const PrintButton: React.FC<PrintButtonProps> = ({ allUsers, selectedUsers }) => {
  const handlePrint = () => {
    const usersToPrint = selectedUsers.length > 0 ? selectedUsers : allUsers;
    printUserDirectory(usersToPrint);
  };

  return (
    <button 
      className="btn btn-print" 
      onClick={handlePrint} 
      title={selectedUsers.length > 0 ? `Print ${selectedUsers.length} selected users` : 'Print all users'}
    >
      🖨️ Print {selectedUsers.length > 0 ? `(${selectedUsers.length})` : ''}
    </button>
  );
};

PrintButton.propTypes = {
  allUsers: PropTypes.array.isRequired,
  selectedUsers: PropTypes.array.isRequired
};

export default PrintButton;
