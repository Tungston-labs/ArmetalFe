import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { addCompany, editCompany } from "../../Redux/superAdminSlice";
import Swal from "sweetalert2";

export const useAddCompany = ({
  isEdit,
  selectedCompany,
  onClose,
  allModules,
}) => {
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
    basic_salary_percent: "",
    house_allowance_percent: "",
    transport_allowance_percent: "",
    special_allowance_percent: "",
    working_hours_per_day: "",
    half_day_hours: "",
  });

  /* =========================
     EDIT MODE PREFILL
  ========================= */

  useEffect(() => {
    if (isEdit && selectedCompany) {
      const modulesChecked =
        allModules?.filter((mod) => selectedCompany.modules?.[mod]) || [];

      const match =
        selectedCompany.contact_number?.match(/^(\+\d{1,4})(\d{6,15})$/);

      setFormData({
        name: selectedCompany.name ?? "",
        address: selectedCompany.address ?? "",
        email: selectedCompany.email ?? "",
        location: selectedCompany.location ?? "",
        country: selectedCompany.country ?? "",
        country_code: match ? match[1] : "+971",
        contact_number: match ? match[2] : "",
        modules: modulesChecked,
        logo: null,
        latitude: selectedCompany.latitude ?? "",
        longitude: selectedCompany.longitude ?? "",
        amount_per_employee: selectedCompany.amount_per_employee ?? "",
        initial_payment: selectedCompany.initial_payment ?? "",
        basic_salary_percent: selectedCompany.basic_salary_percent ?? "",
        house_allowance_percent:
          selectedCompany.house_allowance_percent ?? "",
        transport_allowance_percent:
          selectedCompany.transport_allowance_percent ?? "",
        special_allowance_percent:
          selectedCompany.special_allowance_percent ?? "",
        working_hours_per_day:
          selectedCompany.working_hours_per_day ?? "",
        half_day_hours: selectedCompany.half_day_hours ?? "",
      });

      setLogoPreview(selectedCompany.logo ?? null);
    }
  }, [isEdit, selectedCompany]);

  /* =========================
     HANDLERS
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleModuleChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      modules: prev.modules.includes(value)
        ? prev.modules.filter((m) => m !== value)
        : [...prev.modules, value],
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/png", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      Swal.fire("Invalid file", "Only PNG or SVG allowed", "error");
      return;
    }

    setFormData((prev) => ({ ...prev, logo: file }));
    setLogoPreview(URL.createObjectURL(file));
  };

  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, logo: null }));
    setLogoPreview(null);
  };

  /* =========================
     SALARY CALCULATION
  ========================= */

  const totalPercent =
    Number(formData.basic_salary_percent || 0) +
    Number(formData.house_allowance_percent || 0) +
    Number(formData.transport_allowance_percent || 0) +
    Number(formData.special_allowance_percent || 0);

  /* =========================
     LIVE VALIDATION (EXCEED 100)
  ========================= */

  useEffect(() => {
    if (totalPercent > 100) {
      setFormErrors((prev) => ({
        ...prev,
        salary: "Total percentage cannot exceed 100%",
      }));
    } else {
      setFormErrors((prev) => ({
        ...prev,
        salary: "",
      }));
    }
  }, [totalPercent]);

  /* =========================
     FINAL VALIDATION ON SUBMIT
  ========================= */

  const validate = () => {
    const errs = {};

    if (!formData.name?.trim())
      errs.name = "Company name is required";

    if (!formData.email?.trim())
      errs.email = "Company email is required";

    if (totalPercent > 100) {
      errs.salary = "Total percentage cannot exceed 100%";
    } else if (totalPercent < 100) {
      errs.salary = "Total percentage must equal 100%";
    }

    if (
      formData.working_hours_per_day &&
      formData.half_day_hours &&
      Number(formData.half_day_hours) >=
        Number(formData.working_hours_per_day)
    ) {
      errs.half_day_hours =
        "Half day hours must be less than working hours";
    }

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* =========================
     SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      const formattedModules = {};
      formData.modules.forEach((m) => (formattedModules[m] = true));

      const formPayload = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "modules" || key === "contact_number") return;
        if (key === "logo" && !formData.logo) return;

        if (formData[key] !== "" && formData[key] !== null) {
          formPayload.append(key, formData[key]);
        }
      });

      formPayload.append("modules", JSON.stringify(formattedModules));

      formPayload.append(
        "contact_number",
        `${formData.country_code}${formData.contact_number}`
      );

      if (isEdit) {
        await dispatch(
          editCompany({ id: selectedCompany.id, data: formPayload })
        ).unwrap();
        Swal.fire("Updated!", "Company updated successfully.", "success");
      } else {
        await dispatch(addCompany(formPayload)).unwrap();
        Swal.fire("Created!", "Company created successfully.", "success");
      }

      onClose?.();
    } catch (err) {
      Swal.fire(
        "Error",
        err?.message || "Something went wrong",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    formErrors,
    fileInputRef,
    logoPreview,
    isSubmitting,
    handleChange,
    handleModuleChange,
    handleLogoChange,
    removeLogo,
    handleSubmit,
    totalPercent,
  };
};