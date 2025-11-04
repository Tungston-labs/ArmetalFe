// pages/ViewBankpayment.jsx
import React, { useEffect, useState } from "react";
import {
  Container,
  Headers,
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
import Header from "../../Components/Header";
import Swal from "sweetalert2";

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
  const existingPayment = employeeBankPayments?.results?.[0];
  const existingPaymentId = existingPayment?.id || null;

  // Validation
  if (!bankName || !accountNumber || !panNumber || !basicSalary) {
    setErrors({
      bankName: !bankName ? "Bank Name is required" : "",
      accountNumber: !accountNumber ? "Account Number is required" : "",
      panNumber: !panNumber ? "PAN Number is required" : "",
      basicSalary: !basicSalary ? "Basic Salary is required" : "",
    });
    return;
  }

  // ✅ FIXED: Use FormData instead of plain object
  const formData = new FormData();
  formData.append("bank_name", bankName);
  formData.append("swift_code", swiftCode);
  formData.append("payment_mode", paymentMode);
  formData.append("account_number", accountNumber);
  formData.append("uan_epf_number", uanNumber);
  formData.append("pan_number", panNumber);
  formData.append("tax_regime", taxRegime);
  formData.append("tds_deduction_amount", tdsAmount);
  formData.append("declaration_80c", declaration80C);
  formData.append("basic_salary", basicSalary);
  formData.append("salary_increment", salaryIncrement);
  formData.append("housing_allowance", housingAllowance);
  formData.append("transportation", transportation);

  // ✅ Append image if available
  if (bankProofImage) {
    formData.append("bank_proof", bankProofImage);
  }

  // Dispatch thunk
  dispatch(
    submitBankPayment({
      employeeId: id,
      paymentId: existingPaymentId,
      data: formData, // ✅ send as FormData
      bankProofImage,
    })
  )
    .unwrap()
    .then(() => {
      Swal.fire({
        icon: "success",
        title: existingPaymentId ? "Updated!" : "Saved!",
        text: existingPaymentId
          ? "Bank details updated successfully."
          : "Bank details saved successfully.",
        confirmButtonColor: "#304EB0",
      });
        dispatch(fetchAllBankPaymentsThunk(id));
      setIsEditable(false);
    })
    .catch((err) => {
      console.log("❌ Bank Payment Error:", err);
      const errMsg =
        err?.detail ||
        (Array.isArray(err) ? err.join(", ") : err?.message) ||
        "Something went wrong.";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errMsg,
      });
    });
};




console.log("employeeBankPayments",employeeBankPayments)
  return (
    <>
    {loading && <SyncLoader/>}

    <Container>
      <Headers>
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
  <EditButton onClick={handleSubmit}>
    Save
  </EditButton>
</Rightside>

      </Headers>

      <Hr />
      
     
<ResponsiveH3>Bank & Payment Details</ResponsiveH3>
    <Header employee={employeeDetail} />

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