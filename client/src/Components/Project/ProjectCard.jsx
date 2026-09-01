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
  // PROJECT TYPE LABEL
  // ==========================================

  const getProjectTypeLabel = (type) => {
    const typeMap = {
      on_site: "On Site",
      onsite: "On Site",
      variant: "Variant",
      bench: "Bench",
    };

    return typeMap[type] || type || "Project";
  };

  // ==========================================
  // STATUS LABEL
  // ==========================================

  const getStatusLabel = (value) => {
    const statusMap = {
      in_progress: "In Progress",
      completed: "Completed",
      on_hold: "On Hold",
      cancelled: "Cancelled",
    };

    return statusMap[value] || value || "";
  };

  // ==========================================
  // VIEW MORE
  // ==========================================

  const handleViewMore = () => {
    console.log("clicked, navigating to id:", id);

    navigate(`/projects/${id}`);
  };

  // ==========================================
  // GET INITIALS
  // ==========================================

  const getInitials = (member) => {
    // API:
    // employees: [2, 3]

    if (typeof member === "number") {
      return `E${member}`;
    }

    // API:
    // { id: 2, name: "John Doe" }

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

    // API:
    // "John Doe"

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

  const projectType = getProjectTypeLabel(category);
  const formattedStatus = getStatusLabel(status);

  return (
    <Card>
      {/* ====================================== */}
      {/* PROJECT INFORMATION */}
      {/* ====================================== */}

      <div>
        <CardCategory>
          Project Type{" "}
          <strong>
           _{projectType}
          </strong>
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

          {formattedStatus && (
            <StatusTag status={status}>
              {formattedStatus}
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