import React, { useState, useEffect, useRef } from "react";
import {
  FormWrapper,
  BackHeader,
  FormSection,
  Input,
  CheckboxGroup,
  CheckboxLabel,
  ButtonGroup,
  Button,
  Hr,
  Select,
  FormField,
  Label,
  LogoUploadBox,
  LogoPreview,
} from "./AddCompany.Styles";
import { GoArrowLeft } from "react-icons/go";
import { useDispatch } from "react-redux";
import { addCompany, editCompany } from "../../Redux/superAdminSlice";
import { FiUpload } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";

const AddCompanyModal = ({
  onClose,
  isEdit = false,
  selectedCompany = null,
    showPrivileges = true,
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countryDialCodes = [
    { code: "+971", label: "UAE (+971)" },
    { code: "+966", label: "Saudi Arabia (+966)" },
    { code: "+965", label: "Kuwait (+965)" },
    { code: "+973", label: "Bahrain (+973)" },
    { code: "+968", label: "Oman (+968)" },
    { code: "+974", label: "Qatar (+974)" },
    { code: "+91", label: "India (+91)" },
    { code: "+880", label: "Bangladesh (+880)" },
    { code: "+92", label: "Pakistan (+92)" },
  ];

  const COUNTRY_CHOICES = [
    { code: "IN", name: "India" },
    { code: "US", name: "United States" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "SG", name: "Singapore" },
    { code: "GB", name: "United Kingdom" },
    { code: "DE", name: "Germany" },
    { code: "FR", name: "France" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "AU", name: "Australia" },
    { code: "CA", name: "Canada" },
  ];

  const allModules = [
    "dashboard",
    "employee",
    "department",
    "daily_task",
    "payroll",
    "holiday",
    "reimbursement",
    "project",
    "finance",
  ];

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    location: "",
    country: "",
    country_code: "+971",
    contact_number: "",
    modules: [],
    latitude: "",
    longitude: "",
    logo: null,
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isEdit && selectedCompany) {
      const modulesChecked = allModules.filter(
        (mod) => selectedCompany.modules?.[mod]
      );

      const match = selectedCompany.contact_number?.match(
        /^(\+\d{1,4})(\d{6,15})$/
      );

      setFormData({
        name: selectedCompany.name || "",
        address: selectedCompany.address || "",
        email: selectedCompany.email || "",
        location: selectedCompany.location || "",
        country: selectedCompany.country || "",
        country_code: match ? match[1] : "+971",
        contact_number: match ? match[2] : "",
        modules: modulesChecked,
        logo: null,
        latitude: selectedCompany.latitude || "",
        longitude: selectedCompany.longitude || "",
      });

      if (selectedCompany.logo) {
        setLogoPreview(selectedCompany.logo);
      }
    }
  }, [isEdit, selectedCompany]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleModuleChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(value)
        ? prev.modules.filter((m) => m !== value)
        : [...prev.modules, value],
    }));
  };

const handleLogoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.type === "image/png" || file.type === "image/svg+xml") {
    setFormData((prev) => ({ ...prev, logo: file }));
    setLogoPreview(URL.createObjectURL(file));
  } else {
    Swal.fire({
      icon: "error",
      title: "Invalid file type",
      text: "Only PNG or SVG files are allowed.",
      confirmButtonColor: "#3250B5",
    });
    fileInputRef.current.value = ""; 
  }
};

  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, logo: null }));
    setLogoPreview(null);
    fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!formData.name.trim()) errors.name = "Company name is required.";
    if (!formData.address.trim()) errors.address = "Address is required.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Valid email is required.";
    if (!formData.location.trim()) errors.location = "Location is required.";
    if (!formData.country) errors.country = "Country is required.";
    if (
      !formData.latitude ||
      formData.latitude < -90 ||
      formData.latitude > 90
    ) {
      errors.latitude = "Latitude must be between -90 and 90.";
    }
    if (
      !formData.longitude ||
      formData.longitude < -180 ||
      formData.longitude > 180
    ) {
      errors.longitude = "Longitude must be between -180 and 180.";
    }

    const phoneRegex = /^\d{7,12}$/;
    if (
      !formData.contact_number.trim() ||
      !phoneRegex.test(formData.contact_number)
    ) {
      errors.contact_number = "Phone must be 7 to 12 digits.";
    }

if (showPrivileges && formData.modules.length === 0) {
  errors.modules = "Select at least one module.";
}


    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setIsSubmitting(true);
    const modulesObject = {};
    allModules.forEach((mod) => {
      modulesObject[mod] = formData.modules.includes(mod);
    });
    console.log("module object:", modulesObject);
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("address", formData.address);
    payload.append("email", formData.email);
    payload.append("location", formData.location);
    payload.append("country", formData.country);
    payload.append("latitude", formData.latitude);
    payload.append("longitude", formData.longitude);
    payload.append(
      "contact_number",
      `${formData.country_code}${formData.contact_number}`
    );
