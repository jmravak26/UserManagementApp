import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchUsers, addLocalUser, updateUser, resetUsers, bulkDeleteUsers, bulkUpdateUserRoles, bulkImportUsers } from '../store/userSlice';
import { toggleUserSelection, selectAllUsers, deselectAllUsers, removeDeletedUsers } from '../store/selectionSlice';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import UserCard from '../components/UserCard';
import SearchBar from '../components/SearchBar';
import AddUserModal from '../components/AddUserModal';
import UserDetailModal from "../components/UserDetailModal";
import BulkActionsToolbar from '../components/BulkActionsToolbar';
import FilterSortPanel from '../components/FilterSortPanel';
import ImportPanel from '../components/ImportPanel';
import PrintButton from '../components/PrintButton';
import type { FilterOptions, SortOptions, FilterPreset } from '../components/FilterSortPanel';
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
  const [filters, setFilters] = useState<FilterOptions>({ role: '', status: '', dateFrom: '', dateTo: '' });
  const [sort, setSort] = useState<SortOptions>({ field: 'name', order: 'asc' });
  const [presets, setPresets] = useState<FilterPreset[]>(() => {
    const saved = localStorage.getItem('filterPresets');
    return saved ? JSON.parse(saved) : [];
  });

  // Initial fetch
  useEffect(() => {
    dispatch(fetchUsers(1));
  }, [dispatch]);

  const filtered = useMemo(() => {
    let result = items.filter((u) =>
      u.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (filters.role) result = result.filter(u => u.role === filters.role);
    if (filters.status) result = result.filter(u => u.status === filters.status);
    if (filters.dateFrom || filters.dateTo) {
      result = result.filter(u => {
        const [day, month, year] = u.birthDate.split('/');
        const userDate = `${year}-${month}-${day}`;
        if (filters.dateFrom && userDate < filters.dateFrom) return false;
        if (filters.dateTo && userDate > filters.dateTo) return false;
        return true;
      });
    }

    result.sort((a, b) => {
      const aVal = a[sort.field];
      const bVal = b[sort.field];
      const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sort.order === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [items, filter, filters, sort]);

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

  const handleSavePreset = (preset: FilterPreset) => {
    const updated = [...presets.filter(p => p.name !== preset.name), preset];
    setPresets(updated);
    localStorage.setItem('filterPresets', JSON.stringify(updated));
  };

  const handleLoadPreset = (preset: FilterPreset) => {
    setFilters(preset.filters);
    setSort(preset.sort);
  };

  const handleDeletePreset = (name: string) => {
    const updated = presets.filter(p => p.name !== name);
    setPresets(updated);
    localStorage.setItem('filterPresets', JSON.stringify(updated));
  };

  const handleImportUsers = (users: User[]) => {
    dispatch(bulkImportUsers(users));
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
          <ImportPanel onImport={handleImportUsers} />
          <PrintButton allUsers={filtered} selectedUsers={selectedUsers} />
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

      <FilterSortPanel
        filters={filters}
        sort={sort}
        presets={presets}
        onFilterChange={setFilters}
        onSortChange={setSort}
        onSavePreset={handleSavePreset}
        onLoadPreset={handleLoadPreset}
        onDeletePreset={handleDeletePreset}
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