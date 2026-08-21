import React, { useState } from "react";

import {
  Overlay,
  Modal,
  ModalHeader,
  ModalTitle,
  CloseButton,
  Form,
  FormGroup,
  Label,
  Required,
  Input,
  Select,
  FieldsRow,
  SecondFieldsRow,
  ButtonRow,
  CancelButton,
  CreateButton,
} from "./AddProjectModal.styles";

const AddProjectModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "Onsite",
    latitude: "",
    longitude: "",
    priority: "High",
    startDate: "",
    projectStatus: "New",
    employees: [],
  });

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onCreate(formData);
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(event) => event.stopPropagation()}>

        <ModalHeader>
          <ModalTitle>Add New Project</ModalTitle>

          <CloseButton
            type="button"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>

          {/* Row 1: Project Name, Project Type, Latitude, Longitude, Priority */}
          <FieldsRow>
            <FormGroup>
              <Label>
                Project Name <Required>*</Required>
              </Label>
              <Input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                placeholder="Enter name of the Project"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Project Type <Required>*</Required>
              </Label>
              <Select
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
              >
                <option value="Onsite">Onsite</option>
                <option value="Variant">Variant</option>
                <option value="Office">Office</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                Latitude <Required>*</Required>
              </Label>
              <Input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="Enter Latitude"
                step="any"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Longitude <Required>*</Required>
              </Label>
              <Input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="Enter Longitude"
                step="any"
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Priority <Required>*</Required>
              </Label>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Select>
            </FormGroup>
          </FieldsRow>

          {/* Row 2: Start Date, Project Status, Add Employee */}
          <SecondFieldsRow>
            <FormGroup>
              <Label>
                Start Date <Required>*</Required>
              </Label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                Project Status <Required>*</Required>
              </Label>
              <Select
                name="projectStatus"
                value={formData.projectStatus}
                onChange={handleChange}
                required
              >
                <option value="New">New</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="OnHold">On Hold</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>
                Add Employee <Required>*</Required>
              </Label>
              <Select
                name="employees"
                value=""
                onChange={(event) => {
                  if (!event.target.value) return;

                  setFormData((prev) => ({
                    ...prev,
                    employees: [
                      ...prev.employees,
                      event.target.value,
                    ],
                  }));
                }}
                required={formData.employees.length === 0}
              >
                <option value="">Select Employee</option>
                <option value="employee1">Employee 1</option>
                <option value="employee2">Employee 2</option>
                <option value="employee3">Employee 3</option>
                <option value="employee4">Employee 4</option>
              </Select>
            </FormGroup>
          </SecondFieldsRow>

          <ButtonRow>
            <CancelButton
              type="button"
              onClick={onClose}
            >
              CANCEL
            </CancelButton>

            <CreateButton type="submit">
              CREATE PROJECT
            </CreateButton>
          </ButtonRow>

        </Form>
      </Modal>
    </Overlay>
  );
};

export default AddProjectModal;