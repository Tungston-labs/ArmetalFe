import React from "react";

import {
  Container,
  InfoWrapper,
  Row,
  FieldGroup,
  FieldLabel,
  Input,
  TextArea,
  Select,
  ErrorText,
  SectionTitle,
} from "./EmployeeHeader.Styles";

const EmployeeHeader = ({
  formData,
  setFormData,
  setIsFormDirty,
  errors,
  setErrors,
}) => {
  const MAX_SIZE = 5 * 1024 * 1024;

  const handleChange = (e) => {
    const {
      name,
      value,
      files,
      type,
    } = e.target;

    if (type === "file") {
      const file = files?.[0];

      if (!file) {
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Please upload a valid image file.",
        }));
        return;
      }

      if (file.size > MAX_SIZE) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Image size must be less than 5 MB.",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));

      setIsFormDirty(true);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error once user starts correcting it
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setIsFormDirty(true);
  };

  return (
    <Container>
      <SectionTitle>
        Basic Details
      </SectionTitle>

      <InfoWrapper>
        {/* =========================
            ROW 1
        ========================== */}
        <Row>
          <FieldGroup>
            <FieldLabel>
              Name
            </FieldLabel>

            <Input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formData.name || ""}
              onChange={handleChange}
              autoComplete="off"
              $error={Boolean(errors?.name)}
            />

            {errors?.name && (
              <ErrorText>
                {errors.name}
              </ErrorText>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>
              Email
            </FieldLabel>

            <Input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email || ""}
              onChange={handleChange}
              autoComplete="off"
              $error={Boolean(errors?.email)}
            />

            {errors?.email && (
              <ErrorText>
                {errors.email}
              </ErrorText>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>
              Date of Birth
            </FieldLabel>

            <Input
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={handleChange}
              $error={Boolean(errors?.dob)}
            />

            {errors?.dob && (
              <ErrorText>
                {errors.dob}
              </ErrorText>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>
              Employee ID
            </FieldLabel>

            <Input
              type="text"
              name="employee_code"
              placeholder="Enter employee ID"
              value={formData.employee_code || ""}
              onChange={handleChange}
              autoComplete="off"
              $error={Boolean(errors?.employee_code)}
            />

            {errors?.employee_code && (
              <ErrorText>
                {errors.employee_code}
              </ErrorText>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>
              Gender
            </FieldLabel>

            <Select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              $error={Boolean(errors?.gender)}
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>
            </Select>

            {errors?.gender && (
              <ErrorText>
                {errors.gender}
              </ErrorText>
            )}
          </FieldGroup>
        </Row>

        {/* =========================
            ROW 2
        ========================== */}
        <Row>
          <FieldGroup>
            <FieldLabel>
              Contact Number
            </FieldLabel>

            <Input
              type="tel"
              name="phno"
              placeholder="Enter contact number"
              value={formData.phno || ""}
              onChange={handleChange}
              autoComplete="off"
              $error={Boolean(errors?.phno)}
            />

            {errors?.phno && (
              <ErrorText>
                {errors.phno}
              </ErrorText>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>
              Address
            </FieldLabel>

            <Input
              type="text"
              name="address"
              placeholder="Enter full address"
              value={formData.address || ""}
              onChange={handleChange}
              autoComplete="off"
              $error={Boolean(errors?.address)}
            />

            {errors?.address && (
              <ErrorText>
                {errors.address}
              </ErrorText>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>
              Country
            </FieldLabel>

            <Input
              type="text"
              name="country"
              placeholder="Enter country"
              value={formData.country || ""}
              onChange={handleChange}
              autoComplete="off"
              $error={Boolean(errors?.country)}
            />

            {errors?.country && (
              <ErrorText>
                {errors.country}
              </ErrorText>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>
              Blood Group
            </FieldLabel>

            <Select
              name="blood_group"
              value={formData.blood_group || ""}
              onChange={handleChange}
              $error={Boolean(errors?.blood_group)}
            >
              <option value="">
                Select Blood Group
              </option>

              <option value="A+">
                A+
              </option>

              <option value="A-">
                A-
              </option>

              <option value="B+">
                B+
              </option>

              <option value="B-">
                B-
              </option>

              <option value="AB+">
                AB+
              </option>

              <option value="AB-">
                AB-
              </option>

              <option value="O+">
                O+
              </option>

              <option value="O-">
                O-
              </option>
            </Select>

            {errors?.blood_group && (
              <ErrorText>
                {errors.blood_group}
              </ErrorText>
            )}
          </FieldGroup>
        </Row>
      </InfoWrapper>
    </Container>
  );
};

export default EmployeeHeader;