import styled from "styled-components";

export const AttendancePage = styled.main`
  width: 100%;
  min-height: 100vh;
  background: #f7f8fc;
  padding: 24px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
  }

  @media (max-width: 480px) {
    padding: 12px;
  }

  @media print {
    padding: 0;
    background: #ffffff;
  }
`;

export const AttendanceContainer = styled.div`
  width: 100%;
  /* max-width: 1400px; */
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #eeeeee;
  box-sizing: border-box;

  @media print {
    max-width: 100%;
    border: none;
  }
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 22px 24px;
  border-bottom: 1px solid #eeeeee;

  @media (max-width: 600px) {
    align-items: flex-start;
    flex-direction: column;
    padding: 18px 16px;
  }

  @media print {
    padding: 10px 0;
  }
`;

export const HeaderLeft = styled.div`
  min-width: 0;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const PageTitle = styled.h1`
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

export const PageSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6b7280;
`;

export const BackButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  margin-bottom: 10px;

  font-size: 13px;
  font-weight: 500;
  color: #555;
  cursor: pointer;

  &:hover {
    color: #111;
  }

  @media print {
    display: none;
  }
`;

export const PrintButton = styled.button`
  border: 1px solid #d9d9d9;
  background: #ffffff;
  color: #1a1a1a;

  padding: 8px 16px;
  border-radius: 7px;

  font-size: 13px;
  font-weight: 500;

  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    background: #f7f8fa;
  }

  @media (max-width: 600px) {
    width: 100%;
  }

  @media print {
    display: none !important;
  }
`;

export const CardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  padding: 20px 24px;

  border-bottom: 1px solid #eeeeee;

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    padding: 16px;
  }
`;

const cardColors = {
  present: {
    bg: "#eaf3de",
    text: "#3b6d11",
  },

  absent: {
    bg: "#fdeaea",
    text: "#dc2626",
  },

  lop: {
    bg: "#faeeda",
    text: "#854f0b",
  },

  paid: {
    bg: "#e7f7ed",
    text: "#16a34a",
  },

  holiday: {
    bg: "#e8f0fe",
    text: "#2563eb",
  },

  default: {
    bg: "#f7f8fa",
    text: "#1a1a1a",
  },
};

export const Card = styled.div`
  background: ${({ type }) =>
    cardColors[type]?.bg ||
    cardColors.default.bg};

  border-radius: 10px;

  padding: 16px 14px;

  text-align: center;
`;

export const CardTitle = styled.div`
  font-size: 11px;
  font-weight: 500;

  color: #6b7280;

  text-transform: uppercase;
  letter-spacing: 0.5px;

  margin-bottom: 6px;
`;

export const CardValue = styled.div`
  font-size: 26px;
  font-weight: 500;

  color: ${({ type }) =>
    cardColors[type]?.text ||
    cardColors.default.text};
`;

export const AttendanceTableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;

  @media print {
    overflow: visible;
  }
`;

export const AttendanceTable = styled.table`
  width: 100%;
  min-width: 700px;

  border-collapse: collapse;
  table-layout: fixed;

  @media print {
    min-width: 100%;
  }
`;

export const TableHeader = styled.th`
  position: sticky;
  top: 0;

  background: #f7f8fa;

  border-bottom: 1px solid #eeeeee;

  padding: 11px 16px;

  text-align: left;

  font-size: 12px;
  font-weight: 500;

  color: #6b7280;

  text-transform: uppercase;
  letter-spacing: 0.4px;

  /* &:last-child {
    text-align: right;
  } */
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background: #fafafa;
  }

  &:hover {
    background: #f1f5f9;
  }

  @media print {
    &:hover {
      background: transparent;
    }
  }
`;

export const TableCell = styled.td`
  padding: 11px 16px;

  border-bottom: 1px solid #eeeeee;

  font-size: 14px;
  color: #1a1a1a;

  white-space: nowrap;

  /* &.hours-cell {
    text-align: right;
  } */

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 13px;
  }
`;

