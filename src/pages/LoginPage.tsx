import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { loginStart, loginSuccess, loginFail } from '../store/authSlice';
import './LoginPage.css';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(3, 'Too short').required('Required')
});

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="brand">User Management</h1>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (_, { setSubmitting, setFieldError }) => {
            try {
              dispatch(loginStart());
              // Mock authentication - accept anything
              const fakeToken = 'mock-token-' + Date.now();
              window.setTimeout(() => {
                dispatch(loginSuccess({ token: fakeToken }));
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

              <button className="btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>

        <div className="hint">
          <small>This is a mock login — enter any credentials.</small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;