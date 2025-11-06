import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchUsers, addLocalUser } from '../store/userSlice';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import AddUserModal from '../components/AddUserModal';
import './UserListPage.css';

const UserListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((s) => s.users);
  const [filter, setFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filtered = items.filter(u =>
    (u.name).toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="users-page">
      <header className="users-header">
        <h2>Users</h2>
        <div className="actions">
          <SearchBar onSearch={setFilter} placeholder="Search users..." />
          <button className="add-btn" onClick={() => setShowAdd(true)}>+ Add user</button>
        </div>
      </header>

      <main>
        {loading ? <div className="loading">Loading users...</div> :
          <div className="grid">
            {filtered.map(u => <UserCard key={u.id} user={u} />)}
            {filtered.length === 0 && <div className="empty">No users found</div>}
          </div>
        }
      </main>

      <AddUserModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={(user) => {
          dispatch(addLocalUser(user));
          setShowAdd(false);
        }}
      />
    </div>
  );
};

export default UserListPage;