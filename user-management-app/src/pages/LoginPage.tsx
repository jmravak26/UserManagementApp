import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { loginStart, loginSuccess, loginFail } from '../store/authSlice';
import { UserRole } from '../types/User';
import { useDatabaseMode } from '../contexts/DatabaseModeContext';
import './LoginPage.css';

// Helper function to determine user role based on email
const getUserRoleFromEmail = (email: string): UserRole => {
  if (email.includes('admin')) return UserRole.ADMIN;
  if (email.includes('manager')) return UserRole.MANAGER;
  return UserRole.USER;
};

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(3, 'Too short').required('Required')
});

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mode, setMode } = useDatabaseMode();

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="brand">User Management</h1>

        <div className="database-mode-selector">
          <h3>Database Mode</h3>
          <div className="mode-options">
            <label className="mode-option">
              <input 
                type="radio" 
                name="dbMode" 
                value="real" 
                checked={mode === 'real'}
                onChange={() => setMode('real')}
              />
              <span className="mode-label">
                <strong>Real Backend</strong>
                <small>Local Node.js API</small>
              </span>
            </label>
            <label className="mode-option">
              <input 
                type="radio" 
                name="dbMode" 
                value="mock" 
                checked={mode === 'mock'}
                onChange={() => setMode('mock')}
              />
              <span className="mode-label">
                <strong>Mock Database</strong>
                <small>JSONPlaceholder API</small>
              </span>
            </label>
          </div>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              dispatch(loginStart());
              const fakeToken = 'mock-token-' + Date.now();
              const userRole = getUserRoleFromEmail(values.email);
              
              window.setTimeout(() => {
                dispatch(loginSuccess({ token: fakeToken, role: userRole }));
                setSubmitting(false);
                navigate('/users');
              }, 600);
            } catch (err: any) {
              dispatch(loginFail(err.message || 'Login failed'));
              setFieldError('email', 'Login failed');
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="login-form">
              <label className="label">Email</label>
              <Field name="email" type="email" className="input" />
              {errors.email && touched.email ? <div className="error">{errors.email}</div> : null}

              <label className="label">Password</label>
              <Field name="password" type="password" className="input" />
              {errors.password && touched.password ? <div className="error">{errors.password}</div> : null}

              <button className="btn btn-primary login-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="hint">
          <small>Demo credentials:</small><br/>
          <small><strong>Admin:</strong> admin@test.com</small><br/>
          <small><strong>Manager:</strong> manager@test.com</small><br/>
          <small><strong>User:</strong> user@test.com</small><br/>
          <small>Password: any</small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;