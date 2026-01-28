import React, { useState } from 'react';
import "./UserDetailModal.css";
import type { User } from "../types/User";
import { UserRole, UserStatus } from "../types/User";
import { useAppDispatch } from '../hooks/useAppDispatch';
import { updateUserThunk } from '../store/userSlice';
import { useDatabaseMode } from '../contexts/DatabaseModeContext';
import RoleBadge from './RoleBadge';

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
  canEdit?: boolean;
  onSendEmail?: (user: User) => void;
}

const EXIT_DURATION = 200; // Must match the CSS animation duration (0.2s)

const UserDetailModal: React.FC<UserDetailModalProps> = ({ 
  user, 
  onClose, 
  canEdit = false,
  onSendEmail
}) => {
  const dispatch = useAppDispatch();
  const { mode } = useDatabaseMode();
  const [isExiting, setIsExiting] = useState(false);  
  const [isEditing, setIsEditing] = useState(false);  
  const [editedUser, setEditedUser] = useState<User>(user);

  if (!user) return null;

  const handleClose = () => {
    setIsExiting(true);
    // After the animation duration, truly close the modal (unmount the component)
    setTimeout(onClose, EXIT_DURATION);
  };

  const handleSave = async () => {
    try {
      await dispatch(updateUserThunk({ 
        id: editedUser.id, 
        userData: editedUser, 
        mode 
      })).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update user:', error);
      // Handle error (could show toast notification)
    }
  };

  const handleCancelEdit = () => {
    setEditedUser(user); // Reset to original data
    setIsEditing(false);
  };

  const handleStatusToggle = () => {
    const newStatus = editedUser.status === UserStatus.ACTIVE 
      ? UserStatus.INACTIVE 
      : UserStatus.ACTIVE;
    
    setEditedUser({ ...editedUser, status: newStatus });
  };

  // Prevent closing the modal when clicking on the content
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Combine classes based on the exit state
  const overlayClass = `modal-overlay ${isExiting ? 'exit' : ''}`;
  const contentClass = `modal-content ${isExiting ? 'exit' : ''}`;

  return (
    <div className={overlayClass} onClick={handleClose}>
      <div className={contentClass} onClick={handleContentClick}>
        <div className="modal-header">
          <h2>User Profile</h2>
          <div className="header-actions">
            {onSendEmail && !isEditing && (
              <button className="email-btn" onClick={() => onSendEmail(user)}>
                ✉️ Email
              </button>
            )}
            {canEdit && !isEditing && (
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                ✏️ Edit
              </button>
            )}
            <button className="close-btn" onClick={handleClose}>&times;</button>
          </div>
        </div>

        <img src={editedUser.avatar} alt={editedUser.name} className="detail-avatar" />
        
        {/* User information - either view or edit mode */}
        <div className="user-info">
          {isEditing ? (
            // EDIT MODE
            <>
              <div className="form-group">
                <label><strong>Name:</strong></label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                  className="edit-input"
                />
              </div>
              
              <div className="form-group">
                <label><strong>Email:</strong></label>
                <input
                  type="email"
                  value={editedUser.email}
                  onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                  className="edit-input"
                />
              </div>
              
              <div className="form-group">
                <label><strong>Username:</strong></label>
                <input
                  type="text"
                  value={editedUser.username}
                  onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                  className="edit-input"
                />
              </div>
              
              <div className="form-group">
                <label><strong>Phone:</strong></label>
                <input
                  type="text"
                  value={editedUser.phone || ''}
                  onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                  className="edit-input"
                />
              </div>
              
              <div className="form-group">
                <label><strong>Role:</strong></label>
                <select
                  value={editedUser.role}
                  onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value as UserRole })}
                  className="edit-select"
                >
                  {Object.values(UserRole).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group status-group">
                <label><strong>Status:</strong></label>
                <button
                  onClick={handleStatusToggle}
                  className={`status-toggle ${editedUser.status.toLowerCase()}`}
                >
                  {editedUser.status === UserStatus.ACTIVE ? '🟢' : '🔴'} {editedUser.status}
                </button>
              </div>
              
              <div className="edit-actions">
                <button className="save-btn" onClick={handleSave}>
                  💾 Save Changes
                </button>
                <button className="cancel-btn" onClick={handleCancelEdit}>
                  ❌ Cancel
                </button>
              </div>
            </>
          ) : (
            // VIEW MODE
            <>
              <div className="user-header">
                <h3>
                  {editedUser.name}
                  <RoleBadge role={editedUser.role} />
                </h3>
                <div className={`status-indicator ${editedUser.status.toLowerCase()}`}>
                  {editedUser.status === UserStatus.ACTIVE ? '🟢' : '🔴'} {editedUser.status}
                </div>
              </div>
              
              <div className="user-details">
                <p><strong>Email:</strong> {editedUser.email}</p>
                <p><strong>Username:</strong> {editedUser.username}</p>
                {editedUser.birthDate && <p><strong>Birth Date:</strong> {editedUser.birthDate}</p>}
                {editedUser.phone && <p><strong>Phone:</strong> {editedUser.phone}</p>}
                <p><strong>Role:</strong> {editedUser.role}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;