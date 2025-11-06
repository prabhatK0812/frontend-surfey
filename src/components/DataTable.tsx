
"use client";

import { Row } from "@/features/table/tableSlice";
import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  setRows,
  deleteRow,
  addRows,
  updateRow,
} from "@/features/table/tableSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  TablePagination,
  Button,
  TableSortLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";
import ManageColumnsModal from "./ManageColumnsModal";
import { importCSV, exportCSV } from "@/utils/csv";

type Order = "asc" | "desc" | null;

const DataTable = () => {
  const dispatch = useDispatch();
  const rows = useSelector((s: RootState) => s.table.rows);
  const columns = useSelector((s: RootState) => s.table.columns);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [manageOpen, setManageOpen] = useState(false);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<Order>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Row> & { id?: string }>(
    {}
  );

  const visibleCols = useMemo(() => columns.filter((c) => c.visible), [columns]);

  const filtered = useMemo(() => {
    let data = rows;
    if (query) {
      const q = query.toLowerCase();
      data = data.filter((r) =>
        visibleCols.some((c) =>
          String(r[c.key] ?? "").toLowerCase().includes(q)
        )
      );
    }
    if (sortKey && sortOrder) {
      data = [...data].sort((a, b) => {
        const va = a[sortKey];
        const vb = b[sortKey];
        if (!isNaN(Number(va)) && !isNaN(Number(vb))) {
          return sortOrder === "asc"
            ? Number(va) - Number(vb)
            : Number(vb) - Number(va);
        }
        const sa = (va ?? "").toString().toLowerCase();
        const sb = (vb ?? "").toString().toLowerCase();
        if (sa < sb) return sortOrder === "asc" ? -1 : 1;
        if (sa > sb) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [rows, query, visibleCols, sortKey, sortOrder]);

  // Delete confirmation
  const handleDelete = (id: string) => {
    if (confirm("Delete this row?")) {
      dispatch(deleteRow(id));
    }
  };

  // CSV Import
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const parsed = await importCSV(file);
      if (parsed.length) {
        const withId = parsed.map((r, i) => ({
          id: String(Date.now() + i),
          ...r,
        }));
        dispatch(addRows(withId));
      } else {
        alert("No rows parsed or invalid CSV");
      }
    } catch (err) {
      alert("CSV parse error");
    }
    e.currentTarget.value = "";
  };

  // Sorting
  const handleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortOrder("asc");
      return;
    }
    if (sortOrder === "asc") setSortOrder("desc");
    else if (sortOrder === "desc") setSortOrder(null);
    else setSortOrder("asc");
  };

  // Edit handlers
  const handleEdit = (rowId: string) => {
    const current = rows.find((r) => r.id === rowId);
    if (current) {
      setEditingId(rowId);
      setEditValues(current);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleSave = () => {
    if (editingId) {
      if (editValues.age && isNaN(Number(editValues.age))) {
        alert("Age must be a number");
        return;
      }
      dispatch(updateRow(editValues as Row));
      setEditingId(null);
      setEditValues({});
    }
  };

  // Save all / cancel all 
  const handleSaveAll = () => {
    alert("All changes saved!");
  };
  const handleCancelAll = () => {
    window.location.reload();
  };

  return (
    <Paper sx={{ p: 2 }}>
      {/*  Toolbar  */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        {/* Search box */}
        <TextField
          size="small"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setPage(0);
              setTimeout(() => setQuery(""), 1000); 
            }
          }}
          onBlur={() => {
            if (query.trim() !== "") {
              setTimeout(() => setQuery(""), 1000);
            }
          }}
        />

        <Button startIcon={<UploadFileIcon />} component="label">
          Import
          <input hidden type="file" accept="text/csv" onChange={handleImport} />
        </Button>
        <Button
          onClick={() => exportCSV(filtered, visibleCols)}
          startIcon={<DownloadIcon />}
        >
          Export CSV
        </Button>
        <Button onClick={() => setManageOpen(true)}>Manage Columns</Button>

        {/* Save All / Cancel All button */}
        <Button variant="outlined" color="success" onClick={handleSaveAll}>
          Save All
        </Button>
        <Button variant="outlined" color="error" onClick={handleCancelAll}>
          Cancel All
        </Button>
      </div>

      {/*  Table  */}
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              {visibleCols.map((c) => (
                <TableCell key={c.key}>
                  <TableSortLabel
                    active={sortKey === c.key && !!sortOrder}
                    direction={
                      sortOrder === null ? "asc" : (sortOrder as "asc" | "desc")
                    }
                    onClick={() => handleSort(c.key)}
                  >
                    {c.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((r) => (
                <TableRow key={r.id}>
                  {visibleCols.map((c) => (
                    <TableCell key={c.key}>
                      {editingId === r.id ? (
                        <TextField
                          size="small"
                          value={editValues[c.key] ?? ""}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              [c.key]: e.target.value,
                            })
                          }
                        />
                      ) : (
                        String(r[c.key] ?? "")
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editingId === r.id ? (
                      <>
                        <IconButton onClick={handleSave} color="success">
                          <SaveIcon />
                        </IconButton>
                        <IconButton onClick={handleCancel} color="error">
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => handleEdit(r.id)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(r.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={(event, newPage) => {
          const maxPage = Math.max(
            0,
            Math.ceil(filtered.length / rowsPerPage) - 1
          );
          if (newPage >= 0 && newPage <= maxPage) setPage(newPage);
        }}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={() => {}}
        rowsPerPageOptions={[rowsPerPage]}
        labelRowsPerPage=""
      />

      <ManageColumnsModal
        open={manageOpen}
        onClose={() => setManageOpen(false)}
      />
    </Paper>
  );
};

export default DataTable;
