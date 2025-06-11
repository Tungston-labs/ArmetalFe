import React, { useState } from 'react';
import {
  Container,
  TitleRow,
  Title,
  Form,
  FormGroup,
  Label,
  Input,
  Select,
  ButtonRow,
  CancelButton,
  SaveButton,
  BackArrow
} from '../department/AddDepartment.Styles.js';
import { FaArrowLeft } from 'react-icons/fa';

const AddDepartment = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    head: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container>
      <TitleRow>
        <BackArrow><FaArrowLeft /></BackArrow>
        <Title>Add Department</Title>
      </TitleRow>
      <Form>
        <FormGroup>
          <Label>Department name</Label>
          <Input
            type="text"
            name="name"
            placeholder="Department name"
            value={formData.name}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <Label>Department Code Name</Label>
          <Input
            type="text"
            name="code"
            placeholder="Eg HR"
            value={formData.code}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup fullWidth>
          <Label>Department head</Label>
          <Select name="head" value={formData.head} onChange={handleChange}>
            <option value="">Choose an Employee</option>
            <option value="john">John Marshal</option>
            <option value="jane">Jane Doe</option>
          </Select>
        </FormGroup>

        <ButtonRow>
          <CancelButton>Cancel</CancelButton>
          <SaveButton>Save</SaveButton>
        </ButtonRow>
      </Form>
    </Container>
  );
};

export default AddDepartment;
