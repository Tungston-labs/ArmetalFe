// components/AddCompany/useAddCompany.js
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCompany, editCompany } from "../../Redux/superAdminSlice";
import Swal from "sweetalert2";

export const useAddCompany = ({ isEdit, selectedCompany, onClose, allModules }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [formErrors, setFormErrors] = useState({});

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
    amount_per_employee: "",
    initial_payment: "",
    // optional: salary structure fields can be added here later
  });

  // Prefill when editing
  useEffect(() => {
    if (isEdit && selectedCompany) {
      const modulesChecked = allModules?.filter(
        (mod) => selectedCompany.modules?.[mod]
      ) || [];

      const match = selectedCompany.contact_number?.match(/^(\+\d{1,4})(\d{6,15})$/);

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
        amount_per_employee: selectedCompany.amount_per_employee || "",
        initial_payment: selectedCompany.initial_payment || "",
      });

      if (selectedCompany.logo) {
        setLogoPreview(selectedCompany.logo);
      } else {
        setLogoPreview(null);
      }
    }
  }, [isEdit, selectedCompany, allModules]);

  // basic change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear single-field error
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // checkbox modules
  const handleModuleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(value)
        ? prev.modules.filter((m) => m !== value)
        : [...prev.modules, value],
    }));
  };

  // logo file handling
  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      Swal.fire({
        icon: "error",
        title: "Invalid file type",
        text: "Only PNG or SVG files are allowed.",
        confirmButtonColor: "#3250B5",
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFormData((prev) => ({ ...prev, logo: file }));
    setLogoPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, logo: null }));
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // basic validation - extend this as needed
  const validate = () => {
    const errs = {};
    if (!formData.name?.trim()) errs.name = "Company name is required";
    if (!formData.email?.trim()) errs.email = "Company email is required";
    // you can add more field validations here
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const lat = Number(formData.latitude) || "";
      const lng = Number(formData.longitude) || "";
      const amount = Number(formData.amount_per_employee) || "";
      const initial = Number(formData.initial_payment || 0) || "";

      const formattedModules = {};
      (formData.modules || []).forEach((m) => {
        formattedModules[m] = true;
      });

      const formPayload = new FormData();

      formPayload.append("name", formData.name);
      formPayload.append("address", formData.address);
      formPayload.append("email", formData.email);
      formPayload.append("location", formData.location);
      formPayload.append("country", formData.country);
      formPayload.append("contact_number", `${formData.country_code}${formData.contact_number}`);
      formPayload.append("latitude", lat);
      formPayload.append("longitude", lng);
      formPayload.append("amount_per_employee", amount);
      formPayload.append("initial_payment", initial);
      formPayload.append("modules", JSON.stringify(formattedModules));

      if (formData.logo) {
        formPayload.append("logo", formData.logo);
      }

      if (isEdit) {
        await dispatch(editCompany({ id: selectedCompany.id, data: formPayload })).unwrap();
        await Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Company updated successfully.",
          confirmButtonColor: "#3250B5",
        });
      } else {
        await dispatch(addCompany(formPayload)).unwrap();
        await Swal.fire({
          icon: "success",
          title: "Created!",
          text: "Company created successfully.",
          confirmButtonColor: "#3250B5",
        });
      }

      onClose?.();
    } catch (err) {
      console.error("ERROR:", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err?.message || "Something went wrong. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


const totalPercent =
  Number(formData.basic_percent || 0) +
  Number(formData.house_rent_percent || 0) +
  Number(formData.transport_percent || 0) +
  Number(formData.special_percent || 0);
  return {
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    fileInputRef,
    logoPreview,
    isSubmitting,
    handleChange,
    handleModuleChange,
    handleLogoChange,
    removeLogo,
    handleSubmit,
    totalPercent
  };
};