if (showPrivileges) {
  payload.append("modules", JSON.stringify(modulesObject));
}

    if (formData.logo) payload.append("logo", formData.logo);

    try {
      if (isEdit && selectedCompany?.id) {
        await dispatch(
          editCompany({ id: selectedCompany.id, data: payload })
        ).unwrap();
        Swal.fire({
          title: "Updated!",
          text: "Company details have been updated successfully.",
          icon: "success",
          confirmButtonColor: "#3250B5",
        });
      } else {
        await dispatch(addCompany(payload)).unwrap();
        Swal.fire({
          title: "Saved!",
          text: "Company has been added successfully.",
          icon: "success",
          confirmButtonColor: "#3250B5",
        });
      }
      onClose();
    } catch (err) {
      console.error("Company save failed", err);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#D33",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormWrapper>
      <BackHeader>
        <GoArrowLeft onClick={onClose} style={{ cursor: "pointer" }} />
        <span>{isEdit ? "Edit Company" : "Add Company"}</span>
      </BackHeader>

      <form onSubmit={handleSubmit}>
        <FormSection>
          <div>
            <FormField>
              <Label>Company Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Company name"
                autoComplete="off"
              />
              {formErrors.name && (
                <p style={{ color: "red" }}>{formErrors.name}</p>
              )}
            </FormField>

            <FormField>
              <Label>Address</Label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Company Address"
                           autoComplete="off"
              />
              {formErrors.address && (
                <p style={{ color: "red" }}>{formErrors.address}</p>
              )}
            </FormField>

            <FormField>
              <Label>Email</Label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Company E-mail"
                 autoComplete="off"
              />
              {formErrors.email && (
                <p style={{ color: "red" }}>{formErrors.email}</p>
              )}
            </FormField>

            <FormField>
              <Label>Upload logo</Label>
              <LogoUploadBox onClick={() => fileInputRef.current.click()}>
                <FiUpload size={24} />
                <p>
                  Click to upload or Drag and Drop <br />
                  Max 2 MB file size (PNG or SVG only)
                </p>
                <input
                  type="file"
                  accept=".png,.svg"
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                  style={{ display: "none" }}
                />
              </LogoUploadBox>

              {logoPreview && (
                <LogoPreview>
                  {formData.logo?.type === "image/svg+xml" ? (
                    <object
                      data={logoPreview}
                      type="image/svg+xml"
                      width="50"
                      height="50"
                    />
                  ) : (
                    <img src={logoPreview} alt="Logo" />
                  )}
                  <button onClick={removeLogo} type="button">
                    <AiOutlineClose />
                  </button>
                </LogoPreview>
              )}
            </FormField>
          </div>

          <div>
            <FormField>
              <Label>Company location</Label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                 autoComplete="off"
              />
              {formErrors.location && (
                <p style={{ color: "red" }}>{formErrors.location}</p>
              )}
            </FormField>

            <FormField>
              <Label>Contact Number</Label>
              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  name="country_code"
                  value={formData.country_code}
                  onChange={handleChange}
                   autoComplete="off"
                  style={{ width: "35%", padding: "8px" }}
                >
                  {countryDialCodes.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>

                <Input
                  name="contact_number"
                  inputMode="numeric"
                  value={formData.contact_number}
                  onChange={handleChange}
                  placeholder="Phone number"
                  style={{ width: "65%" }}
                             autoComplete="off"
                />
              </div>
              {formErrors.contact_number && (
                <p style={{ color: "red" }}>{formErrors.contact_number}</p>
              )}
            </FormField>

            <FormField>
              <Label>Country</Label>

              <Select
                name="country"
                value={formData.country}
                onChange={handleChange}
                           autoComplete="off"
              >
                <option value="">Select country</option>
                {COUNTRY_CHOICES.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </Select>
              {formErrors.country && (
                <p style={{ color: "red" }}>{formErrors.country}</p>
              )}
            </FormField>
            <FormField>
              <Label>Latitude</Label>
              <Input
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Enter company latitude"
                 autoComplete="off"
              />
            </FormField>

            <FormField>
              <Label>Longitude</Label>
              <Input
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Enter company longitude"
                 autoComplete="off"
              />
            </FormField>
          </div>
        </FormSection>

      {showPrivileges && (
  <>
    <h4>Privileges</h4>

    <CheckboxGroup>
      {allModules.map((mod) => (
        <CheckboxLabel key={mod}>
          <input
            type="checkbox"
            value={mod}
            checked={formData.modules.includes(mod)}
            onChange={handleModuleChange}
          />
          {mod.charAt(0).toUpperCase() +
            mod.slice(1).replace("_", " ")}
        </CheckboxLabel>
      ))}
    </CheckboxGroup>

    {formErrors.modules && (
      <p style={{ color: "blue" }}>{formErrors.modules}</p>
    )}

    <Hr />
  </>
)}


        <ButtonGroup>
          <Button type="button" cancel onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <ClipLoader size={16} color="#fff" />
                {isEdit ? "Updating..." : "Saving..."}
              </div>
            ) : isEdit ? (
              "Update"
            ) : (
              "Save"
            )}
          </Button>
        </ButtonGroup>
      </form>
    </FormWrapper>
  );
};

export default AddCompanyModal;
