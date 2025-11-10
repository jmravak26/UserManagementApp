import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './SearchBar.css';

type Props = {
  onSearch: (q: string) => void;
  placeholder?: string;
};

const SearchBar: React.FC<Props> = ({ onSearch, placeholder }) => {
  const [q, setQ] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      if (q.length >= 2 || q.length === 0) onSearch(q);
    }, 250);
    return () => clearTimeout(t);
  }, [q, onSearch]);

  return (
    <input
      type="search"
      className="search-input"
      placeholder={placeholder || 'Search...'}
      value={q}
      onChange={(e) => setQ(e.target.value)}
    />
  );
};

(SearchBar as any).propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string
};

export default SearchBar;
