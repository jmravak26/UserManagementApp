import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { registerUser } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import './RegisterModal.css';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  username: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  birthDate: Yup.string().required('Required')
});

type Props = {
  open: boolean;
  onClose: () => void;
};

const RegisterModal: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);

  if (!open) return null;

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(registerUser(values)).unwrap();
      onClose();
      navigate('/users');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" onClick={handleContentClick}>
        <div className="modal-header">
          <h3>Create Account</h3>
          <button className="close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <Formik
            initialValues={{ name: '', username: '', email: '', password: '', birthDate: '', phone: '' }}
            validationSchema={RegisterSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="register-form">
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                  <label className="label">Full Name</label>
                  <Field name="name" className="input" />
                  <ErrorMessage name="name" component="div" className="error" />
                </div>
                
                <div className="form-group">
                  <label className="label">Username</label>
                  <Field name="username" className="input" />
                  <ErrorMessage name="username" component="div" className="error" />
                </div>
                
                <div className="form-group">
                  <label className="label">Email</label>
                  <Field name="email" type="email" className="input" />
                  <ErrorMessage name="email" component="div" className="error" />
                </div>
                
                <div className="form-group">
                  <label className="label">Password</label>
                  <Field name="password" type="password" className="input" />
                  <ErrorMessage name="password" component="div" className="error" />
                </div>
                
                <div className="form-group">
                  <label className="label">Birth Date</label>
                  <Field name="birthDate" type="date" className="input" />
                  <ErrorMessage name="birthDate" component="div" className="error" />
                </div>
                
                <div className="form-group">
                  <label className="label">Phone (optional)</label>
                  <Field name="phone" className="input" />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary cancel-btn" onClick={onClose}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting || loading}>
                    {isSubmitting || loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;