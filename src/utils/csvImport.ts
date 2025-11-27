import Papa from 'papaparse';
import type { User } from '../types/User';
import { UserRole, UserStatus } from '../types/User';

export interface ImportResult {
  success: boolean;
  users: User[];
  errors: string[];
}

export const importUsersFromCSV = (file: File): Promise<ImportResult> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const users: User[] = [];
        const errors: string[] = [];

        results.data.forEach((row: any, index: number) => {
          try {
            if (!row.Name || !row.Username || !row.Email || !row['Birth Date'] || !row.Role) {
              errors.push(`Row ${index + 1}: Missing required fields (Name, Username, Email, Birth Date, Role)`);
              return;
            }

            const validRoles = Object.values(UserRole);
            if (!validRoles.includes(row.Role)) {
              errors.push(`Row ${index + 1}: Invalid role '${row.Role}'. Must be: ${validRoles.join(', ')}`);
              return;
            }

            const user: User = {
              id: Date.now() + index,
              name: row.Name,
              username: row.Username,
              email: row.Email,
              avatar: row.Avatar || '',
              role: row.Role as UserRole,
              status: UserStatus.ACTIVE,
              birthDate: row['Birth Date'],
              phone: row.Phone || ''
            };

            users.push(user);
          } catch (error) {
            errors.push(`Row ${index + 1}: ${error instanceof Error ? error.message : 'Invalid data'}`);
          }
        });

        resolve({
          success: errors.length === 0,
          users,
          errors
        });
      },
      error: (error) => {
        resolve({
          success: false,
          users: [],
          errors: [error.message]
        });
      }
    });
  });
};
