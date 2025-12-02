import React, { useEffect, useState } from "react";
import {
  DetailsWrapper,
  LeftSection,
  ProfileCard,
  ProfileImage,
  RightSection,
  GridContainer,
  DetailCard,
  CardHeader,
  CardLabel,
  CardValue,
  MailRow,
  MailButton,
  IconWrapper
} from "./EmployeeDetails.styles";

import { FaEnvelope, FaIdBadge, FaUserTie, FaBuilding, FaCalendarAlt } from "react-icons/fa";
import { MdAttachEmail } from "react-icons/md";
import { FaProjectDiagram } from "react-icons/fa";
import { BsPersonFillExclamation } from "react-icons/bs";
import MailModal from "./MailModal";
const EmployeeDetails = ({ employee }) => {

  if (!employee) return <div>No employee data found</div>;

  const [isMobile, setIsMobile] = useState(false);
const [openMailModal, setOpenMailModal] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 1439);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const fields = [
  { label: "Employee ID", value: employee.employee_id, icon: <FaIdBadge size={14} /> },
  { label: "Department", value: employee.department, icon: <FaBuilding size={14} /> },
  { label: "Email", value: employee.email, icon: <MdAttachEmail size={14} /> },
  { label: "Role", value: employee.role, icon: <FaUserTie size={14} /> },
  { label: "Joining Date", value: employee.joining_date, icon: <FaCalendarAlt size={14} /> },

  {
    label: "Working Projects",
    value: employee.projects?.map((p) => p.name).join(", ") || "—",
    icon: <FaProjectDiagram size={14} />
  },

  ...(employee.leave_taken > 0
    ? [
        {
          label: "Leave Taken",
          value: employee.leave_taken,
          icon: <BsPersonFillExclamation size={14} />,
        }
      ]
    : []),
];


  return (
    <DetailsWrapper>
      <LeftSection>
        <ProfileCard>
          <ProfileImage
            src={employee.profile_pic || "https://via.placeholder.com/150"}
            alt="Profile"
          />
          <CardValue >
            {employee.name}
          </CardValue>
          <CardLabel>
            {employee.designation}
          </CardLabel>
        </ProfileCard>
      </LeftSection>
      <RightSection>
        <GridContainer>
          {fields.map((field, index) => (
            <DetailCard key={index}>
              <CardHeader>
                <IconWrapper>{field.icon}</IconWrapper>
                <CardLabel>{field.label}</CardLabel>
              </CardHeader>
     <CardValue>
  {isMobile
    ? String(field.value)?.length > 10
      ? String(field.value)?.slice(0, 10) + "..."
      : field.value
    : field.value}
</CardValue>


            </DetailCard>
          ))}
        </GridContainer>

        <MailRow>
         <MailButton onClick={() => setOpenMailModal(true)}>
  Send Mail
</MailButton>

        </MailRow>
      </RightSection>
      <MailModal
  isOpen={openMailModal}
  onClose={() => setOpenMailModal(false)}
  employee={employee}
/>

    </DetailsWrapper>
  );
};

export default EmployeeDetails;
