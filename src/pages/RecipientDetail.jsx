import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { showSuccess, showError } from '../components/ToastExample';

export default function RecipientDetail(){
  const { id } = useParams();
  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [action, setAction] = useState('accept');
  const [holdHours, setHoldHours] = useState(24);
  const [sourceName, setSourceName] = useState('web_panel');
  const [reason, setReason] = useState('');

  useEffect(()=>{
    if (id) { // Ensure `id` is not undefined before calling load()
      load();
    }
  }, [id]);

  async function load(){
    setLoading(true);
    try{
      const res = await api.get(`/recipients/${id}`);
      setRec(res.data);
    }catch(e){
      console.error(e);
      showError('Failed to load recipient details');
    }
    setLoading(false);
  }

  async function submit(){
    try{
      const body = { action, source_name: sourceName };
      if(action==='hold') body.hold_hours = Number(holdHours);
      if(reason) body.reason = reason;
      
      if (!id) { // Ek final check
        showError('Recipient ID is missing');
        return;
      }
      
      await api.post(`/recipients/${id}/action`, body);
      showSuccess('Action submitted');
      load();
    }catch(e){
      console.error(e);
      showError('Action failed');
    }
  }

  const holdOptions = [
    { label: '1 hour', value: 1 },
    { label: '2 hours', value: 2 },
    { label: '4 hours', value: 4 },
    { label: '1 day', value: 24 },
    { label: '2 days', value: 48 },
  ];

  return (
    <div className="container p-4">
      <Link to="/deliveries" className="text-sm text-blue-600">← Back</Link>
      {loading ? <div>Loading...</div> : (
        <div className="mt-4 max-w-md">
          <h2 className="text-lg font-semibold">{rec?.name}</h2>
          <div className="text-sm text-gray-600">{rec?.email} • {rec?.phone}</div>
          <div className="mt-2">Status: <strong>{rec?.status}</strong></div>

          <div className="bg-white p-3 rounded border mt-4">
            <h3 className="font-semibold mb-2">Take Action</h3>
            <select value={action} onChange={e=>setAction(e.target.value)} className="w-full p-2 border rounded mb-2">
              <option value="accept">Accept</option>
              <option value="reject">Reject</option>
              <option value="hold">Hold</option>
            </select>

            {action==='hold' && (
              <select value={holdHours} onChange={e=>setHoldHours(e.target.value)} className="w-full p-2 border rounded mb-2">
                {holdOptions.map(o=>(
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            )}

            <input placeholder="Source Name" value={sourceName} onChange={e=>setSourceName(e.target.value)} className="w-full p-2 border rounded mb-2" />
            
            {(action==='reject' || action==='hold') && (
              <textarea placeholder="Reason" value={reason} onChange={e=>setReason(e.target.value)} className="w-full p-2 border rounded mb-2" />
            )}

            <div className="flex gap-2">
              <button onClick={submit} className="px-3 py-1 bg-blue-600 text-white rounded">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}