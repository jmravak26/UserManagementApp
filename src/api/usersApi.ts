import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000
});

export const getUsers = async () => {
  const res = await api.get('/users');
  const users = res.data.map((u: any) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    avatar: `https://i.pravatar.cc/150?u=${u.id}` // default avatar
  }));
  return { data: users };
};