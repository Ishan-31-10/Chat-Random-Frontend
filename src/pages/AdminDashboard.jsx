import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard(){
  const [campaigns,setCampaigns]=useState([]);
  useEffect(()=>{ load(); },[]);
  async function load(){ try{ const res = await api.get('/admin/campaigns'); setCampaigns(res.data || []); }catch(e){ console.error(e); } }
  return (
    <div className="container p-4">
      <h2 className="text-xl font-semibold mb-4">Admin Dashboard</h2>
      <div className="grid gap-3">
        {campaigns.map(c=>(
          <div key={c._id} className="p-3 bg-white rounded border">
            <div className="font-semibold">{c.title} <span className="text-sm text-gray-600">by {c.created_by}</span></div>
            <div className="text-sm text-gray-700">{c.message}</div>
            <div className="mt-2 text-sm">Recipients: {c.recipients_count || 'N/A'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
