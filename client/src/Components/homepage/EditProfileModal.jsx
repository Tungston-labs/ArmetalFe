import React, { useState, useEffect, useRef } from "react";
import {
  FormWrapper,
  BackHeader,
  FormSection,
  Input,
  ButtonGroup,
  Button,
  Select,
  FormField,
  Label,
  LogoUploadBox,
  LogoPreview,
} from "../../Pages/superAdmin/AddCompany.Styles";
import { GoArrowLeft } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { getCompanySelf, patchCompanySelf } from "../../Redux/companySlice";
import { AiOutlineClose } from "react-icons/ai";
import Swal from "sweetalert2";
import { ClipLoader } from "react-spinners";

const EditProfileModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const { company } = useSelector((state) => state.company);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countryDialCodes = [
    { code: "+91", label: "India (+91)" },
    { code: "+971", label: "UAE (+971)" },
    { code: "+966", label: "Saudi Arabia (+966)" },
    { code: "+965", label: "Kuwait (+965)" },
    { code: "+973", label: "Bahrain (+973)" },
    { code: "+968", label: "Oman (+968)" },
    { code: "+974", label: "Qatar (+974)" },
  ];

  const COUNTRY_CHOICES = [
    { code: "IN", name: "India" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "SG", name: "Singapore" },
  ];

  const [logoPreview, setLogoPreview] = useState(() => company?.logo || null);
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState(() => ({
    name: company?.name || "",
    address: company?.address || "",
    email: company?.email || "",
    location: company?.location || "",
    country: company?.country || "",
    country_code: "+91",
    contact_number: "",
    latitude: company?.latitude ?? "",
    longitude: company?.longitude ?? "",
    logo: null,
  }));

  useEffect(() => {
    dispatch(getCompanySelf());
  }, [dispatch]);

  useEffect(() => {
    if (!company) return;
    const dialCode = countryDialCodes.find((item) =>
      company.contact_number?.startsWith(item.code)
    );

    const countryCode = dialCode?.code || "+91";
    const phoneNumber = company.contact_number
      ? company.contact_number.replace(countryCode, "")
      : "";

    setFormData({
      name: company.name || "",
      address: company.address || "",
      email: company.email || "",
      location: company.location || "",
      country: company.country || "",
      country_code: countryCode,
      contact_number: phoneNumber,
      latitude: company.latitude ?? "",
      longitude: company.longitude ?? "",
      logo: null,
    });

    if (company.logo) {
      setLogoPreview(company.logo);
    }
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "image/png" || file.type === "image/svg+xml") {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));

      try {
        const previewUrl = URL.createObjectURL(file);
        setLogoPreview(previewUrl);
      } catch (err) {
        setLogoPreview("blob:test-logo-url");
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Invalid file type",
        text: "Only PNG or SVG files are allowed.",
        confirmButtonColor: "#3250B5",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logo: null,
    }));
    setLogoPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Company name is required";
    }

    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    if (!formData.country) {
      errors.country = "Country is required";
    }

    const latNum = Number(formData.latitude);
    if (
      formData.latitude === "" ||
      isNaN(latNum) ||
      latNum < -90 ||
      latNum > 90
    ) {
      errors.latitude = "Latitude must be between -90 and 90";
    }

    const lngNum = Number(formData.longitude);
    if (
      formData.longitude === "" ||
      isNaN(lngNum) ||
      lngNum < -180 ||
      lngNum > 180
    ) {
      errors.longitude = "Longitude must be between -180 and 180";
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const payload = {
      name: formData.name,
      address: formData.address,
      location: formData.location,
      country: formData.country,
      latitude: latNum,
      longitude: lngNum,
      contact_number: `${formData.country_code}${formData.contact_number}`,
      logo: formData.logo || null,
    };

    try {
      setIsSubmitting(true);
      await dispatch(patchCompanySelf(payload)).unwrap();
      await Swal.fire({
        title: "Updated!",
        text: "Company profile updated successfully.",
        icon: "success",
        confirmButtonColor: "#3250B5",
      });
      if (onClose) onClose();
    } catch (err) {
      await Swal.fire({
        title: "Error!",
        text: "Failed to update company profile.",
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
        <GoArrowLeft onClick={onClose} />
        <h2>Company Profile</h2>
      </BackHeader>

      <form onSubmit={handleSubmit}>
        <FormSection>
          <FormField>
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {formErrors.name && <span>{formErrors.name}</span>}
          </FormField>

          <FormField>
            <Label htmlFor="company-address">Address</Label>
            <Input
              id="company-address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            {formErrors.address && <span>{formErrors.address}</span>}
          </FormField>

          <FormField>
            <Label htmlFor="company-location">Location</Label>
            <Input
              id="company-location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
            {formErrors.location && <span>{formErrors.location}</span>}
          </FormField>

          <FormField>
            <Label htmlFor="company-email">Email</Label>
            <Input
              id="company-email"
              name="email"
              value={formData.email}
              disabled
            />
          </FormField>

          <FormField>
            <Label htmlFor="company-country">Country</Label>
            <Select
              id="company-country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              disabled
            >
              {COUNTRY_CHOICES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField>
            <Label htmlFor="country-code">Country Code</Label>
            <Select
              id="country-code"
              name="country_code"
              value={formData.country_code}
              onChange={handleChange}
              disabled
            >
              {countryDialCodes.map((d) => (
                <option key={d.code} value={d.code}>
                  {d.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField>
            <Label htmlFor="contact-number">Contact Number</Label>
            <Input
              id="contact-number"
              name="contact_number"
              value={formData.contact_number}
              onChange={handleChange}
              disabled
            />
          </FormField>

          <FormField>
            <Label htmlFor="company-latitude">Latitude</Label>
            <Input
              id="company-latitude"
              name="latitude"
              type="number"
              value={formData.latitude}
              onChange={handleChange}
            />
            {formErrors.latitude && <span>{formErrors.latitude}</span>}
          </FormField>

          <FormField>
            <Label htmlFor="company-longitude">Longitude</Label>
            <Input
              id="company-longitude"
              name="longitude"
              type="number"
              value={formData.longitude}
              onChange={handleChange}
            />
            {formErrors.longitude && <span>{formErrors.longitude}</span>}
          </FormField>

          <LogoUploadBox>
            <input
              type="file"
              ref={fileInputRef}
              data-testid="logo-file-input"
              onChange={handleLogoChange}
              accept="image/png, image/svg+xml"
            />
            {logoPreview && (
              <LogoPreview>
                <img src={logoPreview} alt="company logo" />
                <button
                  type="button"
                  data-testid="remove-logo-button"
                  onClick={removeLogo}
                >
                  <AiOutlineClose />
                </button>
              </LogoPreview>
            )}
          </LogoUploadBox>

          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <ClipLoader size={15} /> Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </ButtonGroup>
        </FormSection>
      </form>
    </FormWrapper>
  );
};

export default EditProfileModal;