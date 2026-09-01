import React from "react";
import { GoArrowLeft } from "react-icons/go";

import {
  ProfileContainer,
  ProfileCard,
  ProfileCardBody,
  ContentArea,
  InputField,
  InputLabel,
  InputBox,
  BackArrowWrapper,
} from "./Header.Styles";

import Stepper from "./Stepper";

const Header = ({
  employee = {},
  editable = false,
  onChange,
  onImageChange,
  onBack,
  currentStep = 1,
  steps = ["Basic Details", "Bank Details", "Documents"],
}) => {
  /* =====================================================
     DATE FORMAT
  ====================================================== */

  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    const day = String(
      d.getDate()
    ).padStart(2, "0");

    const month = d.toLocaleString(
      "en-US",
      {
        month: "short",
      }
    );

    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <ProfileContainer>
      <ProfileCard>

        {/* =====================================================
            GRADIENT STEPPER — avatar + step track,
            corners square on the bottom so it sits flush
            against the card body below it
        ====================================================== */}

        <Stepper
          embedded
          currentStep={currentStep}
          steps={steps}
          profileImageSrc={
            employee?.profile_pic || null
          }
          editable={editable}
          onProfileImageChange={
            onImageChange
          }
        />

        <ProfileCardBody>

          {/* =====================================================
              BACK BUTTON
          ====================================================== */}

          {onBack && (
            <BackArrowWrapper onClick={onBack}>
              <GoArrowLeft size={20} />
            </BackArrowWrapper>
          )}

          {/* =====================================================
              EMPLOYEE INFORMATION
          ====================================================== */}

          <ContentArea>

            {/* ================= NAME ================= */}

            <InputField>
              <InputLabel>
                Name
              </InputLabel>

              <InputBox
                type="text"
                name="name"
                value={employee.name || ""}
                readOnly={!editable}
                onChange={onChange}
                autoComplete="off"
              />
            </InputField>

            {/* ================= EMAIL ================= */}

            <InputField>
              <InputLabel>
                Email
              </InputLabel>

              <InputBox
                type="email"
                name="email"
                value={employee.email || ""}
                readOnly={!editable}
                onChange={onChange}
                autoComplete="off"
              />
            </InputField>

            {/* ================= DATE OF BIRTH ================= */}

            <InputField>
              <InputLabel>
                Date of Birth
              </InputLabel>

              <InputBox
                type={editable ? "date" : "text"}
                name="dob"
                value={
                  editable
                    ? employee.dob
                      ? employee.dob.split("T")[0]
                      : ""
                    : formatDate(employee.dob)
                }
                readOnly={!editable}
                onChange={onChange}
              />
            </InputField>

            {/* ================= EMPLOYEE ID ================= */}

            <InputField>
              <InputLabel>
                Employee ID
              </InputLabel>

              <InputBox
                type="text"
                name="employee_id"
                value={
                  employee.employee_id || ""
                }
                readOnly={!editable}
                onChange={onChange}
                autoComplete="off"
              />
            </InputField>

            {/* ================= GENDER ================= */}

            <InputField>
              <InputLabel>
                Gender
              </InputLabel>

              <InputBox
                type="text"
                name="gender"
                value={employee.gender || ""}
                readOnly={!editable}
                onChange={onChange}
              />
            </InputField>

            {/* ================= CONTACT NUMBER ================= */}

            <InputField>
              <InputLabel>
                Contact Number
              </InputLabel>

              <InputBox
                type="tel"
                name="phno"
                value={
                  employee.phno ||
                  employee.phno ||
                  ""
                }
                readOnly={!editable}
                onChange={onChange}
                autoComplete="off"
              />
            </InputField>

            {/* ================= ADDRESS ================= */}

            <InputField $fullWidth>
              <InputLabel>
                Address
              </InputLabel>

              <InputBox
                type="text"
                name="address"
                value={employee.address || ""}
                readOnly={!editable}
                onChange={onChange}
                autoComplete="off"
              />
            </InputField>

            {/* ================= COUNTRY ================= */}

            <InputField>
              <InputLabel>
                Country
              </InputLabel>

              <InputBox
                type="text"
                name="country"
                value={employee.country || ""}
                readOnly={!editable}
                onChange={onChange}
                autoComplete="off"
              />
            </InputField>

            {/* ================= BLOOD GROUP ================= */}

    {/* ================= BLOOD GROUP ================= */}

<InputField>
  <InputLabel>
    Blood Group
  </InputLabel>

  {editable ? (
    <InputBox
      as="select"
      name="blood_group"
      value={employee.blood_group || ""}
      onChange={onChange}
    >
      <option value="">Select Blood Group</option>
      <option value="A+">A+</option>
      <option value="A-">A-</option>
      <option value="B+">B+</option>
      <option value="B-">B-</option>
      <option value="AB+">AB+</option>
      <option value="AB-">AB-</option>
      <option value="O+">O+</option>
      <option value="O-">O-</option>
    </InputBox>
  ) : (
    <InputBox
      type="text"
      name="blood_group"
      value={employee.blood_group || "-"}
      readOnly
    />
  )}
</InputField>

          </ContentArea>
        </ProfileCardBody>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default Header;