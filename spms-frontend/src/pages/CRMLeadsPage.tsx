const leads = [
  { company: 'ACME Industries', stage: 'Qualified', value: '₹4.8L', owner: 'Sales' },
  { company: 'Northstar Labs', stage: 'Follow-up', value: '₹2.1L', owner: 'Manager' },
  { company: 'BluePeak Retail', stage: 'Proposal', value: '₹6.3L', owner: 'Sales' },
];

export function CRMLeadsPage() {
  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">CRM</p>
          <h2>Leads</h2>
        </div>
        <button type="button">Add Lead</button>
      </div>

      <div className="listGrid">
        {leads.map((lead) => (
          <article className="panel" key={lead.company}>
            <h3>{lead.company}</h3>
            <p className="muted">{lead.owner}</p>
            <div className="recordMeta">
              <span>{lead.stage}</span>
              <strong>{lead.value}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
