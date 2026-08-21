import React from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardCategory,
  CardTitle,
  TagsRow,
  DateTag,
  StatusTag,
  PriorityTag,
  BottomSection,
  Members,
  MemberAvatar,
  MemberCount,
  AddMember,
  ViewMoreButton,
} from "./ProjectCard.styles";

const ProjectCard = ({
  id,
  category,
  title,
  date,
  status,
  priority,
  members = [],
  memberCount = 0,
  onAddMember,
}) => {
  const navigate = useNavigate();

  const [categoryName, categoryType] = (
    category || "PROJECT_GENERAL"
  ).split("_");

  const handleViewMore = () => {
    console.log("clicked, navigating to id:", id);

    navigate(`/projects/${id}`);
  };

  // Get initials from employee name
  const getInitials = (name = "") => {
    return name
      .trim()
      .split(/\s+/)
      .map((word) =>
        word.charAt(0).toUpperCase()
      )
      .slice(0, 2)
      .join("");
  };

  // Add employee
  const handleAddMember = (e) => {
    // Prevent card/view-more click if you later add
    // an onClick to the card itself
    e.stopPropagation();

    if (onAddMember) {
      onAddMember({
        id,
        title,
      });
    }
  };

  return (
    <Card>
      <div>
        <CardCategory>
          {categoryName}
          <strong>_{categoryType}</strong>
        </CardCategory>

        <CardTitle>{title}</CardTitle>

        <TagsRow>
          <DateTag>{date}</DateTag>

          <StatusTag status={status}>
            {status}
          </StatusTag>

          <PriorityTag>
            {priority}
          </PriorityTag>
        </TagsRow>
      </div>

      <BottomSection>
        <Members>
          {members.slice(0, 4).map((member, index) => (
            <MemberAvatar key={index}>
              {getInitials(member)}
            </MemberAvatar>
          ))}

          {memberCount > 4 && (
            <MemberCount>
              +{memberCount - 4}
            </MemberCount>
          )}

          {/* ADD EMPLOYEE */}
          <AddMember
            type="button"
            onClick={handleAddMember}
          >
            +
          </AddMember>
        </Members>

        <ViewMoreButton
          type="button"
          onClick={handleViewMore}
        >
          VIEW MORE
        </ViewMoreButton>
      </BottomSection>
    </Card>
  );
};

export default ProjectCard;