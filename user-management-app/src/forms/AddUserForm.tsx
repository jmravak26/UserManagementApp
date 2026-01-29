import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import PhoneInput from 'react-phone-number-input';
import { UserRole, UserStatus } from '../types/User';
import 'react-phone-number-input/style.css';
import './AddUserForm.css';

type Props = {
  onSubmit: (vals: {
    name: string;
    username: string;
    email: string;
    password: string;
    avatarUrl?: string;
    birthDate: Date | null;
    phone?: string;
    role: UserRole;
    status: UserStatus;
  }) => void;
  onCancel?: () => void;
};

// Validation schema including role validation
const Schema = Yup.object().shape({
  name: Yup.string().required('Required'),
  username: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
  birthDate: Yup.string().required('Required'),
  phone: Yup.string(),
  role: Yup.string().oneOf(Object.values(UserRole)).required('Role is required'),
  status: Yup.string().oneOf(Object.values(UserStatus)).required('Status is required')
});

const AddUserForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={{ name: '', username: '', email: '', password: '', avatarUrl: '', birthDate: '', phone: '', role: UserRole.USER, status: UserStatus.ACTIVE }} // 31. Default status to Active
      validationSchema={Schema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          onSubmit({
            ...values,
            birthDate: values.birthDate ? new Date(values.birthDate) : null
          });
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ values, setFieldValue, errors, touched, isSubmitting }) => (
        <Form className="add-form">
          <div className="form-group">
            <label className="label">Full name</label>
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
            <Field name="email" className="input" />
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
            <label className="label">Avatar URL (optional)</label>
            <Field name="avatarUrl" className="input" />
          </div>

          <div className="form-group">
            <label className="label">Phone Number (optional)</label>
          <PhoneInput
            placeholder="Enter phone number"
            value={values.phone}
            onChange={(value) => setFieldValue('phone', value || '')}
            defaultCountry="HR"
            className="phone-input"
          />
            {errors.phone && touched.phone && <div className="error">{errors.phone}</div>}
          </div>

          <div className="form-group">
            <label className="label">Role</label>
            <Field as="select" name="role" className="input">
              <option value={UserRole.USER}>{UserRole.USER}</option>
              <option value={UserRole.MANAGER}>{UserRole.MANAGER}</option>
              <option value={UserRole.ADMIN}>{UserRole.ADMIN}</option>
            </Field>
            <ErrorMessage name="role" component="div" className="error" />
          </div>

          <div className="form-group">
            <label className="label">Status</label>
            <Field as="select" name="status" className="input">
              <option value={UserStatus.ACTIVE}>{UserStatus.ACTIVE}</option>
              <option value={UserStatus.INACTIVE}>{UserStatus.INACTIVE}</option>
            </Field>
            <ErrorMessage name="status" component="div" className="error" />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary cancel-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add user'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddUserForm;