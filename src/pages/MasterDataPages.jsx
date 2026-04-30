import React from 'react';
import { useApp } from '../context/AppContext';
import { useTableState, exportCSV, Field, FieldRow, Empty } from '../components/UI';
import { Eye, Pencil, Trash2, Plus, Download } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];

const StatusBadge = ({ value }) => {
  const v = String(value || '').toLowerCase();
  const cls = v==='active'||v==='published'?'badge-success':v==='draft'||v==='planned'||v==='scheduled'?'badge-gray':v==='pending'?'badge-warning':v==='inactive'?'badge-danger':'badge-info';
  return <span className={`badge ${cls}`}>{value}</span>;
};

const renderCell = (col, row) => {
  const v = row[col.key];
  if (col.key === 'status') return <StatusBadge value={v} />;
  if (col.key === 'override' && typeof v === 'boolean') return v ? <span className="badge badge-warning">Yes</span> : <span className="badge badge-gray">No</span>;
  return v;
};

/**
 * Generic master-data CRUD table — one component drives every master entity.
 */
const MasterTable = ({ title, breadcrumb, subtitle, slice, prefix, columns, fields, module='Backoffice' }) => {
  const { state, addItem, updateItem, removeItem, openModal, openDrawer, openConfirm, toast, writeAudit } = useApp();
  const data = state[slice] || [];
  const { q, setQ, filtered } = useTableState(data, { searchKeys: columns.map(c=>c.key) });

  const openForm = (existing) => openModal({
    title: existing ? `Edit ${breadcrumb} — ${existing.name || existing.id}` : `Add ${breadcrumb}`,
    submitLabel: existing ? 'Save changes' : 'Create',
    body: (
      <>
        {fields.map((row, ri) => (
          <FieldRow key={ri}>
            {row.map(f => (
              <Field key={f.name} label={f.label} name={f.name} type={f.type || 'text'} required={f.required}
                options={f.options} defaultValue={existing?.[f.name] ?? f.default ?? ''} />
            ))}
          </FieldRow>
        ))}
      </>
    ),
    onSubmit: (data) => {
      // Coerce numbers
      fields.flat().forEach(f => { if (f.type === 'number') data[f.name] = Number(data[f.name]) || 0; });
      if (existing) { updateItem(slice, existing.id, data, { action: `${breadcrumb} Updated`, module, target: existing.id }); toast(`${breadcrumb} updated`); }
      else { const c = addItem(slice, data, prefix, { action: `${breadcrumb} Created`, module, detail: data.name }); toast(`${breadcrumb} created · ${c.id}`); }
    },
  });

  const view = (row) => openDrawer({
    title: row.name || row.id, subtitle: `${row.id}`,
    content: (<div className="detail-grid">
      {Object.entries(row).map(([k,v])=>(
        <div key={k}><label>{k}</label><div className="v">{typeof v === 'boolean' ? (v?'Yes':'No') : (v||'—')}</div></div>
      ))}
    </div>),
  });

  const remove = (row) => openConfirm({
    title: `Delete ${breadcrumb}?`, message: `Permanently remove ${row.name || row.id}.`, danger: true, confirmLabel: 'Delete',
    onConfirm: () => { removeItem(slice, row.id, { action: `${breadcrumb} Deleted`, module }); toast(`${row.name || row.id} removed`,'warning'); },
  });

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span>Master Data</span><span>&gt;</span><span className="current">{breadcrumb}</span></div>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <input className="data-search" placeholder={`Search ${title.toLowerCase()}…`} value={q} onChange={e=>setQ(e.target.value)} />
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="btn btn-outline" onClick={()=>{exportCSV(`${slice}_${today()}`, filtered); toast(`Exported ${filtered.length}`); writeAudit('Export', `${title} CSV`, module);}}><Download size={14}/> Export</button>
            <button className="btn btn-primary" onClick={()=>openForm(null)}><Plus size={14}/> Add {breadcrumb}</button>
          </div>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead><tr>{columns.map(c=><th key={c.key}>{c.label}</th>)}<th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {filtered.map(row => (
                <tr key={row.id}>
                  {columns.map((c,i) => <td key={c.key} className={i===0 ? 'muted' : c.bold ? 'bold' : ''}>{renderCell(c, row)}</td>)}
                  <td><div className="action-icons" style={{justifyContent:'flex-end'}}>
                    <span className="action-icon" title="View" onClick={()=>view(row)}><Eye size={16}/></span>
                    <span className="action-icon" title="Edit" onClick={()=>openForm(row)}><Pencil size={16}/></span>
                    <span className="action-icon" title="Delete" onClick={()=>remove(row)}><Trash2 size={16}/></span>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <Empty />}
        </div>
      </div>
    </div>
  );
};

const STATUS_OPTS = ['Active','Inactive','Pending'];

// ─── Developers — custom card grid with brand-coloured logo + cover photo,
//     toggleable to the generic MasterTable for full CRUD. ───
const DevelopersGrid = () => {
  const { state, openDrawer, toast } = useApp();
  const [view, setView] = React.useState('grid');
  const [q, setQ] = React.useState('');

  const developers = state.developers || [];
  const filtered = developers.filter(d =>
    !q || (d.name + ' ' + (d.tagline || '') + ' ' + (d.country || '')).toLowerCase().includes(q.toLowerCase())
  );

  const viewDetail = d => openDrawer({
    title: d.name,
    subtitle: `${d.projects || 0} projects · ${d.country || 'Egypt'}`,
    content: (
      <div style={{display:'flex',flexDirection:'column',gap:18}}>
        {d.image && (
          <div style={{height:180,borderRadius:12,backgroundImage:`url(${d.image})`,backgroundSize:'cover',backgroundPosition:'center'}} />
        )}
        <div style={{display:'flex',gap:14,alignItems:'center'}}>
          <div style={{width:64,height:64,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:20,background:`linear-gradient(135deg, ${d.color1 || '#0f172a'}, ${d.color2 || '#334155'})`}}>{d.initials || d.name?.slice(0,2).toUpperCase()}</div>
          <div>
            <div style={{fontSize:16,fontWeight:800}}>{d.name}</div>
            <div style={{fontSize:12,color:'var(--text-secondary)',marginTop:2}}>{d.tagline || '—'}</div>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,fontSize:13}}>
          <div><div className="drawer-label">Country</div><div className="drawer-value">{d.country || '—'}</div></div>
          <div><div className="drawer-label">Projects</div><div className="drawer-value">{d.projects ?? 0}</div></div>
          <div><div className="drawer-label">Status</div><div className="drawer-value">{d.status || '—'}</div></div>
          <div><div className="drawer-label">Developer ID</div><div className="drawer-value" style={{fontFamily:'monospace',fontSize:11}}>{d.id}</div></div>
        </div>
      </div>
    ),
  });

  if (view === 'table') {
    return (
      <div>
        <div style={{display:'flex',justifyContent:'flex-end',marginBottom:8}}>
          <button className="btn btn-outline btn-sm" onClick={() => setView('grid')}>← Back to Grid view</button>
        </div>
        <MasterTable
          title="Developers" breadcrumb="Developer" subtitle="Manage developer partners — Property"
          slice="developers" prefix="DEV"
          columns={[{key:'id',label:'ID'},{key:'name',label:'Name',bold:true},{key:'country',label:'Country'},{key:'projects',label:'Projects'},{key:'status',label:'Status'}]}
          fields={[[{name:'name',label:'Name',required:true},{name:'country',label:'Country',default:'Egypt'}],[{name:'projects',label:'Projects',type:'number',default:0},{name:'status',label:'Status',type:'select',options:STATUS_OPTS,default:'Active'}],[{name:'tagline',label:'Tagline'},{name:'initials',label:'Logo initials'}]]}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-breadcrumb"><span>Master Data</span><span>&gt;</span><span className="current">Developers</span></div>
        <h1 className="page-title">Developer Partners</h1>
        <p className="page-subtitle">Local alternatives to EGMLS — only used when a developer isn't carried by EGMLS or needs a brokerage-specific override.</p>
      </div>

      <div className="data-panel" style={{marginBottom:18}}>
        <div style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
          <div className="search-box" style={{flex:'1 1 240px'}}>
            <input type="text" placeholder="Search developers…" value={q} onChange={e=>setQ(e.target.value)} />
          </div>
          <button className="btn btn-outline btn-sm" onClick={() => setView('table')}>Table view</button>
          <button className="btn btn-brand btn-sm" onClick={() => { toast?.('Switch to Table view to add or edit developers', 'info'); setView('table'); }}><Plus size={14}/> Add Developer</button>
        </div>
      </div>

      <div className="dev-grid">
        {filtered.map(d => (
          <article key={d.id} className="dev-card" onClick={() => viewDetail(d)}>
            <div className="dev-card-banner" style={d.image ? { backgroundImage: `url(${d.image})` } : undefined}>
              <div className="dev-card-logo" style={{background: `linear-gradient(135deg, ${d.color1 || '#0f172a'}, ${d.color2 || '#334155'})`}}>
                {d.initials || d.name?.split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
              </div>
            </div>
            <div className="dev-card-body">
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
                <div className="dev-card-name">{d.name}</div>
                <StatusBadge value={d.status || 'Active'} />
              </div>
              <div className="dev-card-tag">{d.tagline || `${d.country || 'Egypt'} developer`}</div>
              <div className="dev-card-stats">
                <span className="stat"><strong>{d.projects ?? 0}</strong> projects</span>
                <span style={{color:'var(--border)'}}>·</span>
                <span className="stat">{d.country || 'Egypt'}</span>
                <span style={{marginLeft:'auto',fontSize:11,color:'var(--text-tertiary)'}}>{d.id}</span>
              </div>
            </div>
          </article>
        ))}
        {filtered.length === 0 && (
          <Empty message="No developers match your search." />
        )}
      </div>
    </div>
  );
};

export const Developers = () => <DevelopersGrid />;

export const MasterProjects = () => <MasterTable
  title="Projects" breadcrumb="Project" subtitle="Local alternatives to EGMLS — only used when a project isn't carried by EGMLS or needs a brokerage-specific override."
  slice="projects" prefix="PRJ"
  columns={[{key:'id',label:'ID'},{key:'name',label:'Project',bold:true},{key:'developer',label:'Developer'},{key:'location',label:'Location'},{key:'units',label:'Units'},{key:'status',label:'Status'}]}
  fields={[[{name:'name',label:'Name',required:true},{name:'developer',label:'Developer',required:true}],[{name:'location',label:'Location'},{name:'units',label:'Units',type:'number'}],[{name:'available',label:'Available',type:'number'},{name:'priceFrom',label:'Price From (EGP)',type:'number'}],[{name:'type',label:'Type',type:'select',options:['Compound','Mixed-Use','Resort','Township']},{name:'status',label:'Status',type:'select',options:['Published','Draft'],default:'Draft'}]]}
/>;

export const Compounds = () => <MasterTable
  title="Compounds" breadcrumb="Compound" subtitle="Local alternatives to EGMLS — only used when a compound isn't carried by EGMLS or needs a brokerage-specific override."
  slice="compounds" prefix="CMP"
  columns={[{key:'id',label:'ID'},{key:'name',label:'Compound',bold:true},{key:'developer',label:'Developer'},{key:'city',label:'City'},{key:'projects',label:'Projects'},{key:'status',label:'Status'}]}
  fields={[[{name:'name',label:'Name',required:true},{name:'developer',label:'Developer'}],[{name:'city',label:'City'},{name:'projects',label:'Projects',type:'number'}],[{name:'status',label:'Status',type:'select',options:STATUS_OPTS,default:'Active'}]]}
/>;

export const UnitTypes = () => <MasterTable
  title="Unit Types" breadcrumb="Unit Type" subtitle="Manage unit type classifications — Property"
  slice="unitTypes" prefix="UT"
  columns={[{key:'id',label:'ID'},{key:'name',label:'Type',bold:true},{key:'category',label:'Category'},{key:'status',label:'Status'}]}
  fields={[[{name:'name',label:'Name',required:true},{name:'category',label:'Category',type:'select',options:['Residential','Resort','Commercial']}],[{name:'status',label:'Status',type:'select',options:STATUS_OPTS,default:'Active'}]]}
/>;

export const Cities = () => <MasterTable
  title="Cities" breadcrumb="City" subtitle="Manage city locations — Location"
  slice="cities" prefix="CTY"
  columns={[{key:'id',label:'ID'},{key:'name',label:'City',bold:true},{key:'region',label:'Region'},{key:'areas',label:'Areas'},{key:'status',label:'Status'}]}
  fields={[[{name:'name',label:'Name',required:true},{name:'region',label:'Region'}],[{name:'areas',label:'Areas',type:'number'},{name:'status',label:'Status',type:'select',options:STATUS_OPTS,default:'Active'}]]}
/>;

export const AreasDistricts = () => <MasterTable
  title="Areas / Districts" breadcrumb="Area" subtitle="Manage area subdivisions — Location"
  slice="areas" prefix="AR"
  columns={[{key:'id',label:'ID'},{key:'name',label:'Area',bold:true},{key:'city',label:'City'},{key:'projects',label:'Projects'},{key:'status',label:'Status'}]}
  fields={[[{name:'name',label:'Name',required:true},{name:'city',label:'City'}],[{name:'projects',label:'Projects',type:'number'},{name:'status',label:'Status',type:'select',options:STATUS_OPTS,default:'Active'}]]}
/>;

export const Branches = () => <MasterTable
  title="Branches" breadcrumb="Branch" subtitle="Manage office branches — Organization"
  slice="branches" prefix="BR"
  columns={[{key:'id',label:'ID'},{key:'name',label:'Branch',bold:true},{key:'city',label:'City'},{key:'manager',label:'Manager'},{key:'staff',label:'Staff'},{key:'status',label:'Status'}]}
  fields={[[{name:'name',label:'Name',required:true},{name:'city',label:'City'}],[{name:'manager',label:'Manager'},{name:'staff',label:'Staff Count',type:'number'}],[{name:'status',label:'Status',type:'select',options:['Active','Planned','Inactive'],default:'Active'}]]}
/>;

export const Teams = () => <MasterTable
  title="Teams" breadcrumb="Team" subtitle="Manage sales teams — Organization"
  slice="teams" prefix="TM"
  columns={[{key:'id',label:'ID'},{key:'name',label:'Team',bold:true},{key:'department',label:'Department'},{key:'leader',label:'Leader'},{key:'members',label:'Members'},{key:'status',label:'Status'}]}
  fields={[[{name:'name',label:'Name',required:true},{name:'department',label:'Department',default:'Sales'}],[{name:'leader',label:'Leader'},{name:'members',label:'Members',type:'number'}],[{name:'status',label:'Status',type:'select',options:STATUS_OPTS,default:'Active'}]]}
/>;

export const EmploymentCategories = () => <MasterTable
  title="Employment Categories" breadcrumb="Category" subtitle="Manage employment classifications — Organization"
  slice="employmentCategories" prefix="EC"
  columns={[{key:'id',label:'ID'},{key:'name',label:'Category',bold:true},{key:'desc',label:'Description'},{key:'status',label:'Status'}]}
  fields={[[{name:'name',label:'Name',required:true}],[{name:'desc',label:'Description',type:'textarea'}],[{name:'status',label:'Status',type:'select',options:STATUS_OPTS,default:'Active'}]]}
/>;

export const MasterCommPolicies = () => <MasterTable
  title="Commission Policies" breadcrumb="Policy" subtitle="Manage commission rate policies — Finance & Sales"
  slice="commissionPolicies" prefix="COM" module="Finance"
  columns={[{key:'id',label:'ID'},{key:'developer',label:'Developer',bold:true},{key:'project',label:'Project'},{key:'rate',label:'Rate %'},{key:'override',label:'Override'},{key:'status',label:'Status'}]}
  fields={[[{name:'developer',label:'Developer',required:true},{name:'project',label:'Project',required:true}],[{name:'rate',label:'Rate %',type:'number',default:2.0},{name:'status',label:'Status',type:'select',options:STATUS_OPTS,default:'Active'}]]}
/>;

export const PayoutCycles = () => <MasterTable
  title="Payout Cycles" breadcrumb="Cycle" subtitle="Manage payout schedule cycles — Finance & Sales"
  slice="payoutCycles" prefix="PC" module="Finance"
  columns={[{key:'id',label:'ID'},{key:'name',label:'Cycle',bold:true},{key:'frequency',label:'Frequency'},{key:'nextDate',label:'Next Date'},{key:'status',label:'Status'}]}
  fields={[[{name:'name',label:'Name',required:true},{name:'frequency',label:'Frequency',type:'select',options:['Monthly','Quarterly','Annually']}],[{name:'nextDate',label:'Next Date',type:'date'},{name:'status',label:'Status',type:'select',options:['Active','Scheduled'],default:'Active'}]]}
/>;

export const ExpenseCategories = () => <MasterTable
  title="Expense Categories" breadcrumb="Category" subtitle="Manage expense classifications — Finance & Sales"
  slice="expenseCategories" prefix="EX" module="Finance"
  columns={[{key:'id',label:'ID'},{key:'name',label:'Category',bold:true},{key:'type',label:'Type'},{key:'budget',label:'Budget'},{key:'status',label:'Status'}]}
  fields={[[{name:'name',label:'Name',required:true},{name:'type',label:'Type',type:'select',options:['Fixed','Variable']}],[{name:'budget',label:'Budget'},{name:'status',label:'Status',type:'select',options:STATUS_OPTS,default:'Active'}]]}
/>;

export const LeadSources = () => <MasterTable
  title="Lead Sources" breadcrumb="Source" subtitle="Manage lead sources — Other"
  slice="leadSources" prefix="LS"
  columns={[{key:'id',label:'ID'},{key:'name',label:'Name',bold:true},{key:'status',label:'Status'}]}
  fields={[[{name:'name',label:'Name',required:true},{name:'status',label:'Status',type:'select',options:STATUS_OPTS,default:'Active'}]]}
/>;
