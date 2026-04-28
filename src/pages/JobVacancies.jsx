import React, { useState } from 'react';
import { JOBS, DEPARTMENTS } from '../data/staticData';
import { Search, Plus, Eye, Edit3, Trash2, MapPin, Briefcase, Filter } from 'lucide-react';

const statusColor = s => {
  if (s === 'Published') return 'badge-success';
  if (s === 'Draft') return 'badge-gray';
  if (s === 'Closed') return 'badge-danger';
  return 'badge-info';
};

export const JobVacancies = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [locationFilter, setLocationFilter] = useState('All Locations');

  const filtered = JOBS.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         j.hiringManager.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || j.status === statusFilter;
    const matchesDept = deptFilter === 'All Departments' || j.department === deptFilter;
    const matchesLoc = locationFilter === 'All Locations' || j.location === locationFilter;
    return matchesSearch && matchesStatus && matchesDept && matchesLoc;
  });

  const uniqueStatuses = JOBS.length > 0 ? [...new Set(JOBS.map(j => j.status))] : ['Published', 'Draft', 'Closed'];
  const uniqueDepts = JOBS.length > 0 ? [...new Set(JOBS.map(j => j.department))] : ['Sales', 'HR', 'Finance'];
  const uniqueLocs = JOBS.length > 0 ? [...new Set(JOBS.map(j => j.location))] : ['New Cairo', '6th October', 'Zayed'];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Job Vacancies</span></div>
        <h1 className="page-title">Job Vacancies</h1>
        <p className="page-subtitle">Standardized vacancy template and careers publish</p>
      </div>
      <div className="data-panel">
        <div className="data-toolbar">
          <div className="data-toolbar-left">
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                className="data-search" 
                placeholder="Search by job title or manager..." 
                style={{ paddingLeft: 44, width: 300 }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <select className="data-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All Statuses</option>
              {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="data-select" value={deptFilter} onChange={e => setDeptFilter(e.target.value)}>
              <option>All Departments</option>
              {uniqueDepts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select className="data-select" value={locationFilter} onChange={e => setLocationFilter(e.target.value)}>
              <option>All Locations</option>
              {uniqueLocs.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => alert('Opening Vacancy Builder Modal...')}>
            <Plus size={18} /> Create Vacancy
          </button>
        </div>
        <div className="data-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Job Title</th>
                <th>Department</th>
                <th>Location</th>
                <th>Applicants</th>
                <th>Headcount</th>
                <th>Hiring Manager</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(j => (
                <tr key={j.id}>
                  <td className="muted">{j.id}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="bold">{j.title}</span>
                      <span className="muted" style={{ fontSize: 11 }}>{j.type} · {j.mode}</span>
                    </div>
                  </td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Briefcase size={14} className="muted"/> {j.department}</div></td>
                  <td><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={14} className="muted"/> {j.location}</div></td>
                  <td className="bold" style={{ color: 'var(--accent)' }}>{j.applicants}</td>
                  <td className="bold">{j.headcount}</td>
                  <td>{j.hiringManager}</td>
                  <td><span className={`badge ${statusColor(j.status)}`}>{j.status}</span></td>
                  <td>
                    <div className="action-icons" style={{ justifyContent: 'flex-end' }}>
                      <span className="action-icon" onClick={() => alert(`Opening Candidate List for ${j.title}`)} title="View Applicants"><Eye size={16} /></span>
                      <span className="action-icon" onClick={() => alert(`Editing vacancy ${j.id}`)} title="Edit Vacancy"><Edit3 size={16} /></span>
                      <span className="action-icon" onClick={() => alert(`Closing vacancy ${j.id}`)} title="Delete Vacancy"><Trash2 size={16} /></span>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    No job vacancies found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
