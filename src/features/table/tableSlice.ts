

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Column {
  key: string;
  label: string;
  visible: boolean;
}

export interface Row {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  [key: string]: any;
}

interface TableState {
  columns: Column[];
  rows: Row[];
}

const initialState: TableState = {
  columns: [
    { key: 'name', label: 'Name', visible: true },
    { key: 'email', label: 'Email', visible: true },
    { key: 'age', label: 'Age', visible: true },
    { key: 'role', label: 'Role', visible: true },
  ],
  rows: [],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setColumns: (state, action: PayloadAction<Column[]>) => {
      state.columns = action.payload;
    },
    toggleColumn: (state, action: PayloadAction<string>) => {
      const col = state.columns.find((c) => c.key === action.payload);
      if (col) col.visible = !col.visible;
    },
    setRows: (state, action: PayloadAction<Row[]>) => {
      state.rows = action.payload;
    },
    deleteRow: (state, action: PayloadAction<string>) => {
      state.rows = state.rows.filter((r) => r.id !== action.payload);
    },
    addRows: (state, action: PayloadAction<Row[]>) => {
      state.rows.push(...action.payload);
    },
    updateRow: (state, action: PayloadAction<Row>) => {
      const index = state.rows.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.rows[index] = { ...state.rows[index], ...action.payload };
      }
    },
  },
});

export const {
  setColumns,
  toggleColumn,
  setRows,
  deleteRow,
  addRows,
  updateRow,
} = tableSlice.actions;

export default tableSlice.reducer;
