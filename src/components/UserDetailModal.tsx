import React, { useState } from 'react';
import "./UserDetailModal.css";
import type { User } from "../types/User";

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
}

const EXIT_DURATION = 200; // Must match the CSS animation duration (0.2s)

const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, onClose }) => {
  // 1. State to control the exit animation CSS class
  const [isExiting, setIsExiting] = useState(false);

  if (!user) return null;

  const handleClose = () => {
  // 2. Start the exit animation immediately
    setIsExiting(true);
  // 3. After the animation duration, truly close the modal (unmount the component)
    setTimeout(onClose, EXIT_DURATION);
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
        <button className="close-btn" onClick={handleClose}>&times;</button>
        <img src={user.avatar} alt={user.name} className="detail-avatar" />
        <h2>{user.name}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        {user.username && <p><strong>Username:</strong> {user.username}</p>}
        {user.birthDate && <p><strong>Birth date:</strong> {user.birthDate}</p>}
      </div>
    </div>
  );
};

export default UserDetailModal;