import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { loginUser, clearError, mockLogin } from '../store/authSlice';
import { useDatabaseMode } from '../contexts/DatabaseModeContext';
import RegisterModal from '../components/RegisterModal';
import './LoginPage.css';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(3, 'Too short').required('Required')
});

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mode, setMode } = useDatabaseMode();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch, showRegisterModal]);

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
                <small>Local Node.js API + SQLite database</small>
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
                <small>JSONPlaceholder API + localStorage</small>
              </span>
            </label>
          </div>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              if (mode === 'real') {
                await dispatch(loginUser(values)).unwrap();
                navigate('/users');
              } else {
                // Mock mode - any credentials work
                const fakeToken = 'mock-token-' + Date.now();
                const userRole = values.email.includes('admin') ? 'Admin' : 
                                values.email.includes('manager') ? 'Manager' : 'User';
                
                const mockUser = {
                  id: 1,
                  email: values.email,
                  role: userRole,
                  name: values.email.split('@')[0],
                  username: values.email.split('@')[0],
                  avatar: 'https://i.pravatar.cc/150?u=1'
                };
                
                localStorage.setItem('authToken', fakeToken);
                localStorage.setItem('currentUser', JSON.stringify(mockUser));
                
                // Update auth state for mock mode
                dispatch(mockLogin({ token: fakeToken, user: mockUser }));
                
                navigate('/users');
              }
            } catch (error) {
              console.error('Login failed:', error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="login-form">
              {error && <div className="error-message">{error}</div>}
              
              <label className="label">Email</label>
              <Field name="email" type="email" className="input" />
              {errors.email && touched.email ? <div className="error">{errors.email}</div> : null}

              <label className="label">Password</label>
              <Field name="password" type="password" className="input" />
              {errors.password && touched.password ? <div className="error">{errors.password}</div> : null}

              <button className="btn btn-primary login-btn" type="submit" disabled={isSubmitting || loading}>
                {isSubmitting || loading ? 'Logging in...' : 'Login'}
              </button>
              
              {mode === 'real' && (
                <button 
                  type="button" 
                  className="btn btn-secondary register-toggle" 
                  onClick={() => setShowRegisterModal(true)}
                >
                  Need an account? Register
                </button>
              )}
            </Form>
          )}
        </Formik>

        <RegisterModal
          open={showRegisterModal && mode === 'real'}
          onClose={() => setShowRegisterModal(false)}
        />

        <div className="hint">
          {mode === 'real' ? (
            <>
              <small>Demo accounts (Real Backend):</small><br/>
              <small><strong>Admin:</strong> admin@demo.com / admin123</small><br/>
              <small><strong>Manager:</strong> manager@demo.com / manager123</small><br/>
              <small><strong>User:</strong> user@demo.com / user123</small><br/>
              <small><strong>Or register a new account above!</strong></small>
            </>
          ) : (
            <>
              <small>Mock mode - any credentials work:</small><br/>
              <small><strong>Admin:</strong> admin@test.com / any</small><br/>
              <small><strong>Manager:</strong> manager@test.com / any</small><br/>
              <small><strong>User:</strong> user@test.com / any</small>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;