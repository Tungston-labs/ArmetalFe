import styled from "styled-components";

/* =========================================================
   MODAL OVERLAY
========================================================= */

export const ModalOverlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(4px);

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 9999;
    padding: 20px;
`;

/* =========================================================
   MODAL
========================================================= */

export const AttendanceModal = styled.div`
    width: 100%;
    max-width: 520px;

    background: #ffffff;
    border-radius: 16px;

    padding: 28px;

    box-sizing: border-box;

    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);

    @media (max-width: 600px) {
        padding: 22px;
        border-radius: 14px;
        max-height: 90vh;
        overflow-y: auto;
    }

    @media (max-width: 400px) {
        padding: 18px;
    }
`;

/* =========================================================
   HEADER
========================================================= */

export const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;

    margin-bottom: 28px;

    @media (max-width: 600px) {
        margin-bottom: 22px;
    }
`;

export const ModalHeaderContent = styled.div`
    flex: 1;
`;

export const ModalTitle = styled.h2`
    margin: 0;

    font-size: 21px;
    font-weight: 700;

    color: #1f2937;

    @media (max-width: 600px) {
        font-size: 19px;
    }
`;

export const ModalSubtitle = styled.p`
    margin: 7px 0 0;

    font-size: 14px;
    color: #6b7280;

    strong {
        color: #374151;
    }

    @media (max-width: 600px) {
        font-size: 13px;
    }
`;

export const CloseButton = styled.button`
    width: 34px;
    height: 34px;

    border: none;
    border-radius: 8px;

    background: #f3f4f6;
    color: #6b7280;

    font-size: 22px;

    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    transition: all 0.2s ease;

    &:hover {
        background: #e5e7eb;
        color: #374151;
    }
`;

/* =========================================================
   FORM GROUP
========================================================= */

export const FormGroup = styled.div`
    margin-bottom: 26px;
`;

export const FormLabel = styled.label`
    display: block;

    margin-bottom: 12px;

    font-size: 14px;
    font-weight: 600;

    color: #374151;
`;

export const OptionalText = styled.span`
    color: #9ca3af;
    font-weight: 400;

    margin-left: 5px;
`;

/* =========================================================
   ATTENDANCE TYPE
========================================================= */

export const AttendanceTypeOptions = styled.div`
    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 12px;

    @media (max-width: 600px) {
        grid-template-columns: 1fr;
    }
`;

export const AttendanceTypeOption = styled.label`
    position: relative;
    cursor: pointer;
`;

export const AttendanceRadio = styled.input`
    position: absolute;

    opacity: 0;

    pointer-events: none;
`;

/* =========================================================
   ATTENDANCE CARD
========================================================= */

export const AttendanceTypeCard = styled.div`
    border: 1px solid #e5e7eb;

    background: #ffffff;

    border-radius: 10px;

    padding: 15px;

    display: flex;
    align-items: center;

    gap: 12px;

    transition: all 0.2s ease;

    &:hover {
        border-color: #cbd5e1;
        background: #f8fafc;
    }

    ${({ selected, type }) =>
        selected &&
        type === "Paid" &&
        `
            border: 2px solid #16a34a;
            background: #f0fdf4;
        `}

    ${({ selected, type }) =>
        selected &&
        type === "Unpaid" &&
        `
            border: 2px solid #dc2626;
            background: #fef2f2;
        `}
`;

/* =========================================================
   RADIO CIRCLE
========================================================= */

export const RadioCircle = styled.div`
    width: 20px;
    height: 20px;

    min-width: 20px;

    border-radius: 50%;

    box-sizing: border-box;

    ${({ selected, type }) => {
        if (selected && type === "Paid") {
            return `
                border: 6px solid #16a34a;
            `;
        }

        if (selected && type === "Unpaid") {
            return `
                border: 6px solid #dc2626;
            `;
        }

        return `
            border: 2px solid #d1d5db;
        `;
    }}
`;

/* =========================================================
   TYPE TEXT
========================================================= */

export const AttendanceTypeContent = styled.div`
    flex: 1;
`;

export const AttendanceTypeTitle = styled.div`
    font-size: 14px;
    font-weight: 600;

    ${({ type }) =>
        type === "Paid"
            ? `
                color: #166534;
            `
            : `
                color: #b91c1c;
            `}
`;

export const AttendanceTypeDescription = styled.div`
    font-size: 12px;

    color: #6b7280;

    margin-top: 2px;
`;

/* =========================================================
   NOTE
========================================================= */

export const NoteWrapper = styled.div`
    position: relative;
`;

export const NoteInput = styled.textarea`
    width: 100%;

    min-height: 120px;

    box-sizing: border-box;

    border: 1px solid #d1d5db;

    border-radius: 10px;

    padding: 13px 14px;

    font-size: 14px;

    color: #374151;

    background: #ffffff;

    resize: vertical;

    outline: none;

    font-family: inherit;

    line-height: 1.5;

    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;

    &::placeholder {
        color: #9ca3af;
    }

    &:focus {
        border-color: #1976d2;

        box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.08);
    }
`;

export const NoteCounter = styled.div`
    text-align: right;

    margin-top: 5px;

    font-size: 11px;

    color: #9ca3af;
`;

/* =========================================================
   APPROVED BY
========================================================= */

export const ApprovedInput = styled.input`
    width: 100%;

    height: 46px;

    box-sizing: border-box;

    border: 1px solid #d1d5db;

    border-radius: 10px;

    padding: 0 14px;

    font-size: 14px;

    color: #374151;

    outline: none;

    background: #ffffff;

    transition:
        border-color 0.2s ease,
        box-shadow 0.2s ease;

    &::placeholder {
        color: #9ca3af;
    }

    &:focus {
        border-color: #1976d2;

        box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.08);
    }
`;

/* =========================================================
   FOOTER
========================================================= */

export const ModalFooter = styled.div`
    display: flex;

    justify-content: flex-end;

    gap: 10px;

    padding-top: 18px;

    border-top: 1px solid #f0f0f0;

    @media (max-width: 600px) {
        flex-direction: column-reverse;
    }
`;

/* =========================================================
   BUTTONS
========================================================= */

export const ModalButton = styled.button`
    height: 42px;

    padding: 0 20px;

    border-radius: 8px;

    font-size: 14px;

    font-weight: 500;

    cursor: pointer;

    transition: all 0.2s ease;

    @media (max-width: 600px) {
        width: 100%;
    }
`;

export const CancelButton = styled(ModalButton)`
    border: 1px solid #d1d5db;

    background: #ffffff;

    color: #4b5563;

    &:hover {
        background: #f9fafb;
        border-color: #9ca3af;
    }
`;

export const SaveButton = styled(ModalButton)`
    padding: 0 22px;

    border: none;

    background: #1976d2;

    color: #ffffff;

    font-weight: 600;

    box-shadow: 0 4px 10px rgba(25, 118, 210, 0.2);

    &:hover {
        background: #1565c0;
    }
`;