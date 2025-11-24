import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { UserRole, UserStatus } from '../types/User';
import './FilterSortPanel.css';

export interface FilterOptions {
  role: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

export interface SortOptions {
  field: 'name' | 'email' | 'birthDate' | 'role';
  order: 'asc' | 'desc';
}

export interface FilterPreset {
  name: string;
  filters: FilterOptions;
  sort: SortOptions;
}

interface FilterSortPanelProps {
  filters: FilterOptions;
  sort: SortOptions;
  presets: FilterPreset[];
  onFilterChange: (filters: FilterOptions) => void;
  onSortChange: (sort: SortOptions) => void;
  onSavePreset: (preset: FilterPreset) => void;
  onLoadPreset: (preset: FilterPreset) => void;
  onDeletePreset: (name: string) => void;
}

const FilterSortPanel: React.FC<FilterSortPanelProps> = ({
  filters,
  sort,
  presets,
  onFilterChange,
  onSortChange,
  onSavePreset,
  onLoadPreset,
  onDeletePreset
}) => {
  const [presetName, setPresetName] = useState('');
  const [showPresets, setShowPresets] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleReset = () => {
    onFilterChange({ role: '', status: '', dateFrom: '', dateTo: '' });
    onSortChange({ field: 'name', order: 'asc' });
  };

  const handleSavePreset = () => {
    if (presetName.trim()) {
      onSavePreset({ name: presetName.trim(), filters, sort });
      setPresetName('');
    }
  };

  return (
    <div className="filter-sort-panel">
      <button className="panel-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? '▼' : '▶'} Filters & Sort
      </button>
      
      {isExpanded && (
        <div className="panel-content">
      <div className="filter-section">
        <h3>Filters</h3>
        <div className="filter-controls">
          <select value={filters.role} onChange={(e) => onFilterChange({ ...filters, role: e.target.value })}>
            <option value="">All Roles</option>
            <option value={UserRole.ADMIN}>Admin</option>
            <option value={UserRole.MANAGER}>Manager</option>
            <option value={UserRole.USER}>User</option>
          </select>

          <select value={filters.status} onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value={UserStatus.ACTIVE}>Active</option>
            <option value={UserStatus.INACTIVE}>Inactive</option>
          </select>

          <div className="date-filter">
            <label>Birth Date From:</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
            />
          </div>

          <div className="date-filter">
            <label>Birth Date To:</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="sort-section">
        <h3>Sort</h3>
        <div className="sort-controls">
          <select value={sort.field} onChange={(e) => onSortChange({ ...sort, field: e.target.value as any })}>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="birthDate">Join Date</option>
            <option value="role">Role</option>
          </select>

          <select value={sort.order} onChange={(e) => onSortChange({ ...sort, order: e.target.value as any })}>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div className="preset-section">
        <button className="btn-preset" onClick={() => setShowPresets(!showPresets)}>
          {showPresets ? '▼' : '▶'} Presets ({presets.length})
        </button>
        
        {showPresets && (
          <div className="preset-content">
            <div className="preset-save">
              <input
                type="text"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Preset name"
              />
              <button onClick={handleSavePreset} disabled={!presetName.trim()}>Save</button>
            </div>
            
            <div className="preset-list">
              {presets.map((p) => (
                <div key={p.name} className="preset-item">
                  <button onClick={() => onLoadPreset(p)}>{p.name}</button>
                  <button className="btn-delete" onClick={() => onDeletePreset(p.name)}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className="btn-reset" onClick={handleReset}>Reset All</button>
        </div>
      )}
    </div>
  );
};

FilterSortPanel.propTypes = {
  filters: PropTypes.shape({
    role: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    dateFrom: PropTypes.string.isRequired,
    dateTo: PropTypes.string.isRequired
  }).isRequired,
  sort: PropTypes.shape({
    field: PropTypes.oneOf(['name', 'email', 'birthDate', 'role']).isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired
  }).isRequired,
  presets: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired,
    sort: PropTypes.object.isRequired
  }).isRequired).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
  onSavePreset: PropTypes.func.isRequired,
  onLoadPreset: PropTypes.func.isRequired,
  onDeletePreset: PropTypes.func.isRequired
};

export default FilterSortPanel;
