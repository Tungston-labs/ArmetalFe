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
  project,
}) => {
  const navigate = useNavigate();

  // ==========================================
  // CATEGORY
  // ==========================================

  const categoryParts = (
    category || "PROJECT_GENERAL"
  ).split("_");

  const categoryName = categoryParts[0] || "PROJECT";
  const categoryType = categoryParts.slice(1).join("_");

  // ==========================================
  // VIEW MORE
  // ==========================================

  const handleViewMore = () => {
    console.log(
      "clicked, navigating to id:",
      id
    );

    navigate(`/projects/${id}`);
  };

  // ==========================================
  // GET INITIALS
  // ==========================================

  const getInitials = (member) => {
    // ------------------------------------------
    // Current API:
    // employees: [2, 3]
    // ------------------------------------------

    if (typeof member === "number") {
      return `E${member}`;
    }

    // ------------------------------------------
    // If API returns:
    // { id: 2, name: "John Doe" }
    // ------------------------------------------

    if (
      typeof member === "object" &&
      member !== null
    ) {
      const name =
        member.name ||
        member.employee_name ||
        member.full_name ||
        "";

      if (!name) {
        return `E${member.id || ""}`;
      }

      return name
        .trim()
        .split(/\s+/)
        .map((word) =>
          word.charAt(0).toUpperCase()
        )
        .slice(0, 2)
        .join("");
    }

    // ------------------------------------------
    // If API returns:
    // "John Doe"
    // ------------------------------------------

    if (typeof member === "string") {
      return member
        .trim()
        .split(/\s+/)
        .map((word) =>
          word.charAt(0).toUpperCase()
        )
        .slice(0, 2)
        .join("");
    }

    return "E";
  };

  // ==========================================
  // ADD MEMBER
  // ==========================================

  const handleAddMember = (e) => {
    e.stopPropagation();

    if (onAddMember) {
      onAddMember(
        project || {
          id,
          name: title,
        }
      );
    }
  };

  return (
    <Card>

      {/* ====================================== */}
      {/* PROJECT INFORMATION */}
      {/* ====================================== */}

      <div>

        <CardCategory>
          Project Type
          {categoryName && (
            <strong>
              _{categoryName}
            </strong>
          )}
        </CardCategory>

        <CardTitle>
          {title || "Untitled Project"}
        </CardTitle>

        <TagsRow>

          {date && (
            <DateTag>
              {date}
            </DateTag>
          )}

          {status && (
            <StatusTag status={status}>
              {status}
            </StatusTag>
          )}

          {priority && (
            <PriorityTag>
              {priority}
            </PriorityTag>
          )}

        </TagsRow>

      </div>

      {/* ====================================== */}
      {/* BOTTOM */}
      {/* ====================================== */}

      <BottomSection>

        <Members>

          {/* EMPLOYEES */}

          {members
            .slice(0, 4)
            .map((member, index) => (
              <MemberAvatar key={index}>
                {getInitials(member)}
              </MemberAvatar>
            ))}

          {/* REMAINING EMPLOYEES */}

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

        {/* VIEW MORE */}

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