export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  avatar: string;
  birthDate: string;
  phone?: string; // Optional phone number with country code
}
