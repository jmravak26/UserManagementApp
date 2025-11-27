import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import type { User } from '../types/User';
import { importUsersFromCSV } from '../utils/csvImport';
import './ImportPanel.css';

interface ImportPanelProps {
  onImport: (users: User[]) => void;
}

const ImportPanel: React.FC<ImportPanelProps> = ({ onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportErrors([]);

    const result = await importUsersFromCSV(file);
    
    if (result.success) {
      onImport(result.users);
      alert(`Successfully imported ${result.users.length} users`);
    } else {
      setImportErrors(result.errors);
    }

    setImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <button className="btn btn-import" onClick={handleImportClick} disabled={importing} title="Import from CSV">
        📤 {importing ? 'Importing...' : 'Import CSV'}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      {importErrors.length > 0 && (
        <div className="import-errors">
          <strong>Import Errors:</strong>
          <ul>
            {importErrors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}
    </>
  );
};

ImportPanel.propTypes = {
  onImport: PropTypes.func.isRequired
};

export default ImportPanel;
