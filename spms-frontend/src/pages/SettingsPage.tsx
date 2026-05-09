const settings = [
  'Users and role assignment',
  'Department management',
  'Workflow states and transitions',
  'Notification preferences',
];

export function SettingsPage() {
  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Administration</p>
          <h2>Settings</h2>
        </div>
      </div>

      <div className="listGrid">
        {settings.map((setting) => (
          <article className="panel settingsTile" key={setting}>
            <h3>{setting}</h3>
            <p className="muted">Configuration screen placeholder for the MVP module.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
