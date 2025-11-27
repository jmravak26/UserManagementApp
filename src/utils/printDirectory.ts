import type { User } from '../types/User';

export const printUserDirectory = (users: User[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>User Directory</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { text-align: center; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; }
        @media print {
          button { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>User Directory</h1>
      <table>
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td><img src="${user.avatar}" alt="${user.name}" class="avatar" /></td>
              <td>${user.name}</td>
              <td>${user.username}</td>
              <td>${user.email}</td>
              <td>${user.role}</td>
              <td>${user.status}</td>
              <td>${user.phone || 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <script>
        window.onload = () => window.print();
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
