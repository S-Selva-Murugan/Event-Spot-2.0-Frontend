'use client';
import * as React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Box,
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { usePathname, useRouter } from 'next/navigation';

const drawerWidthOpen = 240;
const drawerWidthClosed = 60;

interface SidebarProps {
  open: boolean;
  toggleDrawer: () => void;
}

export default function Sidebar({ open, toggleDrawer }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === '/login') return null;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const menuItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { label: 'Logout', icon: <LogoutIcon />, path: '/login' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidthOpen : drawerWidthClosed,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: open ? drawerWidthOpen : drawerWidthClosed,
          boxSizing: 'border-box',
          top: 64,
          overflowX: 'hidden',
          transition: 'width 0.3s',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      {/* Toggle Button */}
      <Box sx={{ display: 'flex', justifyContent: open ? 'flex-end' : 'center', p: 1 }}>
        <IconButton onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Menu Items */}
      <List>
        {menuItems.map((item) => (
          <Tooltip key={item.label} title={item.label} placement="right" disableHoverListener={open}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: '#1976d2',
                },
                '&.Mui-selected': {
                  backgroundColor: 'transparent',
                  color: '#1976d2',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: 'transparent',
                },
              }}
              selected={pathname === item.path}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.label} />}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      <Divider />
    </Drawer>
  );
}
