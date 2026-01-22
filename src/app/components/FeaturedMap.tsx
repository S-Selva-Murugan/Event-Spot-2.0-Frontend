'use client';

import dynamic from 'next/dynamic';
import { Box, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';

// ✅ Dynamically import MapInner (Leaflet runs only on client)
const MapInner = dynamic(() => import('../components/MapInner'), {
  ssr: false,
  loading: () => <Box sx={{ height: '100%', bgcolor: '#f0f0f0' }} />,
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
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', width: '100%', borderRadius: 0, overflow: 'hidden' }}>
      <MapInner events={events} />
    </Box>
  );
}

