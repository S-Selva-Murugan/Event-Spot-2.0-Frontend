'use client';

import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

// ✅ Dynamically import MapInner (Leaflet runs only on client)
const MapInner = dynamic(() => import('../components/MapInner'), {
  ssr: false,
  loading: () => <Box sx={{ height: 400, bgcolor: '#f0f0f0' }} />,
});

export default function FeaturedMap() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApprovedEvents = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events?isApproved=true`);
        setEvents(res.data);
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedEvents();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', boxShadow: 2 }}>
      <MapInner events={events} />
    </Box>
  );
}

