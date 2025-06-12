// BankPaymentForm.jsx
import React from 'react';
import {
  Container, Header, RoleInfo, Stepper, Step, SectionTitle, FormSection,
  FormGroup, Input, Select, Row, ButtonGroup, Button, ImageUpload,Title,Subtitle
  ,Hr,
} from './BankPayment.Styles';
import Multistep from '../../Components/Multistep'
import Table from '../../Components/Table'
export default function BankPaymentForm() {
  return (
    <Container>
      <Header>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <img src="/images/employee.png" alt="Icon" style={{ height: "50px" }} />
                <div>
                  <Title>Employee</Title>
                  <Subtitle>Manage your Employee.</Subtitle>
                </div>
              </div>
      
              <RoleInfo>
                <img src="https://i.pravatar.cc/40?img=5" alt="HR Manager" />
                <span>HR Manager</span>
              </RoleInfo>
            </Header>

 <Hr />
      <div style={{ width: "100%", justifyContent: "center", display: "flex", padding: "20px" }}>
        <div style={{ width: "50%" }}>
          <Multistep />
        </div>
      </div>

      
      <Table />
    </Container>
  );
}
