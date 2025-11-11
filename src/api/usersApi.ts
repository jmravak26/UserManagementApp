import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000
});

const PAGE_SIZE = 4;

export const getUsers = async (page = 1) => {
  const res = await api.get('/users');
  const allUsers = res.data.map((u: any) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    avatar: `https://i.pravatar.cc/150?u=${u.id}`
  }));

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const paginated = allUsers.slice(start, end);

  const hasMore = end < allUsers.length;

  return { data: paginated, hasMore };
};