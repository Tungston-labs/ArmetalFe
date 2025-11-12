
import React, { useEffect, useState } from "react";
import {
  Container,
  Headers,
  EditButton,
  Tabs,
  Tab,
  Section,
  GroupLabel,
  Input,
  Select,
  Hr,
  Rowes,
  Title,
  Subtitle,
  Rightside,
  HeaderWrapper,
  TitleSection,
  Column,
  FullPageLoaderWrapper,
  FieldGroup,
  EmployeeImage,
  ResponsiveH3,
} from "./ViewBasic.Style";
import { LuArrowLeft } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { getEmployeeById, submitEmployee } from "../../Redux/employeeSlice";
import { NavLink, useLocation, useParams, useNavigate } from "react-router-dom";
import EmployeeIcon from "../../assets/employeeicon.svg";
import { getDepartments } from "../../Redux/departmentSlice";
import Loader from "../../Components/Loader";
import { Label } from "./BasicLevel.Styles";
import Swal from "sweetalert2";
import Header from "../../Components/Header";

const ViewBasic = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { id: employeeId } = useParams();



  const { employeeDetail, loading } = useSelector((state) => state.employees);
  const departmentList = useSelector((state) => state.departments.list);

  const [formData, setFormData] = useState({});
  const [isEdited, setIsEdited] = useState(false);

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));
  useEffect(() => {
    if (departmentList.length === 0) {
      dispatch(getDepartments({ page: 1, search: "" }));
    }
  }, [dispatch, departmentList.length]);
  useEffect(() => {
    if (id) {
      dispatch(getEmployeeById(id));
    }
  }, [dispatch, id]);
  useEffect(() => {
    if (!employeeDetail || Object.keys(employeeDetail).length === 0) return;

    let deptId = "";
    if (typeof employeeDetail.department === "string") {
      const match = departmentList.find(
        (d) => d.name === employeeDetail.department
      );
      deptId = match ? match.id : "";
    } else if (typeof employeeDetail.department === "number") {
      deptId = employeeDetail.department;
    }

    const company =
      employeeDetail.company && typeof employeeDetail.company === "object"
        ? employeeDetail.company
        : user?.company || { country: "" };

    const updatedFormData = {
      ...employeeDetail,
      department: deptId,
      total_leave: employeeDetail.total_leave || "",
      paid_leave: employeeDetail.paid_leave || "",
      contract_expiry_date: employeeDetail.contract_expiry_date || "",
      role: employeeDetail.role || "",
      idcard: employeeDetail.idcard || "",
      company,
      aadar_number:
        employeeDetail.aadar_number || employeeDetail.aadhaar_number || "",
    };
    if (!formData.id || formData.id !== employeeDetail.id) {
      setFormData(updatedFormData);
      setIsEdited(false);
    }
  }, [employeeDetail, departmentList, user]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsEdited(true);
  };
const handleSubmit = async () => {
  let payload = { ...formData };

  Object.keys(payload).forEach((key) => {
    if (
      payload[key] === "" ||
      payload[key] === null ||
      payload[key] === undefined
    ) {
      delete payload[key];
    }
  });

  const country = formData?.company?.country;

  if (country === "IN") {
    delete payload.iqama_number;
    delete payload.insurance_number;
    delete payload.visa_expiry_date;

    if (!payload.aadar_number?.trim()) {
      alert("Aadhaar number is required for India");
      return;
    }
    if (payload.aadar_number.length !== 12) {
      alert("Aadhaar number must be 12 digits");
      return;
    }
  } else {
    delete payload.aadar_number;

    if (!payload.iqama_number?.trim()) {
      alert("Iqama number is required");
      return;
    }
    if (payload.iqama_number.length !== 12) {
      alert("Iqama number must be 12 digits");
      return;
    }
  }

  // ✅ Check if employee is head and department is changing
  const oldDept = employeeDetail.department;
  const newDept = payload.department;
  if (employeeDetail.is_head && oldDept !== newDept) {
    const confirmResult = await Swal.fire({
      title: "Warning",
      text: "This employee is the head of their department. Changing their department will remove them as head from the previous department. Do you want to continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, continue",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    });

    if (!confirmResult.isConfirmed) {
      return; // stop submission
    }
  }

  await dispatch(submitEmployee(payload));
  await dispatch(getEmployeeById(id));

  Swal.fire({
    icon: "success",
    title: "Updated!",
    text: "Employee details updated successfully.",
    confirmButtonColor: "#304EB0",
  });
  setIsEdited(false);
};

  const handleTabNavigation = (path) => {
    if (isEdited) {
      Swal.fire({
        title: "Unsaved Changes",
        text: "You have unsaved changes. Do you want to leave without saving?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Leave",
        cancelButtonText: "Stay",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(path);
        }
      });
    } else {
      navigate(path);
    }
  };

  const from = location.state?.from;

const handleImageChange = (file) => {
  // store the File object in formData for submission
  setFormData((prev) => ({
    ...prev,
    profile_pic: file,
  }));
  setIsEdited(true);
};



