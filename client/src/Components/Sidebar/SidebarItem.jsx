import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  MenuItem,
  MenuButton,
  LeftContent,
  Icon,
  Label,
  Arrow,
  SubMenu,
  SubMenuItem,
} from "./Sidebar.styles";
import { GoChevronUp } from "react-icons/go";

const SidebarItem = ({ item, collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const hasChildren = item.children && item.children.length > 0;

  const [open, setOpen] = useState(
    hasChildren &&
      item.children.some((child) =>
        location.pathname.startsWith(child.path)
      )
  );

  const isActive = hasChildren
    ? item.children.some((child) =>
        location.pathname.startsWith(child.path)
      )
    : location.pathname === item.path;

  const handleClick = () => {
    if (hasChildren) {
      setOpen((prev) => !prev);
    } else {
      navigate(item.path);
    }
  };

  return (
    <MenuItem>

      <MenuButton
        onClick={handleClick}
        $active={isActive}
      >
        <LeftContent>

          <Icon>{item.icon}</Icon>

          <Label $collapsed={collapsed}>
            {item.title}
          </Label>

        </LeftContent>

        {hasChildren && !collapsed && (
          <Arrow $open={open}>
            <GoChevronUp />
          </Arrow>
        )}
      </MenuButton>

      {hasChildren && !collapsed && (
        <SubMenu $open={open}>
          {item.children.map((child) => (
            <SubMenuItem
              key={child.path}
              $active={location.pathname === child.path}
              onClick={() => navigate(child.path)}
            >
              {child.title}
            </SubMenuItem>
          ))}
        </SubMenu>
      )}

    </MenuItem>
  );
};

export default SidebarItem;