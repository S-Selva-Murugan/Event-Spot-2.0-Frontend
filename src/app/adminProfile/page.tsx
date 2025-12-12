"use client";

import * as React from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import ReviewPopover from "@/app/components/ReviewPopover";

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Example past orders
const pastOrders = [
  {
    id: "ORD001",
    event: "Music Fiesta 2025",
    date: "2025-09-10",
    amount: 499,
    status: "Paid",
    attended: true,
  },
  {
    id: "ORD002",
    event: "Tech Conference 2025",
    date: "2025-08-22",
    amount: 999,
    status: "Paid",
    attended: false,
  },
  {
    id: "ORD003",
    event: "Food Carnival",
    date: "2025-07-05",
    amount: 299,
    status: "Cancelled",
    attended: false,
  },
];

export default function ProfilePage() {
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<string>("");

  const handleChange = (event: React.SyntheticEvent, newValue: number) => setValue(newValue);

  const handleReviewClick = (event: React.MouseEvent<HTMLElement>, eventName: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedEvent(eventName);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setSelectedEvent("");
  };

  return (
    <Box sx={{ width: "100%", mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          width: "85%",
          margin: "0 auto",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{
            backgroundColor: "#f5f5f5",
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
          }}
        >
          <Tab label="Orders" />
          <Tab label="Rewards" />
          <Tab label="Profile" />
        </Tabs>

        {/* Orders Tab */}
        <TabPanel value={value} index={0}>
          <Typography variant="h6" gutterBottom>
            My Orders
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#1976d2" }}>
                <TableRow>
                  <TableCell sx={{ color: "white" }}>Order ID</TableCell>
                  <TableCell sx={{ color: "white" }}>Event</TableCell>
                  <TableCell sx={{ color: "white" }}>Date</TableCell>
                  <TableCell sx={{ color: "white" }}>Amount (₹)</TableCell>
                  <TableCell sx={{ color: "white" }}>Status</TableCell>
                  <TableCell sx={{ color: "white" }}>Review</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pastOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.event}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          color:
                            order.status === "Paid"
                              ? "green"
                              : order.status === "Cancelled"
                              ? "red"
                              : "orange",
                          fontWeight: 600,
                        }}
                      >
                        {order.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {order.attended && order.status === "Paid" ? (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) => handleReviewClick(e, order.event)}
                        >
                          Review
                        </Button>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Review Popover */}
          <ReviewPopover
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            eventName={selectedEvent}
          />
        </TabPanel>

        <TabPanel value={value} index={1}>
          <Typography variant="h6">My Rewards</Typography>
          <Typography variant="body2" color="text.secondary">
            Earn rewards by attending and reviewing events!
          </Typography>
        </TabPanel>

        <TabPanel value={value} index={2}>
          <Typography variant="h6">My Profile</Typography>
          <Typography variant="body2" color="text.secondary">
            Name: John Doe
            <br />
            Email: johndoe@example.com
          </Typography>
        </TabPanel>
      </Paper>
    </Box>
  );
}