const badgeStyles = {
  paid: {
    bg: "#e7f7ed",
    color: "#16a34a",
  },

  present: {
    bg: "#eaf3de",
    color: "#3b6d11",
  },

  active: {
    bg: "#eaf3de",
    color: "#3b6d11",
  },

  half_day: {
    bg: "#faeeda",
    color: "#854f0b",
  },

  leave: {
    bg: "#e6f1fb",
    color: "#185fa5",
  },

  holiday: {
    bg: "#e8f0fe",
    color: "#2563eb",
  },

  absent: {
    bg: "#fdeaea",
    color: "#dc2626",
  },

  unpaid: {
    bg: "#fdeaea",
    color: "#dc2626",
  },

  off: {
    bg: "#faeeda",
    color: "#854f0b",
  },

  missed_punchout: {
    bg: "#faeeda",
    color: "#854f0b",
  },
};

export const StatusBadge = styled.span`
  display: inline-block;

  padding: 4px 10px;

  border-radius: 5px;

  font-size: 12px;
  font-weight: 600;

  white-space: nowrap;

  background: ${({ status }) =>
    badgeStyles[status]?.bg ||
    "#fcebeb"};

  color: ${({ status }) =>
    badgeStyles[status]?.color ||
    "#a32d2d"};
`;

export const EmptyMessage = styled.div`
  width: 100%;
  padding: 40px 20px;

  text-align: center;

  color: #6b7280;

  font-size: 14px;
`;

export const EditButton = styled.button`
  border: none;
  background: #f3f6ff;
  color: #3155d4;
  padding: 7px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: #3155d4;
    color: #fff;
  }
`;

/* ----------------------------------------- */
/* Modal Overlay */
/* ----------------------------------------- */

export const EditModalOverlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.45);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 20px;

  z-index: 9999;
`;

/* ----------------------------------------- */
/* Modal */
/* ----------------------------------------- */

export const EditModal = styled.div`
  width: 100%;
  max-width: 500px;

  background: #ffffff;

  border-radius: 12px;

  padding: 24px;

  box-sizing: border-box;

  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);

  max-height: 90vh;
  overflow-y: auto;

  @media (max-width: 600px) {
    padding: 18px;
    border-radius: 10px;
  }
`;

/* ----------------------------------------- */
/* Modal Header */
/* ----------------------------------------- */

export const ModalHeader = styled.div`
  display: flex;

  align-items: flex-start;

  justify-content: space-between;

  gap: 15px;

  margin-bottom: 24px;
`;

/* ----------------------------------------- */
/* Modal Title */
/* ----------------------------------------- */

export const ModalTitle = styled.h3`
  margin: 0;

  font-size: 20px;

  font-weight: 700;

  color: #1f2937;
`;

/* ----------------------------------------- */
/* Close */
/* ----------------------------------------- */

export const CloseButton = styled.button`
  width: 32px;
  height: 32px;

  border: none;

  background: #f5f5f5;

  border-radius: 50%;

  font-size: 22px;

  line-height: 1;

  cursor: pointer;

  color: #555;

  &:hover {
    background: #eeeeee;
  }
`;

/* ----------------------------------------- */
/* Form */
/* ----------------------------------------- */

export const FormGroup = styled.div`
  display: flex;

  flex-direction: column;

  gap: 7px;

  margin-bottom: 18px;
`;

export const FormLabel = styled.label`
  font-size: 13px;

  font-weight: 600;

  color: #374151;
