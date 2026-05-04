import React, { useState } from "react";
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  CardsWrapper,
  Card,
  CardTitle,
  CardValue,
  AttendanceTableWrapper,
  AttendanceTable,
  TableHeader,
  TableRow,
  TableCell,
  StatusBadge,
} from "./EmployeeAttendanceModal.styles";

const STATUS_OPTIONS = ["present", "absent", "half_day", "leave", "holiday"];

const EmployeeAttendanceModal = ({ employee, monthName, isOpen, onClose, onSave }) => {
  if (!isOpen || !employee) return null;

  const [records, setRecords] = useState(employee.daily_records || []);
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [saving, setSaving] = useState(false);

  const workingDays = employee.working_days ?? 0;
  const presentCount = records.filter(r => r.status === "present").length;
  const absentCount  = records.filter(r => r.status === "absent").length;
  const lopCount     = employee.lop_days ?? 0;

  const getStatusLabel = (status) => {
    switch ((status || "").toLowerCase()) {
      case "present":  return { text: "Present",  key: "present"  };
      case "half_day": return { text: "Half Day", key: "half_day" };
      case "leave":    return { text: "Leave",    key: "leave"    };
      case "holiday":  return { text: "Holiday",  key: "holiday"  };
      default:         return { text: "Absent",   key: "absent"   };
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("en-GB", { month: "short" });
    return `${day} ${month}`;
  };

  const handleEditClick = (idx, rec) => {
    setEditingIdx(idx);
    setEditValues({ status: rec.status, total_hours: rec.total_hours ?? 0 });
  };

  const handleCancel = () => {
    setEditingIdx(null);
    setEditValues({});
  };

  const handleSaveRow = async (idx) => {
    const updated = records.map((r, i) =>
      i === idx ? { ...r, ...editValues } : r
    );
    setRecords(updated);
    setEditingIdx(null);

    if (onSave) {
      setSaving(true);
      try {
        await onSave({ record: updated[idx] });
      } finally {
        setSaving(false);
      }
    }
  };

  const cards = [
    { label: "Working Days", value: workingDays,  type: "default" },
    { label: "Present",      value: presentCount, type: "present" },
    { label: "Absent",       value: absentCount,  type: "absent"  },
    { label: "LOP",          value: lopCount,     type: "lop"     },
  ];

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>

        <ModalHeader>
          <div>
            <ModalTitle>{employee.employee_name}</ModalTitle>
            <span style={{ fontSize: "13px", color: "#6b7280" }}>
              {monthName} — Attendance Summary
            </span>
          </div>
          <CloseButton onClick={onClose} aria-label="Close">&#x2715;</CloseButton>
        </ModalHeader>

        <CardsWrapper>
          {cards.map((c) => (
            <Card key={c.label} type={c.type}>
              <CardTitle>{c.label}</CardTitle>
              <CardValue type={c.type}>{c.value}</CardValue>
            </Card>
          ))}
        </CardsWrapper>

        <AttendanceTableWrapper>
          <AttendanceTable>
            <thead>
              <tr>
                <TableHeader style={{ width: "22%" }}>Date</TableHeader>
                <TableHeader style={{ width: "36%" }}>Status</TableHeader>
                <TableHeader style={{ width: "22%", textAlign: "right" }}>Hours</TableHeader>
                <TableHeader style={{ width: "20%", textAlign: "center" }}>Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <TableCell colSpan={4} style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}>
                    No records available
                  </TableCell>
                </tr>
              ) : (
                records.map((rec, idx) => {
                  const label = getStatusLabel(rec.status);
                  const isEditing = editingIdx === idx;

                  return (
                    <TableRow key={idx}>
                      {/* Date */}
                      <TableCell style={{ fontWeight: "500", color: "#1a1a1a" }}>
                        {formatDate(rec.date)}
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        {isEditing ? (
                          <select
                            value={editValues.status}
                            onChange={(e) => setEditValues(prev => ({ ...prev, status: e.target.value }))}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid #ddddee",
                              fontSize: "13px",
                              color: "#1a1a1a",
                              background: "#fff",
                              cursor: "pointer",
                              width: "100%",
                            }}
                          >
                            {STATUS_OPTIONS.map(s => (
                              <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <StatusBadge status={label.key}>{label.text}</StatusBadge>
                        )}
                      </TableCell>

                      {/* Hours */}
                      <TableCell style={{ textAlign: "right" }}>
                        {isEditing ? (
                          <input
                            type="number"
                            min="0"
                            max="24"
                            step="0.5"
                            value={editValues.total_hours}
                            onChange={(e) => setEditValues(prev => ({ ...prev, total_hours: e.target.value }))}
                            style={{
                              width: "70px",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              border: "1px solid #ddddee",
                              fontSize: "13px",
                              textAlign: "right",
                              color: "#1a1a1a",
                            }}
                          />
                        ) : (
                          <span style={{ color: "#6b7280", fontVariantNumeric: "tabular-nums" }}>
                            {Number(rec.total_hours || 0).toFixed(2)}h
                          </span>
                        )}
                      </TableCell>

                      {/* Action buttons */}
                      <TableCell style={{ textAlign: "center" }}>
                        {isEditing ? (
                          <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                            <button
                              onClick={() => handleSaveRow(idx)}
                              disabled={saving}
                              style={{
                                padding: "4px 10px",
                                borderRadius: "6px",
                                border: "none",
                                background: "#304eb0",
                                color: "#fff",
                                fontSize: "12px",
                                fontWeight: "500",
                                cursor: "pointer",
                              }}
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancel}
                              style={{
                                padding: "4px 10px",
                                borderRadius: "6px",
                                border: "1px solid #eeeeee",
                                background: "#fff",
                                color: "#6b7280",
                                fontSize: "12px",
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEditClick(idx, rec)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: "6px",
                              border: "1px solid #eeeeee",
                              background: "#f7f8fa",
                              color: "#304eb0",
                              fontSize: "12px",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </tbody>
          </AttendanceTable>
        </AttendanceTableWrapper>

      </ModalContainer>
    </ModalOverlay>
  );
};

export default EmployeeAttendanceModal;