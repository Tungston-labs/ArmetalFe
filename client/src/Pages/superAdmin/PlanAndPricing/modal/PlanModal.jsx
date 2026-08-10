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

import {
  fetchSubscriptionFeatures,
  createSubscriptionFeature,
  createSubscriptionPlan,
  updateSubscriptionPlan,
} from "../../../../services/superAdminService";

const initialForm = {
  planName: "",
  tier: "",
  employeeLimit: "",
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

  const [featureDescription, setFeatureDescription] = useState("");

  const [availableFeatures, setAvailableFeatures] = useState([]);

  const [loadingFeatures, setLoadingFeatures] = useState(false);

  const [addingFeature, setAddingFeature] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  /*
   * Load features whenever modal opens
   */
  useEffect(() => {
    if (!open) return;

    loadFeatures();

    if (mode === "edit" && initialData) {
      setFormData({
        ...initialForm,
        planName: initialData.name || initialData.planName || "",
        tier: initialData.plan_type || initialData.tier || "",
        employeeLimit:
          initialData.employee_limit ||
          initialData.employeeLimit ||
          "",
        price:
          initialData.base_price ||
          initialData.price ||
          "",
        extraCharge:
          initialData.extra_employee_price ||
          initialData.extraCharge ||
          "",
        description:
          initialData.description || "",
        features:
          initialData.features || [],
      });
    } else {
      setFormData(initialForm);
    }

    setFeatureInput("");
    setFeatureDescription("");
  }, [mode, initialData, open]);

  /*
   * GET /subscription-features/
   */
  const loadFeatures = async () => {
    try {
      setLoadingFeatures(true);

      const response = await fetchSubscriptionFeatures();

      console.log("Subscription features response:", response);

      const features = Array.isArray(response)
        ? response
        : response.results || [];

      setAvailableFeatures(features);

    } catch (error) {
      console.error(
        "Failed to fetch subscription features:",
        error
      );

      console.log("Status:", error.response?.status);
      console.log("Response:", error.response?.data);
      console.log("URL:", error.config?.url);

      alert(
        error.response?.data?.detail ||
        "Failed to load subscription features."
      );
    } finally {
      setLoadingFeatures(false);
    }
  };
  /*
   * Normal form fields
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
   * POST /subscription-features/
   *
   * Create a new feature.
   */
  const addFeature = async () => {
    const name = featureInput.trim();

    if (!name) {
      alert("Enter feature name.");
      return;
    }

    try {
      setAddingFeature(true);

      const response = await createSubscriptionFeature({
        name: name,
        description: featureDescription.trim(),
        is_active: true,
      });

      /*
       * API may return:
       *
       * {
       *   id: 5,
       *   name: "...",
       *   description: "...",
       *   is_active: true
       * }
       */

      const newFeature = response.data || response;

      /*
       * Add newly created feature to local feature list.
       */
      setAvailableFeatures((prev) => [
        ...prev,
        newFeature,
      ]);

      /*
       * Automatically tick the newly created feature.
       */
      setFormData((prev) => ({
        ...prev,
        features: [
          ...prev.features,
          newFeature,
        ],
      }));

      setFeatureInput("");
      setFeatureDescription("");
    } catch (error) {
      console.error("Failed to create feature:", error);

      const errorData = error.response?.data;

      if (errorData) {
        alert(
          errorData.name?.[0] ||
          errorData.detail ||
          "Failed to create feature."
        );
      } else {
        alert("Failed to create feature.");
      }
    } finally {
      setAddingFeature(false);
    }
  };

  /*
   * Tick / untick existing feature
   */
  const toggleFeature = (feature) => {
    setFormData((prev) => {
      const alreadySelected = prev.features.some(
        (item) => item.id === feature.id
      );

      if (alreadySelected) {
        return {
          ...prev,
          features: prev.features.filter(
            (item) => item.id !== feature.id
          ),
        };
      }

      return {
        ...prev,
        features: [
          ...prev.features,
          feature,
        ],
      };
    });
  };

  /*
   * Remove selected feature from plan.
   *
   * This does NOT delete the feature from database.
   * It only removes it from this plan.
   */
  const removeFeature = (featureId) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter(
        (item) => item.id !== featureId
      ),
    }));
  };

  /*
   * Create Plan
   *
   * Only selected feature IDs are sent.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.planName.trim()) {
      alert("Plan Name is required.");
      return;
    }

    if (!formData.tier) {
      alert("Select Tier.");
      return;
    }

    if (
      !formData.employeeLimit ||
      Number(formData.employeeLimit) <= 0
    ) {
      alert("Enter a valid employee limit.");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      alert("Enter Plan Price.");
      return;
    }

    try {
  setSubmitting(true);

  const planType = formData.tier.toLowerCase();

  const selectedFeatureIds = formData.features.map(
    (feature) => feature.id
  );

  const payload = {
    name: formData.planName.trim(),
    plan_type: planType,
    description: formData.description.trim(),
    employee_limit: Number(formData.employeeLimit),
    feature_ids: selectedFeatureIds,
    base_price: formData.price,
    extra_employee_price: formData.extraCharge || "0",
    is_active: true,
  };

  // ============================
  // SAVE TO BACKEND
  // ============================

  if (mode === "edit" && initialData?.id) {
    await updateSubscriptionPlan(
      initialData.id,
      payload
    );
  } else {
    await createSubscriptionPlan(payload);
  }

  // ============================
  // REFRESH PARENT TABLE
  // ============================

  await onSubmit?.();

  onClose();

} catch (error) {
  console.error(
    mode === "edit"
      ? "Failed to update plan:"
      : "Failed to create plan:",
    error
  );

  const errorData = error.response?.data;

  if (errorData) {
    alert(
      errorData.detail ||
      errorData.name?.[0] ||
      errorData.plan_type?.[0] ||
      errorData.employee_limit?.[0] ||
      errorData.base_price?.[0] ||
      errorData.extra_employee_price?.[0] ||
      "Failed to save plan."
    );
  } else {
    alert("Failed to save plan.");
  }

} finally {
  setSubmitting(false);
}
  };

  if (!open) return null;

  /*
   * IDs of currently selected features
   */
  const selectedFeatureIds = formData.features.map(
    (feature) => feature.id
  );

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>
            {mode === "add"
              ? "Add New Plan"
              : "Edit Plan"}
          </Title>

          <CloseButton
            type="button"
            onClick={onClose}
          >
            <IoClose />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>

          {/* PLAN NAME + TIER */}

          <Row>
            <Field>
              <Label>
                Plan Name
                <Required>*</Required>
              </Label>

              <Input
                name="planName"
                value={formData.planName}
                onChange={handleChange}
                placeholder="Enter plan name"
              />
            </Field>

            <Field>
              <Label>
                Tier
                <Required>*</Required>
              </Label>

              <Select
                name="tier"
                value={formData.tier}
                onChange={handleChange}
              >
                <option value="">
                  Select Tier
                </option>

                <option value="basic">
                  Basic
                </option>

                <option value="pro">
                  Pro
                </option>

                <option value="enterprise">
                  Enterprise
                </option>

                <option value="custom">
                  Custom
                </option>
              </Select>
            </Field>
          </Row>

          {/* EMPLOYEE COUNT */}

          <Row>
            <Field>
              <Label>
                Employee Limit
                <Required>*</Required>
              </Label>

              <Input
                type="number"
                name="employeeLimit"
                value={formData.employeeLimit}
                onChange={handleChange}
                placeholder="10"
              />
            </Field>
          </Row>

          {/* PRICE */}

          <Rows>
            <Field>
              <Label>
                Price / Month
                <Required>*</Required>
              </Label>

              <PriceInputWrapper>
                {/* <Currency>₹</Currency> */}

                <Input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1500"
                />
              </PriceInputWrapper>
            </Field>

            <Field>
              <Label>
                Extra Employee Charge
                <Required>*</Required>
              </Label>

              <PriceInputWrapper>
                {/* <Currency>₹</Currency> */}

                <Input
                  type="number"
                  name="extraCharge"
                  value={formData.extraCharge}
                  onChange={handleChange}
                  placeholder="Per Employee"
                />
              </PriceInputWrapper>
            </Field>
          </Rows>

          {/* DESCRIPTION */}

          <Field>
            <Label>Description</Label>

            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter plan description"
              rows={3}
            />
          </Field>

          {/* FEATURES */}

          <FeatureSection>

            <FeatureHeader>
              <Label>
                Features
              </Label>
            </FeatureHeader>

            {/* ADD NEW FEATURE */}

            <Row>
              <Field>
                <Input
                  value={featureInput}
                  onChange={(e) =>
                    setFeatureInput(
                      e.target.value
                    )
                  }
                  placeholder="Enter new feature"
                />
              </Field>

              <AddFeatureButton
                type="button"
                onClick={addFeature}
                disabled={addingFeature}
              >
                <FiPlus />

                {addingFeature
                  ? "Adding..."
                  : "Add"}
              </AddFeatureButton>
            </Row>

            {/* EXISTING FEATURES */}

            <FeatureList>

              {loadingFeatures ? (
                <div>
                  Loading features...
                </div>
              ) : availableFeatures.length === 0 ? (
                <div>
                  No features available.
                </div>
              ) : (
                availableFeatures.map(
                  (feature) => {

                    const isChecked =
                      selectedFeatureIds.includes(
                        feature.id
                      );

                    return (
                      <FeatureItem
                        key={feature.id}
                      >

                        <Checkbox>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              toggleFeature(
                                feature
                              )
                            }
                          />

                          <span>
                            {feature.name}
                          </span>
                        </Checkbox>

                        {isChecked && (
                          <RemoveButton
                            type="button"
                            onClick={() =>
                              removeFeature(
                                feature.id
                              )
                            }
                          >
                            <RiDeleteBin6Line />
                          </RemoveButton>
                        )}

                      </FeatureItem>
                    );
                  }
                )
              )}

            </FeatureList>

          </FeatureSection>

          {/* FOOTER */}

          <Footer>

            <CancelButton
              type="button"
              onClick={onClose}
            >
              Cancel
            </CancelButton>

            <SubmitButton
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : mode === "add"
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