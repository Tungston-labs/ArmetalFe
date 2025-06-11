// Multistep.styles.js
import styled from "styled-components";

export const StepsWrapper = styled.div`
  /* Ensure we target AntD’s internal step-icon container */
  .ant-steps-item-icon {
    position: relative; /* allow ::before to be placed behind */
    z-index: 1;
  }

  .ant-steps-item-icon::before {
    content: "";
    position: absolute;
    /* expand 6px on each side of the default circle */
    top: -6px;
    left: -6px;
    width: calc(100% + 12px);
    height: calc(100% + 12px);
    border: 2px solid #6c7b8b; /* ring color (change as needed) */
    border-radius: 50%;
    z-index: -1; /* push behind the default icon circle */
  }
`;
