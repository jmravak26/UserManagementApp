import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchUsers, addLocalUser } from '../store/userSlice';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import AddUserModal from '../components/AddUserModal';
import { logout } from '../store/authSlice';
import { resetUsers } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';
import './UserListPage.css';
import UserDetailModal from "../components/UserDetailModal";
import type { User } from "../types/User";

const UserListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, loading } = useAppSelector((s) => s.users);
  const [filter, setFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filtered = items.filter(u =>
    (u.name).toLowerCase().includes(filter.toLowerCase())
  );


  const handleLogout = () => {
    dispatch(resetUsers()); // Clears in-memory Redux state
    dispatch(logout());
    navigate('/login'); // redirects user to login page
  };

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
  };


  return (
    <div className="users-page">
      <header className="users-header">
        <h2>Users</h2>
        <div className="actions">
          <SearchBar onSearch={setFilter} placeholder="Search users..." />
          <button className="add-btn" onClick={() => setShowAdd(true)}>+ Add user</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main>
        {loading ? <div className="loading">Loading users...</div> :
          <div className="grid">
            {filtered.map(u => 
              <UserCard 
                key={u.id} 
                user={u} 
                onClick={handleUserClick}
              />
            )}
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
      {selectedUser && (
        <UserDetailModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default UserListPage;