`;

export const FormSelect = styled.select`
  width: 100%;

  height: 42px;

  padding: 0 12px;

  border: 1px solid #d9dce3;

  border-radius: 7px;

  background: #fff;

  color: #333;

  outline: none;

  font-size: 14px;

  &:focus {
    border-color: #3155d4;
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;

  box-sizing: border-box;

  padding: 12px;

  border: 1px solid #d9dce3;

  border-radius: 7px;

  resize: vertical;

  font-size: 14px;

  font-family: inherit;

  outline: none;

  &:focus {
    border-color: #3155d4;
  }
`;

/* ----------------------------------------- */
/* Audit */
/* ----------------------------------------- */

export const AuditInfo = styled.div`
  background: #f8f9fc;

  border: 1px solid #e6e8ef;

  border-radius: 8px;

  padding: 13px;

  margin-top: 5px;

  margin-bottom: 20px;
`;

export const AuditTitle = styled.div`
  font-size: 13px;

  font-weight: 700;

  color: #333;

  margin-bottom: 7px;
`;

export const AuditText = styled.div`
  font-size: 12px;

  color: #777;

  line-height: 1.5;
`;

/* ----------------------------------------- */
/* Modal Actions */
/* ----------------------------------------- */

export const ModalActions = styled.div`
  display: flex;

  justify-content: flex-end;

  gap: 10px;

  margin-top: 20px;

  @media (max-width: 480px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;

/* ----------------------------------------- */
/* Cancel */
/* ----------------------------------------- */

export const CancelButton = styled.button`
  height: 40px;

  padding: 0 18px;

  border: 1px solid #d9dce3;

  background: #fff;

  color: #555;

  border-radius: 7px;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

/* ----------------------------------------- */
/* Save */
/* ----------------------------------------- */

export const SaveButton = styled.button`
  height: 40px;

  padding: 0 20px;

  border: none;

  background: #3155d4;

  color: #fff;

  border-radius: 7px;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;

  &:hover {
    background: #2545b8;
  }
`;

export const NoteCell = styled.div`
  position: relative;

  display: inline-block;

  width: 180px;
  max-width: 100%;

  cursor: help;

  vertical-align: middle;

  @media (max-width: 1200px) {
    width: 160px;
  }

  @media (max-width: 992px) {
    width: 150px;
  }

  @media (max-width: 768px) {
    width: 140px;
  }

  @media (max-width: 480px) {
    width: 130px;
  }
`;

export const NoteText = styled.span`
  display: block;

  width: 100%;
  max-width: 100%;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 13px;

  color: #555;

  line-height: 1.5;

  transition: color 0.2s ease;

  ${NoteCell}:hover & {
    color: #3155d4;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

export const NoteTooltip = styled.div`
  position: absolute;

  left: 0;

  /* bottom: calc(100% + 10px); */

  width: 280px;

  max-width: min(280px, calc(100vw - 32px));

  padding: 12px 14px;

  box-sizing: border-box;

  background: #222;

  color: #fff;

  border-radius: 8px;

  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);

  font-size: 12px;

  line-height: 1.5;

  white-space: normal;

  word-break: break-word;

  overflow-wrap: anywhere;

  z-index: 99999;

  opacity: 0;

  visibility: hidden;

  pointer-events: none;

  transform: translateY(5px);

  transition:
    opacity 0.18s ease,
    visibility 0.18s ease,
    transform 0.18s ease;

  ${NoteCell}:hover & {
    opacity: 1;

    visibility: visible;

    transform: translateY(0);
  }

  &::after {
    content: "";

    position: absolute;

    left: 18px;

    top: 100%;

    width: 0;
    height: 0;

    border-left: 6px solid transparent;

    border-right: 6px solid transparent;

    border-top: 6px solid #222;
  }

  @media (max-width: 768px) {
    width: 240px;

    max-width: calc(100vw - 24px);

    padding: 10px 12px;

    font-size: 11px;
  }

  @media (max-width: 480px) {
    width: 220px;

    max-width: calc(100vw - 20px);

    padding: 10px;

    font-size: 11px;

    line-height: 1.45;
  }
`;

export const TooltipLabel = styled.div`
  margin-bottom: 5px;

  font-size: 10px;

  font-weight: 700;

  color: #aeb8ff;

  text-transform: uppercase;

  letter-spacing: 0.5px;

  @media (max-width: 480px) {
    font-size: 9px;
  }
`;

export const TooltipContent = styled.div`
  color: #ffffff;

  font-size: 12px;

  line-height: 1.5;

  white-space: normal;

  word-break: break-word;

  overflow-wrap: anywhere;

  @media (max-width: 768px) {
    font-size: 11px;
  }

  @media (max-width: 480px) {
    font-size: 10.5px;
    line-height: 1.45;
  }
`;

export const NoNote = styled.span`
  display: inline-block;

  color: #999;

  font-size: 13px;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;