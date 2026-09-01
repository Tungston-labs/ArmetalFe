import React, { useEffect, useState } from "react";

import {
    Overlay,
    ModalContainer,
    ModalHeader,
    ModalTitle,
    ModalBody,
    FormGrid,
    FormGroup,
    Label,
    Required,
    Input,
    SelectWrapper,
    Select,
    SelectArrow,
    ButtonRow,
    CancelButton,
    SubmitButton,
} from "./ProjectModal.Styles";

const initialFormData = {
    projectName: "",
    projectType: "on_site",
    latitude: "",
    longitude: "",
    priority: "High",
    startDate: "",
    projectStatus: "in_progress",
    employee: "",
};

const ProjectModal = ({
    isOpen,
    onClose,
    editData = null,
    onSubmit,
}) => {
    const [formData, setFormData] = useState(initialFormData);

    const isEditMode = Boolean(editData);

    useEffect(() => {
        if (editData) {
            setFormData({
                projectName:
                    editData.projectName ||
                    editData.name ||
                    editData.title ||
                    "",

                projectType:
                    editData.projectType ||
                    editData.punch_type ||
                    "on_site",

                latitude: editData.latitude || "",

                longitude: editData.longitude || "",

                priority: editData.priority || "High",

                startDate:
                    editData.startDate ||
                    editData.start_date ||
                    editData.date ||
                    "",

                projectStatus:
                    editData.projectStatus ||
                    editData.status ||
                    "in_progress",

                employee: editData.employee || "",
            });
        } else {
            setFormData(initialFormData);
        }
    }, [editData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        onSubmit(formData, editData);
    };

    const handleClose = () => {
        setFormData(initialFormData);
        onClose();
    };

    if (!isOpen) {
        return null;
    }

    return (
        <Overlay>
            <ModalContainer>

                {/* Header */}
                <ModalHeader>
                    <ModalTitle>
                        {isEditMode
                            ? "Edit Project"
                            : "Add New Project"}
                    </ModalTitle>
                </ModalHeader>

                {/* Body */}
                <ModalBody>
                    <form onSubmit={handleSubmit}>

                        <FormGrid>

                            {/* Project Name */}
                            <FormGroup>
                                <Label>
                                    Project Name{" "}
                                    <Required>*</Required>
                                </Label>

                                <Input
                                    type="text"
                                    name="projectName"
                                    placeholder="Enter name of the Project"
                                    value={formData.projectName}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            {/* Project Type */}
                            <FormGroup>
                                <Label>
                                    Project Type{" "}
                                    <Required>*</Required>
                                </Label>

                                <SelectWrapper>
                                    <Select
                                        name="projectType"
                                        value={formData.projectType}
                                        onChange={handleChange}
                                    >
                                        <option value="on_site">
                                            On Site
                                        </option>

                                        <option value="variant">
                                            Variant
                                        </option>

                                        <option value="bench">
                                            Bench
                                        </option>
                                    </Select>

                                    <SelectArrow>
                                        ⌄
                                    </SelectArrow>
                                </SelectWrapper>
                            </FormGroup>

                            {/* Latitude */}
                            <FormGroup>
                                <Label>
                                    Latitude{" "}
                                    <Required>*</Required>
                                </Label>

                                <Input
                                    type="text"
                                    name="latitude"
                                    placeholder="Enter Latitude"
                                    value={formData.latitude}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            {/* Longitude */}
                            <FormGroup>
                                <Label>
                                    Longitude{" "}
                                    <Required>*</Required>
                                </Label>

                                <Input
                                    type="text"
                                    name="longitude"
                                    placeholder="Enter Longitude"
                                    value={formData.longitude}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            {/* Priority */}
                            <FormGroup>
                                <Label>
                                    Priority{" "}
                                    <Required>*</Required>
                                </Label>

                                <SelectWrapper>
                                    <Select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                    >
                                        <option value="high">
                                            High
                                        </option>

                                        <option value="medium">
                                            Medium
                                        </option>

                                        <option value="low">
                                            Low
                                        </option>
                                    </Select>

                                    <SelectArrow>
                                        ⌄
                                    </SelectArrow>
                                </SelectWrapper>
                            </FormGroup>

                            {/* Start Date */}
                            <FormGroup>
                                <Label>
                                    Start Date{" "}
                                    <Required>*</Required>
                                </Label>

                                <Input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            {/* Project Status */}
                            <FormGroup>
                                <Label>
                                    Project Status{" "}
                                    <Required>*</Required>
                                </Label>

                                <SelectWrapper>
                                    <Select
                                        name="projectStatus"
                                        value={formData.projectStatus}
                                        onChange={handleChange}
                                    >
                                        <option value="in_progress">
                                            In Progress
                                        </option>

                                        <option value="completed">
                                            Completed
                                        </option>

                                        <option value="on_hold">
                                            On Hold
                                        </option>

                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                    </Select>

                                    <SelectArrow>
                                        ⌄
                                    </SelectArrow>
                                </SelectWrapper>
                            </FormGroup>

                         

                        </FormGrid>

                        {/* Buttons */}
                        <ButtonRow>

                            <CancelButton
                                type="button"
                                onClick={handleClose}
                            >
                                CANCEL
                            </CancelButton>

                            <SubmitButton type="submit">
                                {isEditMode
                                    ? "UPDATE PROJECT"
                                    : "CREATE PROJECT"}
                            </SubmitButton>

                        </ButtonRow>

                    </form>
                </ModalBody>

            </ModalContainer>
        </Overlay>
    );
};

export default ProjectModal;