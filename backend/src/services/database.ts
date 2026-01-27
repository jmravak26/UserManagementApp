import sqlite3 from 'sqlite3';
import { User, UserRole, UserStatus } from '../types';
import path from 'path';

// NOTE: Database path is currently hardcoded
// TODO: Use process.env.DATABASE_URL for configuration
// The DATABASE_URL in .env is kept for future Prisma migration
const dbPath = path.join(__dirname, '../../database.db');
const db = new sqlite3.Database(dbPath);

export class DatabaseService {
  async initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          avatar TEXT,
          role TEXT NOT NULL,
          birthDate TEXT NOT NULL,
          phone TEXT,
          status TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err: Error | null) => {
        if (err) {
          reject(err);
          return;
        }

        // Check if we need to seed data
        db.get('SELECT COUNT(*) as count FROM users', (err: Error | null, row: any) => {
          if (err) {
            reject(err);
            return;
          }

          if (row.count === 0) {
            this.seedDatabase().then(resolve).catch(reject);
          } else {
            resolve();
          }
        });
      });
    });
  }

  private async seedDatabase(): Promise<void> {
    const mockUsers = [
      {
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        avatar: 'https://i.pravatar.cc/150?u=1',
        role: UserRole.ADMIN,
        birthDate: '15/03/1990',
        phone: '+1234567890',
        status: UserStatus.ACTIVE
      },
      {
        name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane@example.com',
        avatar: 'https://i.pravatar.cc/150?u=2',
        role: UserRole.MANAGER,
        birthDate: '22/07/1985',
        phone: '+1234567891',
        status: UserStatus.ACTIVE
      },
      {
        name: 'Bob Johnson',
        username: 'bobjohnson',
        email: 'bob@example.com',
        avatar: 'https://i.pravatar.cc/150?u=3',
        role: UserRole.USER,
        birthDate: '10/12/1992',
        phone: '+1234567892',
        status: UserStatus.INACTIVE
      },
      {
        name: 'Alice Brown',
        username: 'alicebrown',
        email: 'alice@example.com',
        avatar: 'https://i.pravatar.cc/150?u=4',
        role: UserRole.USER,
        birthDate: '05/09/1988',
        phone: '+1234567893',
        status: UserStatus.ACTIVE
      },
      {
        name: 'Michael Chen',
        username: 'mchen',
        email: 'michael.chen@example.com',
        avatar: 'https://i.pravatar.cc/150?u=5',
        role: UserRole.MANAGER,
        birthDate: '18/11/1987',
        phone: '+1234567894',
        status: UserStatus.ACTIVE
      },
      {
        name: 'Sarah Wilson',
        username: 'swilson',
        email: 'sarah.wilson@example.com',
        avatar: 'https://i.pravatar.cc/150?u=6',
        role: UserRole.USER,
        birthDate: '03/06/1993',
        phone: '+1234567895',
        status: UserStatus.ACTIVE
      },
      {
        name: 'David Martinez',
        username: 'dmartinez',
        email: 'david.martinez@example.com',
        avatar: 'https://i.pravatar.cc/150?u=7',
        role: UserRole.USER,
        birthDate: '27/02/1991',
        phone: '+1234567896',
        status: UserStatus.INACTIVE
      },
      {
        name: 'Emily Davis',
        username: 'edavis',
        email: 'emily.davis@example.com',
        avatar: 'https://i.pravatar.cc/150?u=8',
        role: UserRole.ADMIN,
        birthDate: '14/08/1986',
        phone: '+1234567897',
        status: UserStatus.ACTIVE
      },
      {
        name: 'James Taylor',
        username: 'jtaylor',
        email: 'james.taylor@example.com',
        avatar: 'https://i.pravatar.cc/150?u=9',
        role: UserRole.USER,
        birthDate: '09/04/1994',
        phone: '+1234567898',
        status: UserStatus.ACTIVE
      },
      {
        name: 'Lisa Anderson',
        username: 'landerson',
        email: 'lisa.anderson@example.com',
        avatar: 'https://i.pravatar.cc/150?u=10',
        role: UserRole.MANAGER,
        birthDate: '21/01/1989',
        phone: '+1234567899',
        status: UserStatus.INACTIVE
      }
    ];

    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO users (name, username, email, avatar, role, birthDate, phone, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      let completed = 0;
      mockUsers.forEach((user) => {
        stmt.run(
          user.name,
          user.username,
          user.email,
          user.avatar,
          user.role,
          user.birthDate,
          user.phone,
          user.status,
          (err: Error | null) => {
            if (err) {
              reject(err);
              return;
            }
            completed++;
            if (completed === mockUsers.length) {
              stmt.finalize();
              console.log('✅ Database seeded with mock users');
              resolve();
            }
          }
        );
      });
    });
  }

  async getUsers(page: number = 1, pageSize: number = 4): Promise<any> {
    const offset = (page - 1) * pageSize;
    
    return new Promise((resolve, reject) => {
      // Get total count
      db.get('SELECT COUNT(*) as total FROM users', (err: Error | null, countRow: any) => {
        if (err) {
          reject(err);
          return;
        }

        // Get paginated users
        db.all(
          'SELECT * FROM users ORDER BY id ASC LIMIT ? OFFSET ?',
          [pageSize, offset],
          (err: Error | null, rows: any[]) => {
            if (err) {
              reject(err);
              return;
            }

            const total = countRow.total;
            const hasMore = offset + pageSize < total;

            resolve({
              data: rows,
              hasMore,
              total,
              page,
              pageSize
            });
          }
        );
      });
    });
  }

  async getUserById(id: number): Promise<User | null> {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err: Error | null, row: any) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row as User || null);
      });
    });
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO users (name, username, email, avatar, role, birthDate, phone, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        userData.name,
        userData.username,
        userData.email,
        userData.avatar,
        userData.role,
        userData.birthDate,
        userData.phone,
        userData.status,
        function(this: sqlite3.RunResult, err: Error | null) {
          if (err) {
            reject(err);
            return;
          }

          // Get the created user
          db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err: Error | null, row: any) => {
            stmt.finalize();
            if (err) {
              reject(err);
              return;
            }
            resolve(row as User);
          });
        }
      );
    });
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    return new Promise((resolve, reject) => {
      const fields = Object.keys(userData).filter(key => key !== 'id');
      const values = fields.map(key => (userData as any)[key]);
      const setClause = fields.map(field => `${field} = ?`).join(', ');

      if (fields.length === 0) {
        this.getUserById(id).then((user) => {
          if (user) {
            resolve(user);
          } else {
            reject(new Error('User not found'));
          }
        }).catch(reject);
        return;
      }

      const query = `UPDATE users SET ${setClause}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
      values.push(id);

      db.run(query, values, (err: Error | null) => {
        if (err) {
          reject(err);
          return;
        }

        // Get the updated user
        this.getUserById(id).then((user) => {
          if (user) {
            resolve(user);
          } else {
            reject(new Error('User not found'));
          }
        }).catch(reject);
      });
    });
  }

  async deleteUser(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      // First get the user to return it
      this.getUserById(id).then((user) => {
        if (!user) {
          reject(new Error('User not found'));
          return;
        }

        db.run('DELETE FROM users WHERE id = ?', [id], (err: Error | null) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(user);
        });
      }).catch(reject);
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      db.close((err: Error | null) => {
        if (err) {
          console.error('Error closing database:', err);
        }
        resolve();
      });
    });
  }
}

export const dbService = new DatabaseService();