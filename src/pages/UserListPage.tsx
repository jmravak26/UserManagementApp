import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchUsers, addLocalUser, resetUsers } from '../store/userSlice';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import AddUserModal from '../components/AddUserModal';
import UserDetailModal from "../components/UserDetailModal";
import type { User } from "../types/User";
import { UserRole } from '../types/User';
import './UserListPage.css';

const UserListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, loading, hasMore, page } = useAppSelector((s) => s.users);
  const { userRole } = useAppSelector((s) => s.auth); // Get current user's role
  
  // Check if current user can add users (Admin or Manager only)
  const canAddUsers = userRole === UserRole.ADMIN || userRole === UserRole.MANAGER;

  const [filter, setFilter] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Initial fetch
  useEffect(() => {
    dispatch(fetchUsers(1));
  }, [dispatch]);

  const filtered = items.filter((u) =>
    u.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleLogout = () => {
    dispatch(resetUsers());
    dispatch(logout());
    navigate('/login');
  };

  const handleUserClick = (user: User) => setSelectedUser(user);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchUsers(page + 1));
    }
  };

  return (
    <div className="users-page">
      <header className="users-header">
        <h2 data-role={`Logged in as: ${userRole}`}>Users</h2>
        <div className="actions">
          <SearchBar onSearch={setFilter} placeholder="Search users..." />
          {canAddUsers && (
            <button className="add-btn" onClick={() => setShowAdd(true)}>
              + Add user
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main>
        <div className="grid">
          {filtered.map((u) => (
            <UserCard key={u.id} user={u} onClick={handleUserClick} />
          ))}
        </div>

        {loading && <div className="loading">Loading users...</div>}

        {!loading && filtered.length === 0 && (
          <div className="empty">No users found</div>
        )}

        {!loading && hasMore && (
          <div className="load-more-container">
            <button className="load-more-btn" onClick={handleLoadMore}>
              ↓ Load More ↓
            </button>
          </div>
        )}
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