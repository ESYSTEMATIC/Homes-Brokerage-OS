import { Link } from 'react-router-dom';
import { Home as HomeIcon, ChevronRight } from 'lucide-react';
import React from 'react';

// Marketplace breadcrumb — accepts an array of items, last item is treated
// as the current page (non-clickable, distinct color).
//
// Usage:
//   <Breadcrumb items={[
//     { label: 'Buy', to: '/marketplace/buy' },
//     { label: 'Palm Hills New Cairo' },           // current page
//   ]} />
//
// `items` can omit the leading "Home" — it's always inserted automatically
// with a Home icon for the marketplace landing.
export const Breadcrumb = ({ items = [], homeTo = '/marketplace', homeLabel = 'Home' }) => {
  const trail = [{ label: homeLabel, to: homeTo, icon: HomeIcon }, ...items];
  return (
    <nav aria-label="Breadcrumb" className="pm-bc">
      <ol className="pm-bc-list">
        {trail.map((it, i) => {
          const last = i === trail.length - 1;
          const Ico  = it.icon;
          return (
            <li key={`${it.label}-${i}`} className={`pm-bc-item ${last ? 'current' : ''}`}>
              {last
                ? <span aria-current="page" className="pm-bc-current">{Ico && <Ico size={12}/>}{it.label}</span>
                : (
                  <Link to={it.to || '#'} className="pm-bc-link">
                    {Ico && <Ico size={12}/>}<span>{it.label}</span>
                  </Link>
                )}
              {!last && <ChevronRight size={12} className="pm-bc-sep" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
