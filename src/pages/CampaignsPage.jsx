import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { showSuccess, showError } from '../components/ToastExample';

export default function CampaignsPage(){
  const [campaigns,setCampaigns]=useState([]);
  const [loading,setLoading]=useState(true);
  const [showCreate,setShowCreate]=useState(false);
  const [form,setForm]=useState({title:'', message:'', recipientsCsv:''});

  useEffect(()=>{ load(); },[]);
  async function load(){ setLoading(true); try{ const res = await api.get('/campaigns'); setCampaigns(res.data || []); }catch(e){ console.error(e); } setLoading(false); }

  async function create(e){
    e.preventDefault();
    try{
      const res = await api.post('/campaigns', { title: form.title, message: form.message, team_id:1 });
      const campaign = res.data;
      if(form.recipientsCsv.trim()){
        const lines = form.recipientsCsv.trim().split('\n').map(l=>l.split(',').map(s=>s.trim()));
        const recipients = lines.map(([name,email,phone])=>({name,email,phone}));
        await api.post(`/campaigns/${campaign.id}/recipients`, recipients);
      }
      showSuccess('Campaign created');
      setShowCreate(false);
      load();
    }catch(err){
      console.error(err);
      showError('Error creating campaign');
    }
  }

  async function sendCampaign(id){
    try{
      await api.post(`/campaigns/${id}/send`);
      showSuccess('Campaign scheduled');
      load();
    }catch(e){ showError('Send failed'); }
  }

  return (
    <div className="container p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Campaigns</h2>
        <button onClick={()=>setShowCreate(true)} className="px-3 py-1 bg-blue-600 text-white rounded">New</button>
      </div>

      {showCreate && (
        <div className="bg-white p-4 rounded border mb-4">
          <h3 className="font-semibold mb-2">Create Campaign</h3>
          <form onSubmit={create}>
            <input className="w-full p-2 border rounded mb-2" placeholder="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
            <textarea className="w-full p-2 border rounded mb-2" placeholder="Message" value={form.message} onChange={e=>setForm({...form, message:e.target.value})} />
            <textarea className="w-full p-2 border rounded mb-2" placeholder="Recipients CSV (name,email,phone per line)" value={form.recipientsCsv} onChange={e=>setForm({...form, recipientsCsv:e.target.value})} />
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-green-600 text-white rounded">Create</button>
              <button type="button" onClick={()=>setShowCreate(false)} className="px-3 py-1 border rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-3">
        {campaigns.map(c=>(
          <div key={c._id} className="p-3 bg-white rounded border flex justify-between items-center">
            <div>
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm text-gray-600">{c.message}</div>
            </div>
            <div className="flex gap-2">
              <a href={`/campaigns/${c._id}`} className="px-2 py-1 border rounded">Open</a>
              <button onClick={()=>sendCampaign(c._id)} className="px-2 py-1 bg-indigo-600 text-white rounded">Send</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
