import React from 'react';
import AdminPanelClient from './components/AdminPanelClient';

export const metadata = {
  title: 'Admin Control Center — RealJainism',
  description: 'Manage Jain Tirths, Wallpapers, Ringtones, and Panchang Special Events directly.',
};

export default function AdminPage() {
  return <AdminPanelClient />;
}
