export interface EmailMessage {
  id: string;
  recipients: number[];
  recipientNames: string[];
  recipientEmails: string[];
  subject: string;
  body: string;
  template?: string;
  sentAt: string;
}

export const EmailTemplates = {
  WELCOME: {
    name: 'Welcome Message',
    subject: 'Welcome to Our Platform!',
    body: 'Dear {{name}},\n\nWelcome to our platform! We are excited to have you on board.\n\nBest regards,\nThe Team'
  },
  ACCOUNT_UPDATE: {
    name: 'Account Update',
    subject: 'Your Account Has Been Updated',
    body: 'Dear {{name}},\n\nYour account information has been updated successfully.\n\nBest regards,\nThe Team'
  },
  REMINDER: {
    name: 'Reminder',
    subject: 'Reminder: Action Required',
    body: 'Dear {{name}},\n\nThis is a friendly reminder about pending actions on your account.\n\nBest regards,\nThe Team'
  },
  CUSTOM: {
    name: 'Custom Message',
    subject: '',
    body: ''
  }
} as const;

export type EmailTemplateKey = keyof typeof EmailTemplates;
