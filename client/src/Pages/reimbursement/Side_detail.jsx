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
import { getGroupedReimbursements } from "../../services/reimbursement"; // adjust path if needed

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

  if (loading) return <div>Loading reimbursements...</div>;

  return (
    <ModalOverlay>
      <ModalContent>
        <PageWrapper>
          <Header>
            <Title>Reimbursement History</Title>
            <CloseButton onClick={onClose}>Close</CloseButton>
          </Header>

          {reimbursements.length === 0 ? (
            <p>No reimbursements found.</p>
          ) : (
            reimbursements.map((section, idx) => (
              <div key={idx}>
                <DateHeading>{section.date}</DateHeading>
                {section.reimbursements.map((item) => (
                  <Card key={item.id}>
                    <ProfileImage
                      src={item.employee_image || "https://via.placeholder.com/50"}
                      alt={item.employee_name || "Employee"}
                    />
                    <Info>
                      <div>
                        <Label>Name</Label>
                        <Value>{item.employee_name || "N/A"}</Value>
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Value>{item.status}</Value>
                      </div>
                    </Info>
                    <RightSection>
                      <div>
                        <Label>Amount</Label>
                        <Value>{item.amount}</Value>
                      </div>
                      <Amount>₹ {item.amount}</Amount>
                    </RightSection>
                  </Card>
                ))}
              </div>
            ))
          )}
        </PageWrapper>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ReimbursementHistory;
