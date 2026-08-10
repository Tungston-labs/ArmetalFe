import styled from "styled-components";

export const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;

  padding: 12px 20px;

  background: #f8fafc;
  border-bottom: 1px solid #edf1f7;
`;

export const DateBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 9px 14px;

  background: #ffffff;
  border: 1px solid #e4e7ec;
  border-radius: 7px;

  font-size: 14px;
  font-weight: 500;
  color: #344054;

  white-space: nowrap;
`;

export const DateSection = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  svg {
    color: #101828;
    flex-shrink: 0;
  }
`;

export const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: #e4e7ec;
`;

export const TimeSection = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;

  svg {
    color: #475467;
    flex-shrink: 0;
  }
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const NotificationButton = styled.button`
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
`;

export const NotificationDot = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;

  width: 8px;
  height: 8px;

  border-radius: 50%;
  background: red;
`;

export const Language = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  font-size: 16px;
  color: #667085;
  cursor: pointer;
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;

  border-radius: 50%;
  object-fit: cover;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Name = styled.span`
  font-weight: 600;
  font-size: 14px;
`;

export const Role = styled.span`
  color: #98a2b3;
  font-size: 12px;
`;

export const SwitchButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 10px 18px;

  background: #f48211;
  color: #fff;

  border: none;
  border-radius: 8px;

  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #ea580c;
  }
`;