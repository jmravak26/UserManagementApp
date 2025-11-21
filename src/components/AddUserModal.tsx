import React from 'react';
import PropTypes from 'prop-types';
import AddUserForm from '../forms/AddUserForm';
import type { User } from '../types/User';
import { UserStatus } from '../types/User';
import './AddUserModal.css';

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (user: User) => void;
};

const AddUserModal: React.FC<Props> = ({ open, onClose, onAdd }) => {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-header">
          <h3>Add user</h3>
          <button className="close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <AddUserForm
            onCancel={onClose}
            onSubmit={(values) => {
              const newUser: User = {
                id: Date.now(),
                name: values.name,
                username: values.username,
                email: values.email,
                avatar: values.avatarUrl || `https://i.pravatar.cc/150?u=${Date.now()}`,
                birthDate: values.birthDate
                  ? (() => {
                      const date = new Date(values.birthDate);
                      const day = date.getDate().toString().padStart(2, '0');
                      const month = (date.getMonth() + 1).toString().padStart(2, '0');
                      const year = date.getFullYear();
                      return `${day}/${month}/${year}`;
                    })() : '',
                phone: values.phone || undefined,
                role: values.role,
                status: UserStatus.ACTIVE
              };
              onAdd(newUser);
            }}
          />
        </div>
      </div>
    </div>
  );
};

(AddUserModal as any).propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
};

export default AddUserModal;