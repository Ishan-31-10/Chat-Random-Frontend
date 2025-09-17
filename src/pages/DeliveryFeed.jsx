import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function DeliveryFeed(){
  const [notes,setNotes]=useState([]);
  useEffect(()=>{ load(); },[]);
  async function load(){ try{ const res = await api.get('/admin/notifications'); setNotes(res.data || []); }catch(e){ console.error(e); } }
  return (
    <div className="container p-4">
      <h2 className="text-xl font-semibold mb-4">Delivery Feed</h2>
      <div className="grid gap-2">
        {notes.map(n=>(
          <div key={n.id} className="p-3 bg-white rounded border flex justify-between items-center">
            <div>
              <div className="font-medium">{n.payload?.title || 'Notification'}</div>
              <div className="text-sm text-gray-600">{n.payload?.message}</div>
            </div>
            <div>
              <Link to={`/recipients/${n.recipient_id}`} className="px-2 py-1 border rounded">Open</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
