import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Header,
  Title,
  Subtitle,
  RoleInfo,
  Hr,
} from "./BankPayment.Styles";
import Multistep from "../../../Components/Employee/AddForm/Multistep";
import Table from "../../../Components/Employee/AddForm/Table";
import {
  submitBankPayment,
  fetchAllBankPaymentsThunk,
  setBankFormData,
} from "../../../Redux/employeeSlice";
import { clearBankPayment } from "../../../Redux/employeeSlice";
import Loader from "../../../Components/Loader/Loader";
import EmployeeIcon from "../../../assets/employeeicon.svg";
import { EmployeeImage } from "./BasicLevel.Styles";

import { Divider } from "../../reimbursement/Reimb_info.Styles";
import EmployeeTitle from "../../../Components/Employee/Headers/EmployeeTitle";
export default function BankPaymentForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [menuOpen, setMenuOpen] = useState(false);
  const employeeId = useSelector((state) => state.employee.employeeId);
  const bankPayment = useSelector((state) => state.employee.bankPayment);
  const savedBankForm = useSelector((state) => state.employee.formData.bank);

  const [bankName, setBankName] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
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
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [ifscCode, setIfscCode] = useState("");
  const stepTitles = ["Basic Info", "Bank Details", "Document Upload"];

  useEffect(() => {
    if (savedBankForm) {
      setBankName(savedBankForm.bank_name || "");
      if (country === "IN") {
        setIfscCode(savedBankForm.swift_code || "");
      } else {
        setSwiftCode(savedBankForm.swift_code || "");
      }
      setAccountNumber(savedBankForm.account_number || "");
      setUanNumber(savedBankForm.uan_epf_number || "");
      setPanNumber(savedBankForm.pan_number || "");
      setTaxRegime(savedBankForm.tax_regime || "");
      setTdsAmount(savedBankForm.tds_deduction_amount?.toString() || "");
      setDeclaration80C(savedBankForm.declaration_80c || "");
      setBasicSalary(savedBankForm.basic_salary?.toString() || "");
      setSalaryIncrement(savedBankForm.salary_increment?.toString() || "");
      setHousingAllowance(savedBankForm.housing_allowance?.toString() || "");
      setTransportation(savedBankForm.transportation?.toString() || "");
    } else if (employeeId) {
      dispatch(fetchAllBankPaymentsThunk(employeeId));
    }
  }, [dispatch, employeeId, savedBankForm]);

  useEffect(() => {
    if (bankPayment) {
      setBankName(bankPayment.bank_name || "");
      setSwiftCode(bankPayment.swift_code || "");
      setAccountNumber(bankPayment.account_number || "");
      setUanNumber(bankPayment.uan_epf_number || "");
      setPanNumber(bankPayment.pan_number || "");
      setTaxRegime(bankPayment.tax_regime || "");
      setTdsAmount(bankPayment.tds_deduction_amount?.toString() || "");
      setDeclaration80C(bankPayment.declaration_80c || "");
      setBasicSalary(bankPayment.basic_salary?.toString() || "");
      setSalaryIncrement(bankPayment.salary_increment?.toString() || "");
      setHousingAllowance(bankPayment.housing_allowance?.toString() || "");
      setTransportation(bankPayment.transportation?.toString() || "");

    }
  }, [bankPayment]);

  const user = JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user"),
  );
  const country = user?.company?.country || "IN";

  const handleNext = async () => {
    const errors = {};
    const isDecimal = (value) => /^\d+(\.\d{1,2})?$/.test(value);

    // PAN is required only for India
    if (country === "IN") {
      if (!panNumber.trim()) errors.panNumber = "PAN Number is required.";
    }
    if (country === "IN") {
      if (!ifscCode.trim()) errors.ifscCode = "IFSC Code is required.";
    } else {
      if (!swiftCode.trim()) errors.swiftCode = "SWIFT Code is required.";
    }
    // Fields always required
    if (!bankName.trim()) errors.bankName = "Bank Name is required.";
    if (!accountNumber.trim())
      errors.accountNumber = "Account Number is required.";
    if (!basicSalary || !isDecimal(basicSalary))
      errors.basicSalary = "Basic Salary must be a valid number.";
    if (salaryIncrement && !isDecimal(salaryIncrement))
      errors.salaryIncrement = "Salary Increment must be a valid number.";
    if (housingAllowance && !isDecimal(housingAllowance))
      errors.housingAllowance = "Housing Allowance must be a valid number.";
    if (transportation && !isDecimal(transportation))
      errors.transportation = "Transportation must be a valid number.";
    if (!taxRegime) {
      errors.taxRegime = "Tax Regime is required.";
    }
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (!employeeId) {
      setError(
        "Employee ID not found. Please go back and submit the basic info first.",
      );
      return;
    }

    const bankData = {
      bank_name: bankName,
      swift_code: country === "IN" ? ifscCode : swiftCode,
      account_number: accountNumber,
      uan_epf_number: uanNumber,
      pan_number: panNumber,
      tax_regime: taxRegime,
      tds_deduction_amount: parseFloat(tdsAmount || 0),
      declaration_80c: declaration80C,
      basic_salary: parseFloat(basicSalary),
      salary_increment: parseFloat(salaryIncrement || 0),
      housing_allowance: parseFloat(housingAllowance || 0),
      transportation: parseFloat(transportation || 0),
    };

    dispatch(setBankFormData(bankData));
    setLoading(true);

    try {
      await dispatch(
        submitBankPayment({ employeeId, data: bankData, }),
      ).unwrap();
      dispatch(clearBankPayment());
      navigate("/documents");
    } catch (err) {
      setError(err);
    }
  };

  const handlePrevious = () => {
    navigate("/basic-details");
  };

  return (
    <>

      {loading && <Loader />}
      <Container>
        <EmployeeTitle
          iconSrc={EmployeeIcon}
          showAddButton={false}
          showTabs={false}
          showSearch={false}
          showDropdown={false}
            showReportButton={false}
        />
        <Divider />
        <div
          style={{
            width: "99%",
            justifyContent: "center",
            display: "flex",
            padding: "20px",
          }}
        >
          <div style={{ width: "50%" }}>
            <Multistep currentStep={1} /> {/* Step 2: Bank Details */}
          </div>
        </div>

        {error && <p>{error.message || error.toString()}</p>}

        <Table
          country={country}
          bankName={bankName}
          setBankName={setBankName}
          swiftCode={swiftCode}
          setSwiftCode={setSwiftCode}
          ifscCode={ifscCode}
          setIfscCode={setIfscCode}
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
          handlePrevious={handlePrevious}
          handleNext={handleNext}
          errors={fieldErrors}
          // bankProofImage={bankProofImage}
          // setBankProofImage={setBankProofImage}
          showNextButton={true}
        />
      </Container>
    </>
  );
}
