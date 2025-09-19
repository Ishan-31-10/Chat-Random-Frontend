import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { showSuccess, showError } from '../components/ToastExample';

export default function CampaignsPage(){
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', recipients: [], priority: 'normal', recipientType: 'individual' });

  const [allUsers, setAllUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => { 
    load(); 
    loadUsersAndTeams(); 
  }, []);

  async function load(){
    setLoading(true);
    try{
      const res = await api.get('/campaigns');
      setCampaigns(res.data || []);
    }catch(e){
      console.error(e);
    }
    setLoading(false);
  }

  async function loadUsersAndTeams() {
    try {
      const usersRes = await api.get('/auth');
      const teamsRes = await api.get('/teams'); // Assumption: you have a /teams endpoint
      setAllUsers(usersRes.data || []);
      setTeams(teamsRes.data || []);
    } catch (e) {
      console.error('Failed to load users or teams', e);
    }
  }

  async function create(e){
    e.preventDefault();
    try{
      let finalRecipients = [];
      if (form.recipientType === 'individual' || form.recipientType === 'both') {
        finalRecipients = selectedUsers.map(email => ({ email }));
      }
      if (form.recipientType === 'team' || form.recipientType === 'both') {
        const teamUsers = allUsers.filter(u => u.team === selectedTeam);
        const teamRecipients = teamUsers.map(u => ({ email: u.email }));
        finalRecipients = [...new Set([...finalRecipients, ...teamRecipients])];
      }

      const payload = {
        title: form.title,
        message: form.message,
        recipients: finalRecipients,
        priority: form.priority,
        team: selectedTeam || null // Agar team select hui hai to team id bhej do
      };

      await api.post('/campaigns', payload);
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
    }catch(e){
      showError('Send failed');
    }
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

            {/* Recipient selection type */}
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Select Recipients</label>
              <select className="w-full p-2 border rounded" value={form.recipientType} onChange={e=>setForm({...form, recipientType:e.target.value})}>
                <option value="individual">Individual Users</option>
                <option value="team">By Team</option>
                <option value="both">Both</option>
              </select>
            </div>

            {(form.recipientType === 'individual' || form.recipientType === 'both') && (
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Select Individual Users</label>
                <select multiple className="w-full p-2 border rounded h-32" value={selectedUsers} onChange={e => setSelectedUsers(Array.from(e.target.selectedOptions, option => option.value))}>
                  {allUsers.map(u => (
                    <option key={u._id} value={u.email}>{u.username} ({u.email})</option>
                  ))}
                </select>
              </div>
            )}

            {(form.recipientType === 'team' || form.recipientType === 'both') && (
              <div className="mb-2">
                <label className="block text-sm font-medium text-gray-700">Select Team</label>
                <select className="w-full p-2 border rounded" value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)}>
                  <option value="">Select a team</option>
                  {teams.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
            )}
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select className="w-full p-2 border rounded" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">Create</button>
              <button type="button" onClick={() => setShowCreate(false)} className="px-3 py-1 border rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div>Loading...</div>
      ) : (
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
      )}
    </div>
  );
}