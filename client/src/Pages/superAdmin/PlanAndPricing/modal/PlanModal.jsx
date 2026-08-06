import React, { useEffect, useState } from "react";
import {
    Overlay,
    Modal,
    Header,
    Title,
    CloseButton,
    Form,
    Row,
    Field,
    Label,
    Input,
    Select,
    PriceInputWrapper,
    Currency,
    TextArea,
    FeatureSection,
    FeatureHeader,
    AddFeatureButton,
    FeatureList,
    FeatureItem,
    Checkbox,
    RemoveButton,
    Footer,
    CancelButton,
    SubmitButton,
    Rows,
    Required,
} from "./PlanModal.styles";

import { IoClose } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

const initialForm = {
    planName: "",
    tier: "",
    employees: "",
    price: "",
    extraCharge: "",
    description: "",
    features: [],
};

function PlanModal({
    open,
    mode = "add",
    initialData = null,
    onClose,
    onSubmit,
}) {
    const [formData, setFormData] = useState(initialForm);
    const [featureInput, setFeatureInput] = useState("");

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setFormData({
                ...initialForm,
                ...initialData,
                features: initialData.features || [],
            });
        } else {
            setFormData(initialForm);
        }

        setFeatureInput("");
    }, [mode, initialData, open]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addFeature = () => {
        if (!featureInput.trim()) return;

        setFormData((prev) => ({
            ...prev,
            features: [
                ...prev.features,
                {
                    id: Date.now(),
                    text: featureInput,
                    checked: true,
                },
            ],
        }));

        setFeatureInput("");
    };

    const removeFeature = (id) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.filter((item) => item.id !== id),
        }));
    };

    const toggleFeature = (id) => {
        setFormData((prev) => ({
            ...prev,
            features: prev.features.map((item) =>
                item.id === id
                    ? { ...item, checked: !item.checked }
                    : item
            ),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.planName.trim()) {
            alert("Plan Name is required");
            return;
        }

        if (!formData.tier) {
            alert("Select Tier");
            return;
        }

        if (!formData.price) {
            alert("Enter Plan Price");
            return;
        }

        onSubmit?.(formData);

        onClose();
    };

    return (
        <Overlay>
            <Modal>
                <Header>
                    <Title>
                        {mode === "add" ? "Add New Plan" : "Edit Plan"}
                    </Title>

                    
                </Header>

                <Form onSubmit={handleSubmit}>

                    <Row>

                        <Field>
               
                            <Label>Plan Name<Required>*</Required></Label>

                            <Input
                                name="planName"
                                value={formData.planName}
                                onChange={handleChange}
                                placeholder="Enter name of the name plan"
                            />
                        </Field>

                        <Field>
                            <Label>Tier<Required>*</Required></Label>

                            <Select
                                name="tier"
                                value={formData.tier}
                                onChange={handleChange}
                            >
                                <option value="">Select Tier</option>
                                <option value="Basic">Basic</option>
                                <option value="Pro">Pro</option>
                                <option value="Enterprise">
                                    Enterprise
                                </option>
                                <option value="Custom">Custom</option>
                            </Select>
                        </Field>

                    </Row>

                    <Row>

                        <Field>
                            <Label>Number of Employees<Required>*</Required></Label>

                            <Input
                                type="number"
                                name="employees"
                                value={formData.employees}
                                onChange={handleChange}
                                placeholder="00"
                            />
                        </Field>
                    </Row>
                    <Rows>
                        <Field>
                            <Label>Price/Month<Required>*</Required></Label>

                            <PriceInputWrapper>
                                <Currency></Currency>

                                <Input
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="1500"
                                />
                            </PriceInputWrapper>
                        </Field>

                        <Field>
                            <Label>Extra Employee Charge<Required>*</Required></Label>

                            <PriceInputWrapper>
                                <Currency></Currency>

                                <Input
                                    name="extraCharge"
                                    value={formData.extraCharge}
                                    onChange={handleChange}
                                    placeholder="₹ Per Employee"
                                />
                            </PriceInputWrapper>
                        </Field>
                    </Rows>
                   <FeatureSection>
  <FeatureHeader>
    <Label>Features</Label>

    <AddFeatureButton
      type="button"
      onClick={addFeature}
    >
      <FiPlus />
      Add
    </AddFeatureButton>
  </FeatureHeader>

  <Input
    value={featureInput}
    onChange={(e) => setFeatureInput(e.target.value)}
    placeholder="Enter feature"
  />

  <FeatureList>
    {formData.features.map((feature) => (
      <FeatureItem key={feature.id}>
        <Checkbox>
          <input
            type="checkbox"
            checked={feature.checked}
            onChange={() => toggleFeature(feature.id)}
          />

          {feature.text}
        </Checkbox>

        <RemoveButton
          type="button"
          onClick={() => removeFeature(feature.id)}
        >
          <RiDeleteBin6Line />
        </RemoveButton>
      </FeatureItem>
    ))}
  </FeatureList>
</FeatureSection>

                 

                    <Footer>

                        <CancelButton
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </CancelButton>

                        <SubmitButton type="submit">
                            {mode === "add"
                                ? "Create Plan"
                                : "Update Plan"}
                        </SubmitButton>

                    </Footer>

                </Form>
            </Modal>
        </Overlay>
    );
}

export default PlanModal;