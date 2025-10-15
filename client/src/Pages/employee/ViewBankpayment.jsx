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
  TitleSection,
  FieldWrapper,
  Label,
  EmployeeImage,
} from "./ViewBankpayment.Styles";
import { LuArrowLeft } from "react-icons/lu";
import { HiOutlinePencilAlt } from "react-icons/hi";
import Table from "../../Components/Table";
import { useParams, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getEmployeeById,
  fetchAllBankPaymentsThunk,
  submitBankPayment,
} from "../../Redux/employeeSlice";
import SyncLoader from "../../Components/Loder";
import EmployeeIcon from "../../assets/employeeicon.svg";
import { ResponsiveH3 } from "./ViewDocument.Styles";
import { PiUserCircleThin } from "react-icons/pi";
const ViewBankPayment = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { employeeDetail, employeeBankPayments } = useSelector(
    (state) => state.employees
  );
  const paymentId = employeeBankPayments?.results?.[0]?.id || null;

  const [isEditable, setIsEditable] = useState(false);
  const [bankProofImage, setBankProofImage] = useState(null); // ✅ corrected name

  // Editable fields
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
  const [errors, setErrors] = useState({});
    const [menuOpen, setMenuOpen] = useState(false);
  // Load data
  useEffect(() => {
    dispatch(getEmployeeById(id));
    dispatch(fetchAllBankPaymentsThunk(id));
  }, [id, dispatch]);

  // Pre-fill latest values
  useEffect(() => {
    const latest = employeeBankPayments?.results?.[0];
    if (latest) {
      setBankName(latest.bank_name || "");
      setSwiftCode(latest.swift_code || "");
      setPaymentMode(latest.payment_mode || "");
      setAccountNumber(latest.account_number || "");
      setUanNumber(latest.uan_epf_number || "");
      setPanNumber(latest.pan_number || "");
      setTaxRegime(latest.tax_regime || "");
      setTdsAmount(latest.tds_deduction_amount || "");
      setDeclaration80C(String(latest.declaration_80c) || "");
      setBasicSalary(latest.basic_salary || "");
      setSalaryIncrement(latest.salary_increment || "");
      setHousingAllowance(latest.housing_allowance || "");
      setTransportation(latest.transportation || "");
    }
  }, [employeeBankPayments]);

  const handleImageChange = (e) => {
    setBankProofImage(e.target.files[0]);
  };
const { loading } = useSelector((state) => state.employees);
  const handleSubmit = () => {
    if (!bankName || !accountNumber || !panNumber || !basicSalary) {
      setErrors({
        bankName: !bankName ? "Bank Name is required" : "",
        accountNumber: !accountNumber ? "Account Number is required" : "",
        panNumber: !panNumber ? "PAN Number is required" : "",
        basicSalary: !basicSalary ? "Basic Salary is required" : "",
      });
      return;
    }

    const formData = {
      bank_name: bankName,
      swift_code: swiftCode,
      payment_mode: paymentMode,
      account_number: accountNumber,
      uan_epf_number: uanNumber,
      pan_number: panNumber,
      tax_regime: taxRegime,
      tds_deduction_amount: tdsAmount,
      declaration_80c: declaration80C,
      basic_salary: basicSalary,
      salary_increment: salaryIncrement,
      housing_allowance: housingAllowance,
      transportation: transportation,
    };

    dispatch(
      submitBankPayment({
        
        employeeId: id,
        data: formData,
        paymentId,
        bankProofImage,
      })
    )
      .unwrap()
      .then(() => {
        alert("✅ Bank details updated successfully.");
        setIsEditable(false);
      })
      .catch((err) => {
        console.log(err)
        alert("❌ Error: " + (err.message || "Update failed"));
      });
  };
console.log("employeeBankPayments",employeeBankPayments)
  return (
    <>
    {loading && <SyncLoader/>}

    <Container>
      <Header>
        <HeaderWrapper>      
                 <TitleSection>
                          <LuArrowLeft
                   style={{ width: "30px", height: 30, cursor: "pointer",color:"#304EB0" }}
                   onClick={() => navigate("/employee")}
                   />
              <EmployeeImage  src={EmployeeIcon} alt="employeeIcon" />
                         <div>
                      
                           <Title>Employee</Title>
                           <Subtitle style={{color:"#304EB0"}}>Manage your Employee.</Subtitle>
                         </div>
                       </TitleSection>
               </HeaderWrapper>
        <Rightside>
          <EditButton onClick={() => setIsEditable((prev) => !prev)}>
            {isEditable ? "Cancel" : "Edit"}
          </EditButton>
        </Rightside>
      </Header>

      <Hr />
      
     
<ResponsiveH3>Bank & Payment Details</ResponsiveH3>
      <FormWrapper>
        <ImageColumn
>
  {employeeDetail?.profile_pic ? (
    <ProfileImage
      src={employeeDetail.profile_pic}
      alt="Profile"
      // style={{ width: "100%", height: "100%", borderRadius: "10%" }}
    />
  ) : (
    <PiUserCircleThin size={80} color="#ccc" />
  )}
</ImageColumn>

      <Row>
  <LeftSection>
    <FieldWrapper>
      <Label>Name</Label>
      <Input type="text" value={employeeDetail?.name || ""} readOnly />
    </FieldWrapper>

    <FieldWrapper>
      <Label>Employee ID</Label>
      <Input type="text" value={employeeDetail?.employee_id || ""} readOnly />
    </FieldWrapper>

    <FieldWrapper>
      <Label>Email</Label>
      <Input type="email" value={employeeDetail?.email || ""} readOnly />
    </FieldWrapper>
  </LeftSection>

  <RightSection>
    <FieldWrapper>
      <Label>Address</Label>
      <Textarea value={employeeDetail?.address || ""} readOnly />
    </FieldWrapper>

    <Rows style={{ marginTop: "2.3rem", display: "flex", gap: "1rem" }}>
      <FieldWrapper style={{ flex: 1 }}>
        <Label>Date of Birth</Label>
        <Input type="text" value={employeeDetail?.dob || ""} readOnly />
      </FieldWrapper>

      <FieldWrapper style={{ flex: 1 }}>
        <Label>Gender</Label>
        <Input type="text" value={employeeDetail?.gender || ""} readOnly />
      </FieldWrapper>
    </Rows>
  </RightSection>
</Row>

      </FormWrapper>

      <Hr />

      <Section>
        <Tabs>
          <NavLink to={`/ViewBasic/${id}`} style={{ textDecoration: "none" }}>
            <Tab active={location.pathname === `/ViewBasic/${id}`}>
              Basic Details
            </Tab>
          </NavLink>
          <NavLink
            to={`/ViewBasic/${id}/bank`}
            style={{ textDecoration: "none" }}
          >
            <Tab active={location.pathname === `/ViewBasic/${id}/bank`}>
              Bank and payment details
            </Tab>
          </NavLink>
          <NavLink
            to={`/ViewBasic/${id}/documents`}
            style={{ textDecoration: "none" }}
          >
            <Tab active={location.pathname === `/ViewBasic/${id}/documents`}>
              Documents
            </Tab>
          </NavLink>
        </Tabs>

        

        <Table
        setBankProofImage={setBankProofImage}
          records={employeeBankPayments?.results || []}
          isEditMode={isEditable}
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
          handleSubmit={handleSubmit}
        />
        
      </Section>
      
    </Container>
        </>
  );
};

export default ViewBankPayment;