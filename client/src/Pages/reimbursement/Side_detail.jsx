import React, { useEffect, useState } from "react";
import {
  ModalOverlay,
  ModalContent,
  PageWrapper,
  Header,
  Title,
  CloseButton,
  DateHeading,
  Card,
  ProfileImage,
  Info,
  Label,
  Value,
  RightSection,
  Amount,
} from "./Side_detail.Styles";
import { getGroupedReimbursements } from "../../services/reimbursement"; // import service

const ReimbursementHistory = ({ onClose }) => {
  const [reimbursements, setReimbursements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReimbursements = async () => {
      try {
        const data = await getGroupedReimbursements();
        setReimbursements(data);
      } catch (error) {
        console.error("❌ Failed to fetch reimbursements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReimbursements();
  }, []);

  if (loading) return <p>Loading reimbursements...</p>;

  if (!reimbursements.length) return <p>No reimbursements found.</p>;

  return (
    <ModalOverlay>
      <ModalContent>
        <PageWrapper>
          <Header>
            <Title>Reimbursement History</Title>
            <CloseButton onClick={onClose}>Close</CloseButton>
          </Header>

          {reimbursements.map((section, idx) => (
            <div key={idx}>
              <DateHeading>{section.date}</DateHeading>
              {section.reimbursements.map((item) => (
                <Card key={item.id}>
                  <ProfileImage
                    src={item.profile_pic || "https://via.placeholder.com/50"}
                    alt={item.employee_name}
                  />
                  <Info>
                    <div>
                      <Label>Name</Label>
                      <Value>{item.employee_name}</Value>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Value>{item.department?.name || "N/A"}</Value>
                    </div>
                  </Info>
                  <RightSection>
                    <div>
                      <Label>Position</Label>
                      <Value>{item.designation || "N/A"}</Value>
                    </div>
                    <Amount>₹ {item.amount}</Amount>
                  </RightSection>
                </Card>
              ))}
            </div>
          ))}
        </PageWrapper>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReimbursementHistory;
