import Papa from 'papaparse';
import type { User } from '../types/User';

export const exportUsersToCSV = (users: User[], filename?: string) => {
  const csvData = users.map(user => ({
    ID: user.id,
    Name: user.name,
    Username: user.username,
    Email: user.email,
    Role: user.role,
    'Birth Date': user.birthDate,
    Phone: user.phone || '',
    Avatar: user.avatar
  }));

  const csv = Papa.unparse(csvData);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename || `users_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};