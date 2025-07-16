import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Header,
  Title,
  Subtitle,
  RoleInfo,
  Hr
} from './BankPayment.Styles';
import Multistep from '../../Components/Multistep';
import Table from '../../Components/Table';
import {
  submitBankPayment,
  fetchAllBankPaymentsThunk,
  setBankFormData
} from '../../Redux/employeeSlice';
import SyncLoader from '../../Components/Loder';

export default function BankPaymentForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const employeeId = useSelector((state) => state.employee.employeeId);
  const bankPayment = useSelector((state) => state.employee.bankPayment);
  const savedBankForm = useSelector((state) => state.employee.formData.bank);

  const [bankName, setBankName] = useState('');
  const [swiftCode, setSwiftCode] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [uanNumber, setUanNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [taxRegime, setTaxRegime] = useState('');
  const [tdsAmount, setTdsAmount] = useState('');
  const [declaration80C, setDeclaration80C] = useState('');
  const [basicSalary, setBasicSalary] = useState('');
  const [salaryIncrement, setSalaryIncrement] = useState('');
  const [housingAllowance, setHousingAllowance] = useState('');
  const [transportation, setTransportation] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
const [bankProofImage, setBankProofImage] = useState(null);
const[loading, setLoading] = useState(false);


  const stepTitles = ['Basic Info', 'Bank Details', 'Document Upload'];

  useEffect(() => {
    if (savedBankForm) {
      setBankName(savedBankForm.bank_name || '');
      setSwiftCode(savedBankForm.swift_code || '');
      setPaymentMode(savedBankForm.payment_mode || '');
      setAccountNumber(savedBankForm.account_number || '');
      setUanNumber(savedBankForm.  uan_epf_number || '');
      setPanNumber(savedBankForm.pan_number || '');
      setTaxRegime(savedBankForm.tax_regime || '');
      setTdsAmount(savedBankForm.tds_deduction_amount?.toString() || '');
      setDeclaration80C(savedBankForm.declaration_80c || '');
      setBasicSalary(savedBankForm.basic_salary?.toString() || '');
      setSalaryIncrement(savedBankForm.salary_increment?.toString() || '');
      setHousingAllowance(savedBankForm.housing_allowance?.toString() || '');
      setTransportation(savedBankForm.transportation?.toString() || '');
    } else if (employeeId) {
      dispatch(fetchAllBankPaymentsThunk(employeeId));
    }
  }, [dispatch, employeeId, savedBankForm]);

  useEffect(() => {
    if (bankPayment) {
      setBankName(bankPayment.bank_name || '');
      setSwiftCode(bankPayment.swift_code || '');
      setPaymentMode(bankPayment.payment_mode || '');
      setAccountNumber(bankPayment.account_number || '');
      setUanNumber(bankPayment.uan_epf_number || '');
      setPanNumber(bankPayment.pan_number || '');
      setTaxRegime(bankPayment.tax_regime || '');
      setTdsAmount(bankPayment.tds_deduction?.toString() || '');
      setDeclaration80C(bankPayment.declaration_80c || '');
      setBasicSalary(bankPayment.basic_salary?.toString() || '');
      setSalaryIncrement(bankPayment.salary_increment?.toString() || '');
      setHousingAllowance(bankPayment.housing_allowance?.toString() || '');
      setTransportation(bankPayment.transportation?.toString() || '');
    }
  }, [bankPayment]);

  const handleNext = async () => {
    const errors = {};
    const isDecimal = (value) => /^\d+(\.\d{1,2})?$/.test(value);

    if (!bankName.trim()) errors.bankName = 'Bank Name is required.';
    if (swiftCode && swiftCode.length > 20) errors.swiftCode = 'SWIFT Code must be at most 20 characters.';
    if (!paymentMode.trim()) errors.paymentMode = 'Payment Mode is required.';
    if (!accountNumber.trim()) errors.accountNumber = 'Account Number is required.';
    if (!panNumber.trim()) errors.panNumber = 'PAN Number is required.';
    if (!taxRegime.trim()) errors.taxRegime = 'Tax Regime is required.';
    if (!tdsAmount || !isDecimal(tdsAmount)) errors.tdsAmount = 'TDS Amount must be a valid number.';
    if (!basicSalary || !isDecimal(basicSalary)) errors.basicSalary = 'Basic Salary must be a valid number.';
    if (salaryIncrement && !isDecimal(salaryIncrement)) errors.salaryIncrement = 'Salary Increment must be a valid number.';
    if (housingAllowance && !isDecimal(housingAllowance)) errors.housingAllowance = 'Housing Allowance must be a valid number.';
    if (transportation && !isDecimal(transportation)) errors.transportation = 'Transportation must be a valid number.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    if (!employeeId) {
      setError('Employee ID not found. Please go back and submit the basic info first.');
      return;
    }

  const bankData = {
  bank_name: bankName,

  swift_code: swiftCode,
  payment_mode: paymentMode,
  account_number: accountNumber,
  uan_epf_number : uanNumber,
  pan_number: panNumber,
  tax_regime: taxRegime,
  tds_deduction_amount: parseFloat(tdsAmount),
  declaration_80c: declaration80C,
  basic_salary: parseFloat(basicSalary),
  salary_increment: parseFloat(salaryIncrement || 0),
  housing_allowance: parseFloat(housingAllowance || 0),
  transportation: parseFloat(transportation || 0)
};

    dispatch(setBankFormData(bankData)); // ✅ Save to Redux
setLoading(true)
    try {
      await dispatch(submitBankPayment({ employeeId, data: bankData,bankProofImage, })).unwrap();
      navigate('/documents');
    } catch (err) {
      setError(err);
    }
    finally{
      setLoading(false)
    }
  };

  const handlePrevious = () => {
    navigate('/basic-details');
  };

  return (
    <Container>
      <Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/images/employee.png" alt="Icon" style={{ height: '50px' }} />
          <div>
            <Title>Employee</Title>
            <Subtitle>Manage your Employee.</Subtitle>
          </div>
        </div>
        <RoleInfo>
          <img src="/images/user.jpg" alt="HR Manager" />
          <span>HR Manager</span>
        </RoleInfo>
      </Header>

      <Hr />
      <div style={{ width: '100%', justifyContent: 'center', display: 'flex', padding: '20px' }}>
        <div style={{ width: '50%' }}>
          <Multistep currentStep={1} /> {/* Step 2: Bank Details */}
        </div>
      </div>

{error && <p>{error.message || error.toString()}</p>}

      <Table
        bankName={bankName} setBankName={setBankName}
          bankProofImage={bankProofImage}
  setBankProofImage={setBankProofImage}
        swiftCode={swiftCode} setSwiftCode={setSwiftCode}
        paymentMode={paymentMode} setPaymentMode={setPaymentMode}
        accountNumber={accountNumber} setAccountNumber={setAccountNumber}
        uanNumber={uanNumber} setUanNumber={setUanNumber}
        panNumber={panNumber} setPanNumber={setPanNumber}
        taxRegime={taxRegime} setTaxRegime={setTaxRegime}
        tdsAmount={tdsAmount} setTdsAmount={setTdsAmount}
        declaration80C={declaration80C} setDeclaration80C={setDeclaration80C}
        basicSalary={basicSalary} setBasicSalary={setBasicSalary}
        salaryIncrement={salaryIncrement} setSalaryIncrement={setSalaryIncrement}
        housingAllowance={housingAllowance} setHousingAllowance={setHousingAllowance}
        transportation={transportation} setTransportation={setTransportation}
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        errors={fieldErrors}
      />
          {loading && <SyncLoader/>}
    </Container>
  );
}
