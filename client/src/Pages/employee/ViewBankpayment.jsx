// pages/ViewBankpayment.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Header,
  LeftSection,
  RightSection,
  Textarea,
  EditButton,
  Row,
  Tabs,
  Tab,
  Section,
  Rows,
  Input,
  Hr,
  ProfileImage,
  ImageColumn,
  Title,
  FormWrapper,
  Subtitle,
  Rightside,
  HeaderWrapper,
  TextGroup,
  HRManager,
} from "./ViewBankpayment.Styles";

import { HiOutlinePencilAlt } from "react-icons/hi";
import Table from "../../Components/Table";
import { useParams, NavLink, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeById, fetchAllBankPaymentsThunk } from "../../Redux/employeeSlice";
import { useNavigate } from "react-router-dom";
const ViewBankPayment = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isEditable, setIsEditable] = useState(false);

  const { employeeDetail, employeeBankPayments } = useSelector((state) => state.employees);

  // Editable fields (for current/new bank record)
  const [bankName, setBankName] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [uanNumber, setUanNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [taxRegime, setTaxRegime] = useState("");
  const [tdsAmount, setTdsAmount] = useState("");
  const [declaration80C, setDeclaration80C] = useState("");
  const [basicSalary, setBasicSalary] = useState("");
  const [salaryIncrement, setSalaryIncrement] = useState("");
  const [housingAllowance, setHousingAllowance] = useState("");
  const [transportation, setTransportation] = useState("");
const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  // Load employee & bank payments
  useEffect(() => {
    dispatch(getEmployeeById(id));
    dispatch(fetchAllBankPaymentsThunk(id));
  }, [id, dispatch]);

  // Pre-fill fields from latest record
  useEffect(() => {
    const latest = employeeBankPayments?.results?.[0];
    if (latest) {
      setBankName(latest.bank_name || "");
      setSwiftCode(latest.swift_code || "");
      setPaymentMode(latest.payment_mode || "");
      setAccountNumber(latest.account_number || "");
      setUanNumber(latest.uan_number || "");
      setPanNumber(latest.pan_number || "");
      setTaxRegime(latest.tax_regime || "");
      setTdsAmount(latest.tds_amount || "");
      setDeclaration80C(String(latest.declaration_80c) || "");
      setBasicSalary(latest.basic_salary || "");
      setSalaryIncrement(latest.salary_increment || "");
      setHousingAllowance(latest.housing_allowance || "");
      setTransportation(latest.transportation || "");
    }
  }, [employeeBankPayments]);

  return (
    <Container>
      <Header>
        <HeaderWrapper>
          <div style={{ width: "10%" }}>
            <img src="/images/employee.png" alt="Icon" style={{ height: "50px" }} />
          </div>
          <TextGroup>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </TextGroup>
        </HeaderWrapper>
        <Rightside>
          <HRManager>
            <img src="/images/user.jpg" alt="HR Manager" />
            <span>HR Manager</span>
          </HRManager>
         <EditButton onClick={() => setIsEditable((prev) => !prev)}>
                    {isEditable ? "Cancel" : "Edit"}
                   </EditButton>
        </Rightside>
      </Header>

      <Hr />
      <h3>Bank & Payment Details</h3>

      <FormWrapper>
        <ImageColumn>
          <ProfileImage
            src={employeeDetail?.profile_pic || "https://i.pravatar.cc/100?img=5"}
            alt="Profile"
          />
        </ImageColumn>

        <Row>
          <LeftSection>
            <Input type="text" value={employeeDetail?.name || ""} readOnly />
            <Input type="text" value={employeeDetail?.employee_id || ""} readOnly />
            <Input type="email" value={employeeDetail?.email || ""} readOnly />
          </LeftSection>

          <RightSection>
            <Textarea value={employeeDetail?.address || ""} readOnly />
            <Rows style={{ marginTop: "1rem" }}>
              <Input type="text" value={employeeDetail?.dob || ""} readOnly />
              <Input type="text" value={employeeDetail?.gender || ""} readOnly />
            </Rows>
          </RightSection>
        </Row>
      </FormWrapper>

      <Hr />

      <Section>
        <Tabs>
          <NavLink to={`/ViewBasic/${id}`} style={{ textDecoration: "none" }}>
            <Tab active={location.pathname === `/ViewBasic/${id}`}>Basic Details</Tab>
          </NavLink>
          <NavLink to={`/ViewBasic/${id}/bank`} style={{ textDecoration: "none" }}>
            <Tab active={location.pathname === `/ViewBasic/${id}/bank`}>Bank and payment details</Tab>
          </NavLink>
          <NavLink to={`/ViewBasic/${id}/documents`} style={{ textDecoration: "none" }}>
            <Tab active={location.pathname === `/ViewBasic/${id}/documents`}>Documents</Tab>
          </NavLink>
        </Tabs>

        <Table
          readOnly={!isEditable}
          records={employeeBankPayments?.results || []}
          // Pass form props for edit mode
          bankName={bankName}
          setBankName={setBankName}
          swiftCode={swiftCode}
          setSwiftCode={setSwiftCode}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          accountNumber={accountNumber}
          setAccountNumber={setAccountNumber}
          uanNumber={uanNumber}
          setUanNumber={setUanNumber}
          panNumber={panNumber}
          setPanNumber={setPanNumber}
          taxRegime={taxRegime}
          setTaxRegime={setTaxRegime}
          tdsAmount={tdsAmount}
          setTdsAmount={setTdsAmount}
          declaration80C={declaration80C}
          setDeclaration80C={setDeclaration80C}
          basicSalary={basicSalary}
          setBasicSalary={setBasicSalary}
          salaryIncrement={salaryIncrement}
          setSalaryIncrement={setSalaryIncrement}
          housingAllowance={housingAllowance}
          setHousingAllowance={setHousingAllowance}
          transportation={transportation}
          setTransportation={setTransportation}
          errors={errors}
          // handlePrevious={() => console.log("Previous clicked")}
          // handleNext={() => console.log("Save/Next clicked")}
        />
      </Section>
    </Container>
  );
};

export default ViewBankPayment;
