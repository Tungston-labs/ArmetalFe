import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Notifications from "../../Components/homepage/Notifications";

// Mock styled-components/styles
vi.mock("../../Components/homepage/Notifications.styles.js", () => ({
  NotificationWrapper: ({ children }) => (
    <div data-testid="notification-wrapper">{children}</div>
  ),
  NotificationTitle: ({ children }) => <h2>{children}</h2>,
  NotificationItem: ({ children }) => (
    <div data-testid="notification-item">{children}</div>
  ),
  NotificationText: ({ children }) => <span>{children}</span>,
  NotificationTime: ({ children }) => <small>{children}</small>,
  NoNotification: ({ children }) => (
    <div data-testid="no-notification">{children}</div>
  ),
}));

describe("Notifications Component", () => {
  it("renders the Notifications title", () => {
    render(<Notifications items={[]} />);

    expect(
      screen.getByRole("heading", { name: "Notifications" }),
    ).toBeInTheDocument();
  });

  it("renders no notifications message when items is empty", () => {
    render(<Notifications items={[]} />);

    expect(screen.getByText("No notifications available")).toBeInTheDocument();
  });

  it("renders notification items correctly", () => {
    const items = [
      {
        text: "New leave request received",
        time: "10:30 AM",
      },
      {
        text: "Your attendance has been updated",
        time: "11:45 AM",
      },
    ];

    render(<Notifications items={items} />);

    expect(screen.getByText("New leave request received")).toBeInTheDocument();

    expect(screen.getByText("10:30 AM")).toBeInTheDocument();

    expect(
      screen.getByText("Your attendance has been updated"),
    ).toBeInTheDocument();

    expect(screen.getByText("11:45 AM")).toBeInTheDocument();
  });

  it("renders the correct number of notification items", () => {
    const items = [
      { text: "Notification 1", time: "9:00 AM" },
      { text: "Notification 2", time: "10:00 AM" },
      { text: "Notification 3", time: "11:00 AM" },
    ];

    render(<Notifications items={items} />);

    expect(screen.getAllByTestId("notification-item")).toHaveLength(3);
  });

  it("renders notifications in the correct order", () => {
    const items = [
      { text: "First notification", time: "8:00 AM" },
      { text: "Second notification", time: "9:00 AM" },
    ];

    render(<Notifications items={items} />);

    const notifications = screen.getAllByTestId("notification-item");

    expect(notifications[0]).toHaveTextContent("First notification");
    expect(notifications[0]).toHaveTextContent("8:00 AM");

    expect(notifications[1]).toHaveTextContent("Second notification");
    expect(notifications[1]).toHaveTextContent("9:00 AM");
  });

  it("handles undefined items safely", () => {
    render(<Notifications />);

    expect(screen.getByText("No notifications available")).toBeInTheDocument();

    expect(screen.queryAllByTestId("notification-item")).toHaveLength(0);
  });

  it("handles null items safely", () => {
    render(<Notifications items={null} />);

    expect(screen.getByText("No notifications available")).toBeInTheDocument();

    expect(screen.queryAllByTestId("notification-item")).toHaveLength(0);
  });

  it("handles non-array items safely", () => {
    render(<Notifications items="invalid data" />);

    expect(screen.getByText("No notifications available")).toBeInTheDocument();

    expect(screen.queryAllByTestId("notification-item")).toHaveLength(0);
  });

  it("handles an object as items safely", () => {
    render(
      <Notifications
        items={{
          text: "Invalid notification",
          time: "12:00 PM",
        }}
      />,
    );

    expect(screen.getByText("No notifications available")).toBeInTheDocument();
  });

  it("renders a single notification correctly", () => {
    const items = [
      {
        text: "Single notification",
        time: "2:30 PM",
      },
    ];

    render(<Notifications items={items} />);

    expect(screen.getAllByTestId("notification-item")).toHaveLength(1);
    expect(screen.getByText("Single notification")).toBeInTheDocument();
    expect(screen.getByText("2:30 PM")).toBeInTheDocument();
  });

  it("renders notification with empty text and time", () => {
    const items = [
      {
        text: "",
        time: "",
      },
    ];

    render(<Notifications items={items} />);

    expect(screen.getAllByTestId("notification-item")).toHaveLength(1);
  });

  it("renders multiple notifications with different times", () => {
    const items = [
      { text: "Morning notification", time: "8:00 AM" },
      { text: "Afternoon notification", time: "1:00 PM" },
      { text: "Evening notification", time: "6:00 PM" },
    ];

    render(<Notifications items={items} />);

    expect(screen.getByText("Morning notification")).toBeInTheDocument();
    expect(screen.getByText("8:00 AM")).toBeInTheDocument();

    expect(screen.getByText("Afternoon notification")).toBeInTheDocument();
    expect(screen.getByText("1:00 PM")).toBeInTheDocument();

    expect(screen.getByText("Evening notification")).toBeInTheDocument();
    expect(screen.getByText("6:00 PM")).toBeInTheDocument();
  });
});
