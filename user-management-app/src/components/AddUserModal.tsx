import React from 'react';
import AddUserForm from '../forms/AddUserForm';
import { UserStatus } from '../types/User';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { createUserThunk } from '../store/userSlice';
import { useDatabaseMode } from '../contexts/DatabaseModeContext';
import './AddUserModal.css';

type Props = {
  open: boolean;
  onClose: () => void;
};

const AddUserModal: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const { mode } = useDatabaseMode();
  const [error, setError] = React.useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (values: any) => {
    setError(null);
    const userData = {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
      avatar: values.avatarUrl && values.avatarUrl.trim() 
        ? values.avatarUrl.trim() 
        : `https://i.pravatar.cc/150?u=${Date.now()}`,
      birthDate: values.birthDate || '',
      phone: values.phone || undefined,
      role: values.role,
      status: UserStatus.ACTIVE
    };

    try {
      await dispatch(createUserThunk({ userData, mode })).unwrap();
      onClose();
    } catch (error: any) {
      setError(error);
    }
  };

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
            onSubmit={handleSubmit}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;