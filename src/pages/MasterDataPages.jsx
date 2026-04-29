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

export const Developers = () => <MasterTable
  title="Developers" breadcrumb="Developer" subtitle="Manage developer partners — Property"
  slice="developers" prefix="DEV"
  columns={[{key:'id',label:'ID'},{key:'name',label:'Name',bold:true},{key:'country',label:'Country'},{key:'projects',label:'Projects'},{key:'status',label:'Status'}]}
  fields={[[{name:'name',label:'Name',required:true},{name:'country',label:'Country',default:'Egypt'}],[{name:'projects',label:'Projects',type:'number',default:0},{name:'status',label:'Status',type:'select',options:STATUS_OPTS,default:'Active'}]]}
/>;

export const MasterProjects = () => <MasterTable
  title="Projects" breadcrumb="Project" subtitle="Manage project inventory — Property"
  slice="projects" prefix="PRJ"
  columns={[{key:'id',label:'ID'},{key:'name',label:'Project',bold:true},{key:'developer',label:'Developer'},{key:'location',label:'Location'},{key:'units',label:'Units'},{key:'status',label:'Status'}]}
  fields={[[{name:'name',label:'Name',required:true},{name:'developer',label:'Developer',required:true}],[{name:'location',label:'Location'},{name:'units',label:'Units',type:'number'}],[{name:'available',label:'Available',type:'number'},{name:'priceFrom',label:'Price From (EGP)',type:'number'}],[{name:'type',label:'Type',type:'select',options:['Compound','Mixed-Use','Resort','Township']},{name:'status',label:'Status',type:'select',options:['Published','Draft'],default:'Draft'}]]}
/>;

export const Compounds = () => <MasterTable
  title="Compounds" breadcrumb="Compound" subtitle="Manage compound groupings — Property"
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
