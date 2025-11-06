import React from 'react';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import './AddUserForm.css';

type Props = {
  onSubmit: (vals: { name: string; username: string; email: string; avatarUrl?: string }) => void;
  onCancel?: () => void;
};

const Schema = Yup.object().shape({
  name: Yup.string().required('Required'),
  username: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required')
});

const AddUserForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={{ name: '', username: '', email: '', avatarUrl: '' }}
      validationSchema={Schema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          onSubmit(values);
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className="add-form">
          <label>Full name</label>
          <Field name="name" className="input" />
          {errors.name && touched.name && <div className="error">{errors.name}</div>}

          <label>Username</label>
          <Field name="username" className="input" />
          {errors.username && touched.username && <div className="error">{errors.username}</div>}

          <label>Email</label>
          <Field name="email" className="input" />
          {errors.email && touched.email && <div className="error">{errors.email}</div>}

          <label>Avatar URL (optional)</label>
          <Field name="avatarUrl" className="input" />

          <div className="form-actions">
            <button type="button" className="btn cancel" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn primary" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add user'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

(AddUserForm as any).propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
};

export default AddUserForm;
