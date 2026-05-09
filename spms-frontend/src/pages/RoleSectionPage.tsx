import type { ReactNode } from 'react';

type RoleSectionPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  items?: string[];
  action?: ReactNode;
};

export function RoleSectionPage({ eyebrow, title, description, items = [], action }: RoleSectionPageProps) {
  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
          <p className="muted">{description}</p>
        </div>
        {action}
      </div>

      <div className="listGrid">
        {items.map((item) => (
          <article className="panel settingsTile" key={item}>
            <h3>{item}</h3>
            <p className="muted">Available only for roles with this page permission.</p>
          </article>
        ))}
      </div>
    </section>
  );
}
