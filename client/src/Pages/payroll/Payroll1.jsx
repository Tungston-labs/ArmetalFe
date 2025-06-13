import React from 'react';
import {
  Container,SearchInput,
  Section,RightSection,
  SectionTitle,Rows,
  Table,FormWrapper,
  Row,ImageColumn,Hr,
  Label,Input,LeftSection,
  Value,Rowes,Textarea,
  Pagination,ProfileImage,
} from './Payroll1.Styles';

const PayrollSummary = () => {
  return (
    <Container>
        <SearchInput placeholder="Search by Employee name" />
             
                 <FormWrapper>
               <ImageColumn>
                 <ProfileImage src="https://i.pravatar.cc/100?img=5" alt="Profile" />
               </ImageColumn>
             
               <Rowes>
                 <LeftSection>
                   <Input type="text" placeholder="Ajay kumar" />
                   <Input type="text" placeholder="254125" />
                   <Input type="email" placeholder="Ajaykumar@gmail.com" />
                 </LeftSection>
             
                 <RightSection>
                   <Textarea placeholder="Ajaykumar dummy dummy dummy 1231 dummy" />
                   <Rows style={{ marginTop: "1rem" }}>
                     <Input type="text" placeholder="12/12/1980" />
                     <Input type="text" placeholder="Male" />
                   </Rows>
                 </RightSection>
               </Rowes>
             </FormWrapper>
             <Hr/>
        
      <Section>
        <SectionTitle>Employee Details</SectionTitle>
        <Table>
          <Row>
            <Label>Employee name</Label>
            <Value>Ajay kumar M.A</Value>
          </Row>
          <Row>
            <Label>Employee ID</Label>
            <Value>EMP123652</Value>
          </Row>
          <Row>
            <Label>Department</Label>
            <Value>dummy</Value>
          </Row>
          <Row>
            <Label>Designation</Label>
            <Value>Bank transfer</Value>
          </Row>
        </Table>
      </Section>

      <Section>
        <SectionTitle>Net pay Summary</SectionTitle>
        <Table>
          <Row>
            <Label>Gross Earnings</Label>
            <Value>1200</Value>
          </Row>
          <Row>
            <Label>Total deduction</Label>
            <Value>1500</Value>
          </Row>
          <Row>
            <Label>Net pay</Label>
            <Value>1255</Value>
          </Row>
          <Row>
            <Label>Payment mode</Label>
            <Value>Bank transfer</Value>
          </Row>
          <Row>
            <Label>Bank Account</Label>
            <Value>****4512</Value>
          </Row>
        </Table>
      </Section>

      <Section>
        <SectionTitle>Gross salary breakdown</SectionTitle>
        <Table>
          <Row>
            <Label>Base salary</Label>
            <Value>1200</Value>
          </Row>
        </Table>
      </Section>

      <Section>
        <SectionTitle>Deductions</SectionTitle>
        <Table>
          <Row>
            <Label>Leave taken</Label>
            <Value>1</Value>
          </Row>
          <Row>
            <Label>Total Leave Deduction Amount</Label>
            <Value>0</Value>
          </Row>
        </Table>
      </Section>

      <Section>
        <SectionTitle>Payroll status</SectionTitle>
      </Section>

      <Pagination>
        <span>&larr;</span>
        <span className="active">1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>&rarr;</span>
      </Pagination>
    </Container>
  );
};

export default PayrollSummary;
