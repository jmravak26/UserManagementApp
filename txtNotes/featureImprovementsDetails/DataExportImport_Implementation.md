# Data Export/Import Implementation

## Overview
This document outlines the implementation of data export/import functionality for the User Management App, including CSV import, print-friendly user directory, and integration with existing export features.

## Features Implemented

### 1. CSV Import
- **File upload** via hidden input triggered by button
- **CSV parsing** using PapaParse library
- **Strict validation** for required fields
- **Error reporting** for invalid rows
- **Bulk user creation** from imported data

### 2. Print-Friendly User Directory
- **Print selected users** or all filtered users
- **Formatted HTML table** with user information
- **Auto-trigger print dialog** on load
- **Print-optimized styles** (hidden buttons, clean layout)
- **Avatar images included** in printed output

### 3. Import Panel Component
- **Compact header integration** between search and add user
- **Import CSV button** with loading state
- **Floating error notifications** for import issues
- **File type validation** (CSV only)

### 4. Print Button Component
- **Separate component** for print functionality
- **Selection count indicator** showing number of selected users
- **Smart printing** - prints selected users if any, otherwise all filtered
- **Dynamic tooltip** based on selection state

## Technical Implementation

### CSV Import Requirements
**Required fields (no auto-generation):**
- Name
- Username
- Email
- Birth Date
- Role (validated: must be Admin, Manager, or User)

**Optional fields:**
- Avatar (empty string if not provided)
- Phone (empty string if not provided)

**Auto-generated fields:**
- Status (always set to Active)
- ID (timestamp + index)

### Import Validation
- **Row-by-row validation** with specific error messages
- **Missing field detection** for required columns
- **Role validation** against UserRole enum (Admin, Manager, User)
- **Invalid role rejection** with helpful error message
- **Unique ID generation** using timestamp + index
- **Error collection** without stopping entire import

### Print Functionality
- **Dynamic user selection** - prints selected users if any, otherwise all filtered
- **New window generation** with formatted HTML
- **Responsive table layout** with proper styling
- **Avatar display** with circular styling
- **Auto-print trigger** via window.onload

## File Structure
```
src/
├── components/
│   ├── ImportPanel.tsx            # CSV import component
│   ├── ImportPanel.css            # Import button styling
│   ├── PrintButton.tsx            # Print button component
│   └── PrintButton.css            # Print button styling
├── pages/
│   ├── UserListPage.tsx           # Integrated import & print
│   └── UserListPage.css           # Responsive header styles
├── store/
│   └── userSlice.ts               # Added bulkImportUsers action
└── utils/
    ├── csvImport.ts               # CSV parsing and validation
    └── printDirectory.ts          # Print HTML generation
```

## Future Enhancements
- **Excel export** (.xlsx format)
- **Import preview** before confirming
- **Column mapping** for flexible CSV formats
- **Batch validation** with detailed report
- **Import history** tracking
- **Template download** for correct CSV format