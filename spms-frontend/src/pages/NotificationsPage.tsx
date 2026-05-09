const notifications = [
  'Task "Build Kanban API contract" was assigned to you.',
  'Client Portal MVP moved to Review.',
  'A comment was added on CRM Pipeline Setup.',
  'Workflow seed data created successfully.',
];

export function NotificationsPage() {
  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Updates</p>
          <h2>Notifications</h2>
        </div>
        <button type="button">Mark All Read</button>
      </div>

      <div className="notificationList">
        {notifications.map((notification) => (
          <article className="notificationItem" key={notification}>
            <span />
            <p>{notification}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
