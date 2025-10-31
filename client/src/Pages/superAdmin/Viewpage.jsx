import React, { useEffect } from 'react';
import {
  FormWrapper,
  BackHeader,
  FormSection,
  Hr,
  FormField,
  Label,
  Input,
  CheckboxGroup,
  CheckboxLabel
} from './View.Styles';
import { GoArrowLeft } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import {
  getCompanyById,
  clearSelectedCompany
} from '../../Redux/superAdminSlice';
import { useParams, useNavigate } from 'react-router-dom';
import Plan from '../../Components/Plan';
import { Subtitle, Title, TitleSection } from './SuperAdmin.Styles';
import { LuArrowLeft } from "react-icons/lu";
import Navbar from '../../Components/Navbar';
const CompanyViewPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const selectedCompany = useSelector(state => state.superAdmin.selectedCompany);

  useEffect(() => {
    if (id) {
      dispatch(getCompanyById(id));
    }

    return () => {
      dispatch(clearSelectedCompany());
    };
  }, [dispatch, id]);

  if (!selectedCompany) return <p>Loading...</p>;

  const allModules = ["dashboard", "employee", "department", "daily_task", "payroll", "holiday", "reimbursement","project"];
  const enabledModules = allModules.filter(mod => selectedCompany.modules?.[mod]);

  return (<>
  <Navbar/>
    <FormWrapper>
       <TitleSection>
                <LuArrowLeft style={{ width: "30px", height: 30,cursor:"pointer" }} onClick={() => navigate(-1)} />
                <img src="/images/superadminlogo.png" alt="Payroll Icon" style={{ height: "50px" }} />
                <div>
                  <Title>Super admin</Title>
                  <Subtitle>Manage all departments within the organization.</Subtitle>
                </div>
              </TitleSection>
      {/* <BackHeader>
        <GoArrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
          
        <span>Super admin</span>
      </BackHeader> */}

      <FormSection>
        <div>
          <FormField>
            <Label>Company Name</Label>
            <Input type="text" value={selectedCompany.name} readOnly />
          </FormField>

          <FormField>
            <Label>Address</Label>
            <Input type="text" value={selectedCompany.address} readOnly />
          </FormField>

          <FormField>
            <Label>Email</Label>
            <Input type="text" value={selectedCompany.email} readOnly />
          </FormField>

           <FormField>
    <Label style={{fontFamily:"satoshi",fontStyle:"bold"}}>Upload logo</Label>
    {selectedCompany.logo ? (
      <img
        src={selectedCompany.logo}
        alt="Company Logo"
        style={{
          width: "100px",
          height: "100px",
          objectFit: "contain",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "4px",
          backgroundColor: "#fff"
        }}
      />
    ) : (
      <p style={{ color: "#888", fontStyle: "italic" }}>No logo uploaded</p>
    )}
  </FormField>
        </div>

        <div>
          <FormField>
            <Label>Company location</Label>
            <Input type="text" value={selectedCompany.location} readOnly />
          </FormField>

          <FormField>
            <Label>Contact Number</Label>
            <Input type="text" value={selectedCompany.contact_number} readOnly />
          </FormField>

          <FormField>
            <Label>No. of Employees</Label>
            <Input type="text" value={selectedCompany.number_of_employees} readOnly />
          </FormField>

            <FormField>
    <Label>Latitude</Label>
    <Input type="text" value={selectedCompany.latitude} readOnly />
  </FormField>

  <FormField>
    <Label>Longitude</Label>
    <Input type="text" value={selectedCompany.longitude} readOnly />
  </FormField>
        </div>
      </FormSection>

      <h4>Privileges</h4>
<CheckboxGroup>
  {allModules.map((mod) => (
    <CheckboxLabel key={mod}>
      <input
        type="checkbox"
        value={mod}
        checked={selectedCompany.modules?.[mod]}
        disabled
      />
      {mod.charAt(0).toUpperCase() + mod.slice(1).replace('_', ' ')}
    </CheckboxLabel>
  ))}
</CheckboxGroup>


      <Hr />

      <Plan />
    </FormWrapper>
    </>
  );
};

export default CompanyViewPage;
