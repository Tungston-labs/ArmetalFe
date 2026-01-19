import styled, { keyframes } from "styled-components";

export const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: flex-end;
  align-items: stretch;
  z-index: 2999;
`;
 export const CalendarIconWrapper = styled.div`
  margin-left: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #304eb0;   // optional, icon color
  &:hover {
    color: #1a3a8a; // darker on hover
  }
`;

export const ModalWrapper = styled.div`
  background: #fff;
  width: 50%;
  height: 100vh;
  border-radius: 0;
  padding: 24px;
  overflow-y: auto;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.2);
  animation: ${slideIn} 0.3s ease-out;
  position: relative;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  h3 {
    margin: 0;
    font-size: 1.2rem;
    color: #3250b5;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      font-size: 1.2rem;
    }

    @media (min-width: 1025px) and (max-width: 1440px) {
      font-size: 1.2rem;
    }
    @media (min-width: 1441px) and (max-width: 1700px) {
      font-size: 1.2rem;
    }

    @media (min-width: 1701px) and (max-width: 2060px) {
      font-size: 1.5rem;
    }
    @media (min-width: 2060px) and (max-width: 2600px) {
      font-size: 2rem;
    }
    @media (min-width: 2561px) and (max-width: 3840px) {
      font-size: 2.2rem;
    }

    @media (min-width: 3841px) {
      font-size: 2.5rem;
    }
  }
`;

export const CloseBtn = styled.button`
  background: #304eb0;
  color: #fff;
  border: none;
  padding: 6px 16px;
  border-radius: 6px;
  cursor: pointer;
  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 12px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 14px;
  }
  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 16px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 18px;
  }
  @media (min-width: 2060px) and (max-width: 2600px) {
    font-size: 22px;
  }
  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 24px;
  }

  @media (min-width: 3841px) {
    font-size: 28px;
  }
`;

export const ModalDate = styled.div`
  display: flex;
  align-items: center;
  font-family: "Krona One", sans-serif;

  .day {
    font-size: 36px;
    font-weight: 700;
    color: #000;
    margin-right: 8px;
    line-height: 1;

    @media (max-width: 768px) {
      font-size: 24px;
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      font-size: 30px;
    }

    @media (min-width: 1025px) and (max-width: 1440px) {
      font-size: 32px;
    }
    @media (min-width: 1441px) and (max-width: 1700px) {
      font-size: 32px;
    }

    @media (min-width: 1701px) and (max-width: 2060px) {
      font-size: 40px;
    }
    @media (min-width: 2060px) and (max-width: 2600px) {
      font-size: 50px;
    }
    @media (min-width: 2561px) and (max-width: 3840px) {
      font-size: 60px;
    }

    @media (min-width: 3841px) {
      font-size: 48px;
    }
  }

  .month-week {
    display: flex;
    flex-direction: column;
    line-height: 1.1;

    .month {
      font-size: 14px;
      color: #111;
      font-weight: 600;
      @media (max-width: 768px) {
        font-size: 12px;
      }

      @media (min-width: 769px) and (max-width: 1024px) {
        font-size: 12px;
      }

      @media (min-width: 1025px) and (max-width: 1440px) {
        font-size: 14px;
      }
      @media (min-width: 1441px) and (max-width: 1700px) {
        font-size: 16px;
      }

      @media (min-width: 1701px) and (max-width: 2060px) {
        font-size: 18px;
      }
      @media (min-width: 2060px) and (max-width: 2600px) {
        font-size: 22px;
      }
      @media (min-width: 2561px) and (max-width: 3840px) {
        font-size: 24px;
      }

      @media (min-width: 3841px) {
        font-size: 28px;
      }
    }

    .weekday {
      font-size: 12px;
      color: #555;
      @media (max-width: 768px) {
        font-size: 12px;
      }

      @media (min-width: 769px) and (max-width: 1024px) {
        font-size: 12px;
      }

      @media (min-width: 1025px) and (max-width: 1440px) {
        font-size: 14px;
      }
      @media (min-width: 1441px) and (max-width: 1700px) {
        font-size: 16px;
      }

      @media (min-width: 1701px) and (max-width: 2060px) {
        font-size: 18px;
      }
      @media (min-width: 2060px) and (max-width: 2600px) {
        font-size: 22px;
      }
      @media (min-width: 2561px) and (max-width: 3840px) {
        font-size: 24px;
      }

      @media (min-width: 3841px) {
        font-size: 28px;
      }
    }
  }
`;

export const Table = styled.div`
  width: 100%;
  margin-top: 16px;
  border-collapse: collapse;
`;

export const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  background: #304eb0;
  color: #fff;
  padding: 8px 12px;
  font-weight: 600;
`;

export const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  padding: 8px 12px;
  margin-top: 20px;
  background: ${({ even }) => (even ? "#E6ECFF" : "#fff")};
  box-shadow: 0px 0px 2.7px 0px #00000047;

`;

export const TableCell = styled.div`
  padding: 4px 8px;
  word-break: break-word;
  font-size: 16px;

  @media (max-width: 768px) {
    font-size: 12px;
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    font-size: 12px;
  }

  @media (min-width: 1025px) and (max-width: 1440px) {
    font-size: 14px;
  }
  @media (min-width: 1441px) and (max-width: 1700px) {
    font-size: 16px;
  }

  @media (min-width: 1701px) and (max-width: 2060px) {
    font-size: 18px;
  }
  @media (min-width: 2060px) and (max-width: 2600px) {
    font-size: 22px;
  }
  @media (min-width: 2561px) and (max-width: 3840px) {
    font-size: 24px;
  }

  @media (min-width: 3841px) {
    font-size: 28px;
  }
`;
