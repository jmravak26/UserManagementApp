import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchUsers, addLocalUser, updateUser, resetUsers, bulkDeleteUsers, bulkUpdateUserRoles } from '../store/userSlice';
import { toggleUserSelection, selectAllUsers, deselectAllUsers, removeDeletedUsers } from '../store/selectionSlice';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import AddUserModal from '../components/AddUserModal';
import UserDetailModal from "../components/UserDetailModal";
import BulkActionsToolbar from '../components/BulkActionsToolbar';
import type { User } from "../types/User";
import { UserRole } from '../types/User';
import './UserListPage.css';

const UserListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { items, loading, hasMore, page } = useAppSelector((s) => s.users);
  const { userRole } = useAppSelector((s) => s.auth);
  const { selectedUserIds } = useAppSelector((s) => s.selection);
  
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

  const selectedUsers = useMemo(() => 
    items.filter(user => selectedUserIds.includes(user.id)), 
    [items, selectedUserIds]
  );

  const isAllVisibleSelected = filtered.length > 0 && filtered.every(user => selectedUserIds.includes(user.id));
  const isSomeSelected = selectedUserIds.length > 0 && selectedUserIds.length < filtered.length;

  const handleLogout = () => {
    dispatch(resetUsers());
    dispatch(logout());
    navigate('/login');
  };

  const handleUserClick = (user: User) => setSelectedUser(user);

  const handleUserUpdate = (updatedUser: User) => {
    dispatch(updateUser(updatedUser));
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      dispatch(fetchUsers(page + 1));
    }
  };

  const handleUserSelection = (userId: number) => {
    dispatch(toggleUserSelection(userId));
  };

  const handleSelectAll = () => {
    if (isAllVisibleSelected) {
      dispatch(deselectAllUsers());
    } else {
      const visibleUserIds = filtered.map(user => user.id);
      dispatch(selectAllUsers(visibleUserIds));
    }
  };

  const handleBulkDelete = () => {
    dispatch(bulkDeleteUsers(selectedUserIds));
    dispatch(removeDeletedUsers(selectedUserIds));
  };

  const handleBulkRoleChange = (role: UserRole) => {
    dispatch(bulkUpdateUserRoles({ userIds: selectedUserIds, role }));
  };

  const handleDeselectAll = () => {
    dispatch(deselectAllUsers());
  };

  return (
    <div className="users-page">
      <header className="users-header">
        <h2 data-role={`Logged in as: ${userRole}`}>Users</h2>
        <div className="actions">
          <div className="select-all-container">
            <input
              type="checkbox"
              id="select-all"
              checked={isAllVisibleSelected}
              ref={(input) => {
                if (input) input.indeterminate = isSomeSelected;
              }}
              onChange={handleSelectAll}
            />
            <label htmlFor="select-all">Select All</label>
          </div>
          <SearchBar onSearch={setFilter} placeholder="Search users..." />
          {canAddUsers && (
            <button className="btn btn-success" onClick={() => setShowAdd(true)}>
              + Add user
            </button>
          )}
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <BulkActionsToolbar
        selectedCount={selectedUserIds.length}
        selectedUsers={selectedUsers}
        currentUserRole={userRole}
        onBulkDelete={handleBulkDelete}
        onBulkRoleChange={handleBulkRoleChange}
        onDeselectAll={handleDeselectAll}
      />

      <main>
        <div className="grid">
          {filtered.map((u) => (
            <UserCard 
              key={u.id} 
              user={u} 
              onClick={handleUserClick}
              isSelected={selectedUserIds.includes(u.id)}
              onSelectionChange={handleUserSelection}
            />
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
          onSave={handleUserUpdate}
          canEdit={canAddUsers} // Only Admin/Manager can edit users
        />
      )}
    </div>
  );
};

export default UserListPage;