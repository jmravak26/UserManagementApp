import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { UserRole } from '../types/User';
import type { User } from '../types/User';
import { exportUsersToCSV } from '../utils/csvExport';
import './BulkActionsToolbar.css';

type Props = {
  selectedCount: number;
  selectedUsers: User[];
  currentUserRole: UserRole | null;
  onBulkDelete: () => void;
  onBulkRoleChange: (role: UserRole) => void;
  onDeselectAll: () => void;
};

const BulkActionsToolbar: React.FC<Props> = ({
  selectedCount,
  selectedUsers,
  currentUserRole,
  onBulkDelete,
  onBulkRoleChange,
  onDeselectAll
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.USER);

  const canDelete = currentUserRole === UserRole.ADMIN;
  const canAssignRoles = currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.MANAGER;

  const handleExportCSV = () => {
    exportUsersToCSV(selectedUsers, `selected_users_${selectedCount}_${Date.now()}.csv`);
  };

  const handleDeleteConfirm = () => {
    onBulkDelete();
    setShowDeleteConfirm(false);
  };

  const handleRoleChange = () => {
    onBulkRoleChange(selectedRole);
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bulk-actions-toolbar">
      <div className="bulk-info">
        <span className="selected-count">{selectedCount} user{selectedCount !== 1 ? 's' : ''} selected</span>
        <button className="deselect-btn" onClick={onDeselectAll}>
          Clear selection
        </button>
      </div>

      <div className="bulk-actions">
        <button className="export-btn" onClick={handleExportCSV}>
          📊 Export CSV
        </button>

        {canAssignRoles && (
          <div className="role-assignment">
            <select 
              value={selectedRole} 
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              className="role-select"
            >
              <option value={UserRole.USER}>{UserRole.USER}</option>
              <option value={UserRole.MANAGER}>{UserRole.MANAGER}</option>
              <option value={UserRole.ADMIN}>{UserRole.ADMIN}</option>
            </select>
            <button className="assign-role-btn" onClick={handleRoleChange}>
              Assign Role
            </button>
          </div>
        )}

        {canDelete && (
          <button 
            className="delete-btn" 
            onClick={() => setShowDeleteConfirm(true)}
          >
            🗑️ Delete Selected
          </button>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <div className="confirmation-content">
            <p>Are you sure you want to delete {selectedCount} user{selectedCount !== 1 ? 's' : ''}?</p>
            <div className="confirmation-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={handleDeleteConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

(BulkActionsToolbar as any).propTypes = {
  selectedCount: PropTypes.number.isRequired,
  selectedUsers: PropTypes.array.isRequired,
  currentUserRole: PropTypes.oneOf(Object.values(UserRole)),
  onBulkDelete: PropTypes.func.isRequired,
  onBulkRoleChange: PropTypes.func.isRequired,
  onDeselectAll: PropTypes.func.isRequired,
};

export default BulkActionsToolbar;