const handleBack = () => {
  if (from === "department") {
    navigate(`/departments/${formData.department}`);
  } else if (from === "employee") {
    navigate("/employee");
  } else if (from === "employee-contract-visa-expiry") {
    navigate(`/employee-contract-visa-expiry`);
  } else if (from === "fulldashboard") {
    navigate(`/fulldashboard/${employeeId}`);
  } else {
    navigate("/");
  }
};




  if (loading || !formData || Object.keys(formData).length === 0) {
    return (
      <FullPageLoaderWrapper>
        <Loader size="large" tip="Loading..." />
      </FullPageLoaderWrapper>
    );
  }
  return (
    <Container>
      <Headers>
        <HeaderWrapper>
          <TitleSection>
            <LuArrowLeft
              style={{
                width: 30,
                height: 30,
                cursor: "pointer",
                color: "#304EB0",
              }}
              onClick={handleBack}
            />
            <EmployeeImage src={EmployeeIcon} alt="employeeIcon" />
            <div>
              <Title>Employee</Title>
              <Subtitle>Manage your Employee.</Subtitle>
            </div>
          </TitleSection>
        </HeaderWrapper>

        <Rightside>
          <EditButton onClick={handleSubmit}>Save</EditButton>
        </Rightside>
      </Headers>

      <Hr />
      <ResponsiveH3>Employee Details</ResponsiveH3>


<Header
  employee={formData}
  editable={true}
  onChange={handleChange}
  onImageChange={handleImageChange}
/>



      <Section>
        <Tabs>
          <NavLink to={`/ViewBasic/${id}`} style={{ textDecoration: "none" }}>
            <Tab
              active={location.pathname === `/ViewBasic/${id}`}
              onClick={() => handleTabNavigation(`/ViewBasic/${id}`)}
            >
              Basic Details
            </Tab>
          </NavLink>

          <NavLink
            to={`/ViewBasic/${id}/bank`}
            style={{ textDecoration: "none" }}
          >
            <Tab
              active={location.pathname === `/ViewBasic/${id}/bank`}
              onClick={() => handleTabNavigation(`/ViewBasic/${id}/bank`)}
            >
              Bank and payment details
            </Tab>
          </NavLink>

          <NavLink
            to={`/ViewBasic/${id}/documents`}
            style={{ textDecoration: "none" }}
          >
            <Tab
              active={location.pathname === `/ViewBasic/${id}/documents`}
              onClick={() =>
                handleTabNavigation(`/ViewBasic/${id}/documents`)
              }
            >
              Documents
            </Tab>
          </NavLink>
        </Tabs>

        <GroupLabel>Job Details</GroupLabel>
        <Rowes>
          <FieldGroup>
            <Label>Designation</Label>
            <Input
              name="designation"
              value={formData.designation || ""}
              onChange={handleChange}
            />
          </FieldGroup>
          <FieldGroup>
            <Label>Joining Date</Label>
            <Input
              name="joining_date"
              value={formData.joining_date || ""}
              onChange={handleChange}
            />
          </FieldGroup>
        </Rowes>

        <Rowes>
          <FieldGroup>
            <Label>Department</Label>
            <Select
              name="department"
              value={formData.department || ""}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              {departmentList.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Select>
          </FieldGroup>

          <FieldGroup>
            <Label>Employment Type</Label>
            <Input
              name="employment_type"
              value={formData.employment_type || ""}
              onChange={handleChange}
            />
          </FieldGroup>
        </Rowes>

        <Rowes>
          <FieldGroup>
            <Label>Total Leaves</Label>
            <Input
              type="number"
              name="total_leave"
              value={formData.total_leave || ""}
              onChange={handleChange}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Paid Leave</Label>
            <Input
              type="number"
              name="paid_leave"
              value={formData.paid_leave || ""}
              onChange={handleChange}
            />
          </FieldGroup>
        </Rowes>

        <GroupLabel>Employee Legal & ID Information</GroupLabel>
        <Column>
          <FieldGroup>
            <Label>Phone Number</Label>
            <Input
              name="phno"
              value={formData.phno || ""}
              onChange={handleChange}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>Passport Number</Label>
            <Input
              name="passport_number"
              value={formData.passport_number || ""}
              onChange={handleChange}
            />
          </FieldGroup>

          {formData?.company?.country === "IN" ? (
            <FieldGroup>
              <Label>Aadhaar Number</Label>
              <Input
                name="aadar_number"
                placeholder="Aadhaar Number"
                value={formData.aadar_number || ""}
                onChange={handleChange}
              />
            </FieldGroup>
          ) : (
            <>
              <FieldGroup>
                <Label>Visa Expiry Date</Label>
                <Input
                  type="date"
                  name="visa_expiry_date"
                  value={formData.visa_expiry_date || ""}
                  onChange={handleChange}
                />
              </FieldGroup>

              <FieldGroup>
                <Label>Iqama Number</Label>
                <Input
                  name="iqama_number"
                  value={formData.iqama_number || ""}
                  onChange={handleChange}
                />
              </FieldGroup>

              <FieldGroup>
                <Label>Insurance Number</Label>
                <Input
                  name="insurance_number"
                  value={formData.insurance_number || ""}
                  onChange={handleChange}
                />
              </FieldGroup>
            </>
          )}

          <FieldGroup>
            <Label>Role</Label>
            <Select
              name="role"
              value={formData.role || ""}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="employee">Employee</option>
              <option value="hr">HR</option>
              <option value="manager">Manager</option>
            </Select>
          </FieldGroup>

          <FieldGroup>
            <Label>Contract Expiry Date</Label>
            <Input
              type="date"
              name="contract_expiry_date"
              value={formData.contract_expiry_date || ""}
              onChange={handleChange}
            />
          </FieldGroup>

          <FieldGroup>
            <Label>ID Card</Label>
            <div>
              {formData.idcard && (
                <img
                  src={
                    formData.idcard instanceof File
                      ? URL.createObjectURL(formData.idcard)
                      : formData.idcard
                  }
                  alt="ID Card"
                  style={{ width: 120, height: "auto", marginBottom: 10 }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                name="idcard"
                onChange={(e) =>
                  setFormData({ ...formData, idcard: e.target.files[0] })
                }
              />
            </div>
          </FieldGroup>
        </Column>
      </Section>
    </Container>
  );
};

export default ViewBasic;
