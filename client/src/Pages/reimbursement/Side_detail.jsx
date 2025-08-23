import React from "react";
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

const reimbursements = [
  {
    date: "21 Aug 2024",
    data: [
      {
        id: 1,
        name: "Maria Curtis",
        position: "UI/UX Designer",
        department: "UI/UX Designer",
        amount: "₹ 2,500",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        id: 2,
        name: "Maria Curtis",
        position: "UI/UX Designer",
        department: "UI/UX Designer",
        amount: "₹ 2,500",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        id: 3,
        name: "Maria Curtis",
        position: "UI/UX Designer",
        department: "UI/UX Designer",
        amount: "₹ 2,500",
        image: "https://randomuser.me/api/portraits/men/11.jpg",
      },
    ],
  },
  {
    date: "21 Aug 2024",
    data: [
      {
        id: 4,
        name: "Maria Curtis",
        position: "UI/UX Designer",
        department: "UI/UX Designer",
        amount: "₹ 2,500",
        image: "https://randomuser.me/api/portraits/women/2.jpg",
      },
    ],
  },
];

const ReimbursementHistory = ({ onClose }) => {
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
              {section.data.map((item) => (
                <Card key={item.id}>
                  <ProfileImage src={item.image} alt={item.name} />
                  <Info>
                    <div>
                      <Label>Name</Label>
                      <Value>{item.name}</Value>
                    </div>
                    <div>
                      <Label>Department</Label>
                      <Value>{item.department}</Value>
                    </div>
                  </Info>
                  <RightSection>
                    <div>
                      <Label>Position</Label>
                      <Value>{item.position}</Value>
                    </div>
                    <Amount>{item.amount}</Amount>
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
