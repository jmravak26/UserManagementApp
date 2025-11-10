import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './AddUserForm.css';

type Props = {
  onSubmit: (vals: {
    name: string;
    username: string;
    email: string;
    avatarUrl?: string;
    birthDate: Date | null;
  }) => void;
  onCancel?: () => void;
};

const Schema = Yup.object().shape({
  name: Yup.string().required('Required'),
  username: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  birthDate: Yup.date().required('Required')
});

const AddUserForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  return (
    <Formik
      initialValues={{ name: '', username: '', email: '', avatarUrl: '', birthDate: null }}
      validationSchema={Schema}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          onSubmit(values);
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ values, setFieldValue, errors, touched, isSubmitting }) => (
        <Form className="add-form">
          <label>Full name</label>
          <Field name="name" className="input" />
          <ErrorMessage name="name" component="div" className="error" />

          <label>Username</label>
          <Field name="username" className="input" />
          <ErrorMessage name="username" component="div" className="error" />

          <label>Email</label>
          <Field name="email" className="input" />
          <ErrorMessage name="email" component="div" className="error" />

          <label>Birth Date</label>
          <DatePicker
            selected={values.birthDate}
            onChange={(date) => setFieldValue('birthDate', date)}
            dateFormat="dd/MM/yyyy"
            className="input"
            placeholderText="Select birth date"
          />
          {errors.birthDate && touched.birthDate && <div className="error">{errors.birthDate}</div>}

          <label>Avatar URL (optional)</label>
          <Field name="avatarUrl" className="input" />

          <div className="form-actions">
            <button type="button" className="btn cancel" onClick={onCancel}>
              Cancel
            </button>
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