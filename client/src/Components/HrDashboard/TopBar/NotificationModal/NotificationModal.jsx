import React, { useState } from "react";

import {
  ModalOverlay,
  NotificationModalContainer,
  Header,
  HeaderLeft,
  BackButton,
  TitleWrapper,
  Title,
  Subtitle,
  HeaderActions,
  ActionButton,
  SearchBox,
  SearchInput,
  NotificationList,
  SectionTitle,
  NotificationItem,
  NotificationIcon,
  Content,
  NotificationTitle,
  Description,
  Time,
  NoResults,
} from "./NotificationModal.styles";

import {
  FiChevronLeft,
  FiSearch,
  FiX,
} from "react-icons/fi";

const notifications = [
  {
    id: 1,
    title: "Lorem Ipsum is simply dummy",
    description: "Learn more about managing account info and activity",
    time: "1 day ago",
    section: "Today",
  },
  {
    id: 2,
    title: "Lorem Ipsum is simply dummy",
    description: "Learn more about managing account info and activity",
    time: "1 day ago",
    section: "Today",
  },
  {
    id: 3,
    title: "Lorem Ipsum is simply dummy",
    description: "Learn more about managing account info and activity",
    time: "1 day ago",
    section: "Today",
  },
  {
    id: 4,
    title: "Lorem Ipsum is simply dummy",
    description: "Learn more about managing account info and activity",
    time: "1 day ago",
    section: "Yesterday",
  },
  {
    id: 5,
    title: "Lorem Ipsum is simply dummy",
    description: "Learn more about managing account info and activity",
    time: "1 day ago",
    section: "Yesterday",
  },
  {
    id: 6,
    title: "Lorem Ipsum is simply dummy",
    description: "Learn more about managing account info and activity",
    time: "1 day ago",
    section: "Yesterday",
  },
  {
    id: 7,
    title: "Lorem Ipsum is simply dummy",
    description: "Learn more about managing account info and activity",
    time: "1 day ago",
    section: "Yesterday",
  },
  {
    id: 8,
    title: "Lorem Ipsum is simply dummy",
    description: "Learn more about managing account info and activity",
    time: "1 day ago",
    section: "Yesterday",
  },
];

const NotificationModal = ({ isOpen, onClose }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  // Search notifications
  const filteredNotifications = notifications.filter((notification) => {
    const searchText = search.toLowerCase();

    return (
      notification.title.toLowerCase().includes(searchText) ||
      notification.description.toLowerCase().includes(searchText)
    );
  });

  const todayNotifications = filteredNotifications.filter(
    (item) => item.section === "Today"
  );

  const yesterdayNotifications = filteredNotifications.filter(
    (item) => item.section === "Yesterday"
  );

  const renderNotification = (notification) => (
    <NotificationItem key={notification.id}>
      <NotificationIcon>
        <span>⬢</span>
      </NotificationIcon>

      <Content>
        <NotificationTitle>
          {notification.title}
        </NotificationTitle>

        <Description>
          {notification.description}
        </Description>
      </Content>

      <Time>{notification.time}</Time>
    </NotificationItem>
  );

  return (
    <ModalOverlay onClick={onClose}>
      <NotificationModalContainer
        onClick={(e) => e.stopPropagation()}
      >
        <Header>
          <HeaderLeft>
            <BackButton onClick={onClose}>
              <FiChevronLeft size={20} />
            </BackButton>

            <TitleWrapper>
              <Title>Notifications</Title>

              <Subtitle>
                You have <strong>2 Notifications</strong> today.
              </Subtitle>
            </TitleWrapper>
          </HeaderLeft>

          <HeaderActions>
            <ActionButton
              onClick={() => {
                setShowSearch((prev) => !prev);
                setSearch("");
              }}
            >
              {showSearch ? (
                <FiX size={15} />
              ) : (
                <FiSearch size={15} />
              )}
            </ActionButton>
          </HeaderActions>
        </Header>

        {/* Search Box */}
        {showSearch && (
          <SearchBox>
            <FiSearch size={16} />

            <SearchInput
              type="text"
              placeholder="Search notifications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />

            {search && (
              <button onClick={() => setSearch("")}>
                <FiX size={14} />
              </button>
            )}
          </SearchBox>
        )}

        <NotificationList>
          {todayNotifications.length > 0 && (
            <>
              <SectionTitle>Today</SectionTitle>

              {todayNotifications.map(renderNotification)}
            </>
          )}

          {yesterdayNotifications.length > 0 && (
            <>
              <SectionTitle>Yesterday</SectionTitle>

              {yesterdayNotifications.map(renderNotification)}
            </>
          )}

          {filteredNotifications.length === 0 && (
            <NoResults>
              No notifications found
            </NoResults>
          )}
        </NotificationList>
      </NotificationModalContainer>
    </ModalOverlay>
  );
};

export default NotificationModal;