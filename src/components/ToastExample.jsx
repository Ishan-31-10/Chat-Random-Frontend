import React from 'react';
import { toast } from 'react-toastify';

export function showSuccess(msg) { toast.success(msg); }
export function showError(msg) { toast.error(msg); }

export default function ToastExample(){ return null; }
