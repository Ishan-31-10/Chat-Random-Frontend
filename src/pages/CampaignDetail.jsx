import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function CampaignDetail(){
  const { id } = useParams();
  const [campaign,setCampaign]=useState(null);
  const [recipients,setRecipients]=useState([]);

  useEffect(()=>{ load(); },[]);
  async function load(){
    try{
      const res = await api.get(`/campaigns/${id}`);
      setCampaign(res.data);
      const recs = await api.get(`/campaigns/${id}/recipients`);
      setRecipients(recs.data || []);
    }catch(e){ console.error(e); }
  }

  return (
    <div className="container p-4">
      <Link to="/campaigns" className="text-sm text-blue-600">← Back</Link>
      {!campaign ? <div>Loading...</div> : (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{campaign.title}</h2>
          <p className="text-sm text-gray-700">{campaign.message}</p>
          <h3 className="mt-4 font-semibold">Recipients</h3>
          <div className="grid gap-2 mt-2">
            {recipients.map(r=>(
              <div key={r.id} className="p-2 bg-white rounded border flex justify-between items-center">
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-sm text-gray-600">{r.email} • {r.phone}</div>
                </div>
                <div className="text-sm">{r.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
