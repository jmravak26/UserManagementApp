import React from 'react';
import PropTypes from 'prop-types';
import AddUserForm from '../forms/AddUserForm';
import type { User } from '../types/User';
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
              // create a fake user object (id unique)
              const newUser: User = {
                id: Date.now(),
                name: values.name,
                username: values.username,
                email: values.email,
                avatar: values.avatarUrl || `https://i.pravatar.cc/150?u=${Date.now()}`,
                birthDate: values.birthDate
                  ? new Date(values.birthDate).toISOString().split('T')[0].split('-').reverse().join('-') : '',
                phone: values.phone || undefined
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