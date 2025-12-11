import { useState } from 'react';
import PropTypes from 'prop-types';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { sendMessage } from '../store/messageSlice';
import { EmailTemplates } from '../types/Message';

import type { EmailTemplateKey, EmailMessage } from '../types/Message';
import type { User } from '../types/User';
import './EmailModal.css';

interface EmailModalProps {
  recipients: User[];
  onClose: () => void;
}

export default function EmailModal({ recipients, onClose }: EmailModalProps) {
  const dispatch = useAppDispatch();
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateKey>('CUSTOM');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleTemplateChange = (templateKey: EmailTemplateKey) => {
    setSelectedTemplate(templateKey);
    const template = EmailTemplates[templateKey];
    setSubject(template.subject);
    setBody(template.body);
  };

  const handleSend = () => {
    const message: EmailMessage = {
      id: Date.now().toString(),
      recipients: recipients.map(u => u.id),
      recipientNames: recipients.map(u => u.name),
      recipientEmails: recipients.map(u => u.email),
      subject,
      body: body.replace(/\{\{name\}\}/g, recipients.length === 1 ? recipients[0].name : 'User'),
      template: selectedTemplate !== 'CUSTOM' ? selectedTemplate : undefined,
      sentAt: new Date().toISOString()
    };
    
    dispatch(sendMessage(message));
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content email-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Send Email</h2>
        
        <div className="email-recipients">
          <strong>To:</strong> {recipients.map(u => u.email).join(', ')}
        </div>

        <div className="form-group">
          <label>Template:</label>
          <select value={selectedTemplate} onChange={(e) => handleTemplateChange(e.target.value as EmailTemplateKey)}>
            {Object.entries(EmailTemplates).map(([key, template]) => (
              <option key={key} value={key}>{template.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Subject:</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Message:</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={8} />
          <small>Use {`{{name}}`} for recipient name</small>
        </div>

        <div className="modal-actions">
          <button onClick={handleSend} disabled={!subject || !body}>Send</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

EmailModal.propTypes = {
  recipients: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
};
