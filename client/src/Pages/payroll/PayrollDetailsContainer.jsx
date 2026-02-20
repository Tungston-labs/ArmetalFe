import React, { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPayrollDetail } from "../../Redux/payrollSlice";
import { printElement } from "../../services/utlis/printPayroll";
import PayrollDetailsView from "./PayrollDetailsView";

const PayrollDetailsContainer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const componentRef = useRef();

  const { payrollDetail, loading, error } = useSelector(
    (state) => state.payroll
  );

  useEffect(() => {
    if (id) dispatch(getPayrollDetail(id));
  }, [dispatch, id]);

  const handlePrint = () => {
    printElement(componentRef.current);
  };

  const handleBack = () => {
    navigate("/payrolldetails");
  };

  return (
    <PayrollDetailsView
      ref={componentRef}
      payrollDetail={payrollDetail}
      loading={loading}
      error={error}
      onPrint={handlePrint}
      onBack={handleBack}
    />
  );
};

export default PayrollDetailsContainer;