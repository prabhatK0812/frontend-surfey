
"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { toggleColumn, setColumns } from "@/features/table/tableSlice";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ManageColumnsModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const dispatch = useDispatch();
  const columns = useSelector((s: RootState) => s.table.columns);
  const [newKey, setNewKey] = React.useState("");
  const [newLabel, setNewLabel] = React.useState("");

  //  handle reorder logic
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const reordered = Array.from(columns);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    dispatch(setColumns(reordered));
  };

  //  add new column
  const handleAdd = () => {
    if (!newKey.trim() || !newLabel.trim()) return;
    const next = [...columns, { key: newKey, label: newLabel, visible: true }];
    dispatch(setColumns(next));
    setNewKey("");
    setNewLabel("");
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Columns</DialogTitle>
      <DialogContent>
        {/*  Drag & Drop List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="cols">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                {columns.map((c, index) => (
                  <Draggable
                    key={c.key}
                    draggableId={c.key}
                    index={index}
                  >
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          background: "#f7f7f7",
                          borderRadius: 6,
                          padding: "4px 8px",
                          ...prov.draggableProps.style,
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={c.visible}
                              onChange={() => dispatch(toggleColumn(c.key))}
                            />
                          }
                          label={`${c.label} (${c.key})`}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/*  Add new column section */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginTop: 16,
            flexWrap: "wrap",
          }}
        >
          <TextField
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="field key (e.g. department)"
            size="small"
          />
          <TextField
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="label (e.g. Department)"
            size="small"
          />
          <Button onClick={handleAdd} variant="outlined">
            Add
          </Button>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageColumnsModal;
