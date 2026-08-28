import React, { useEffect, useState } from "react";
import {
  Overlay,
  Modal,
  Header,
  Title,
  CloseButton,
  Row,
  Label,
  Input,
  TextArea,
  Footer,
  SendButton,
} from "./EmailCompose.styles";

import { IoClose } from "react-icons/io5";
import { MdAttachFile } from "react-icons/md";
import API from "../../../services/api";

const EmailCompose = ({ company, onClose }) => {
  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  });

  const [attachment, setAttachment] = useState(null);
  const [sending, setSending] = useState(false);

  // =========================================================
  // SET COMPANY EMAIL / DEFAULT MESSAGE
  // =========================================================

  useEffect(() => {
    if (company) {
      setEmailData({
        to: company.email || "",

        subject:
          "Your Rekory HR Subscription is Expiring Soon",

        message: `Dear ${company.name},

This is a friendly reminder that your Rekory HR subscription is approaching its expiration date.

Subscription Details
----------------------------
Company Name : ${company.name}
Expiry Date   : ${company.expiry_date || "-"}
----------------------------

To ensure uninterrupted access to your Rekory HR services, we kindly request that you renew your subscription before the expiry date.

If you have already completed your renewal, please disregard this email.

Should you require any assistance with the renewal process, please feel free to contact our support team.

Thank you for choosing Rekory HR.`,
      });
    }
  }, [company]);

  // =========================================================
  // INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEmailData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // ATTACHMENT CHANGE
  // =========================================================

  const handleAttachmentChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setAttachment(null);
      return;
    }

    setAttachment(file);
  };

  // =========================================================
  // REMOVE ATTACHMENT
  // =========================================================

  const handleRemoveAttachment = () => {
    setAttachment(null);

    // Reset file input
    const fileInput =
      document.getElementById("email-attachment");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =========================================================
  // SEND EMAIL
  // =========================================================

  const handleSend = async () => {
    if (!emailData.to) {
      alert("Please enter recipient email.");
      return;
    }

    if (!emailData.subject) {
      alert("Please enter subject.");
      return;
    }

    if (!emailData.message) {
      alert("Please enter message.");
      return;
    }

    try {
      setSending(true);

      // =====================================================
      // FORM DATA
      // =====================================================

      const formData = new FormData();

      formData.append("email", emailData.to);
      formData.append("subject", emailData.subject);
      formData.append("message", emailData.message);

      // Company ID
      if (company?.id) {
        formData.append(
          "company_id",
          company.id
        );
      }

      // Attachment
      if (attachment) {
        formData.append(
          "attachment",
          attachment
        );
      }

      // =====================================================
      // DEBUG
      // =====================================================

      console.log("Email Data:");
      console.log("To:", emailData.to);
      console.log("Subject:", emailData.subject);
      console.log("Message:", emailData.message);
      console.log("Attachment:", attachment);
      console.log("Company:", company?.id);

      // =====================================================
      // API REQUEST
      // =====================================================

      const response = await API.post(
        "/invoice/send-email/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        "Email response:",
        response.data
      );

      alert(
        "Email sent successfully!"
      );

      onClose();

    } catch (error) {
      console.error(
        "Failed to send email:",
        error
      );

      console.error(
        "API Error:",
        error.response?.data
      );

      alert(
        error.response?.data?.detail ||
          "Failed to send email."
      );

    } finally {
      setSending(false);
    }
  };

  return (
    <Overlay>
      <Modal>

        {/* ===================================================
            HEADER
        =================================================== */}

        <Header>
          <Title>
            New Message
          </Title>

          <CloseButton
            onClick={onClose}
            type="button"
          >
            <IoClose />
          </CloseButton>
        </Header>

        {/* ===================================================
            TO
        =================================================== */}

        <Row>
          <Label>
            To
          </Label>

          <Input
            type="email"
            name="to"
            value={emailData.to}
            onChange={handleChange}
            placeholder="Recipient Email"
          />
        </Row>

        {/* ===================================================
            SUBJECT
        =================================================== */}

        <Row>
          <Label>
            Subject
          </Label>

          <Input
            type="text"
            name="subject"
            value={emailData.subject}
            onChange={handleChange}
            placeholder="Enter Subject"
          />
        </Row>

        {/* ===================================================
            MESSAGE
        =================================================== */}

        <TextArea
          name="message"
          value={emailData.message}
          onChange={handleChange}
          placeholder="Write your message..."
        />

        {/* ===================================================
            ATTACHMENT
        =================================================== */}

        <Row>
          <Label>
            Attachment
          </Label>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
            }}
          >

            {/* Hidden file input */}

            <input
              id="email-attachment"
              type="file"
              onChange={handleAttachmentChange}
              style={{
                display: "none",
              }}
            />

            {/* Choose file button */}

            <label
              htmlFor="email-attachment"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "9px 14px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                cursor: "pointer",
                background: "#fff",
                fontSize: "14px",
              }}
            >
              <MdAttachFile size={20} />

              Attach File
            </label>

            {/* File name */}

            {attachment && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                }}
              >
                <span>
                  {attachment.name}
                </span>

                <button
                  type="button"
                  onClick={
                    handleRemoveAttachment
                  }
                  style={{
                    border: "none",
                    background:
                      "transparent",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "#d00",
                  }}
                >
                  <IoClose />
                </button>
              </div>
            )}

          </div>
        </Row>

        {/* ===================================================
            FOOTER
        =================================================== */}

        <Footer>
          <SendButton
            onClick={handleSend}
            disabled={sending}
          >
            {sending
              ? "Sending..."
              : "Send"}
          </SendButton>
        </Footer>

      </Modal>
    </Overlay>
  );
};

export default EmailCompose;