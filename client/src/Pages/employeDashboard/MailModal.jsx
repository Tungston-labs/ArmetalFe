import React, { useState, useEffect } from "react";
import {
  ModalOverlay,
  ModalBox,
  ModalHeader,
  CloseBtn,
  Input,
  TextArea,
  SendBtn,
  Row,
  Label
} from "./MailModal.styles";
import { sendEmail } from "../../services/employeeService";

const MailModal = ({ isOpen, onClose, employee }) => {
  const [form, setForm] = useState({ to: "", subject: "", body: "" });
  const [loading, setLoading] = useState(false);

  // Reset form whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({
        to: employee?.email || "",
        subject: "",
        body: "",
      });
    }
  }, [isOpen, employee]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSend = async () => {
    if (!form.to || !form.subject || !form.body) {
      alert("Please fill all fields!");
      return;
    }

    try {
      setLoading(true);
      await sendEmail(form);
      alert("Email sent successfully!");
      // Reset form after sending
      setForm({
        to: employee?.email || "",
        subject: "",
        body: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to send email!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <span>New Message</span>
          <CloseBtn onClick={onClose}>✕</CloseBtn>
        </ModalHeader>

        <Row>
          <Label>To</Label>
          <Input
            type="email"
            name="to"
            value={form.to}
            onChange={handleChange}
          />
        </Row>

        <Row>
          <Label>Subject</Label>
          <Input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Enter subject"
          />
        </Row>

        <Row>
          <Label>Message</Label>
          <TextArea
            name="body"
            value={form.body}
            onChange={handleChange}
            placeholder="Write your message..."
          />
        </Row>

        <SendBtn onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </SendBtn>
      </ModalBox>
    </ModalOverlay>
  );
};

export default MailModal;
