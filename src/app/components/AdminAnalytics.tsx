"use client";
import * as React from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";
import { getValidatedAuthHeaders, handleAuthFailure } from "@/utils/authSession";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

type AnalyticsResponse = {
  summary: {
    totalUsers: number;
    totalEvents: number;
    totalBookings: number;
    totalRevenue: number;
    successfulBookings: number;
    upcomingApprovedEvents: number;
  };
  roleBreakdown: {
    admin: number;
    customer: number;
  };
  eventStatus: {
    approved: number;
    pending: number;
    disapproved: number;
  };
  bookingTrend: Array<{
    date: string;
    bookings: number;
    revenue: number;
  }>;
  topEvents: Array<{
    eventId: string;
    eventName: string;
    bookings: number;
    tickets: number;
    revenue: number;
  }>;
  generatedAt: string;
};

const metricLabels = [
  { key: "totalUsers", label: "Total Users" },
  { key: "totalEvents", label: "Total Events" },
  { key: "totalBookings", label: "Total Bookings" },
  { key: "successfulBookings", label: "Successful Bookings" },
  { key: "upcomingApprovedEvents", label: "Upcoming Approved Events" },
  { key: "totalRevenue", label: "Total Revenue" },
] as const;

const shadedCardSx = {
  p: 2,
  borderRadius: 2,
  background: "linear-gradient(180deg, #f0f3f8 0%, #e7ecf3 100%)",
  border: "1px solid #d5dce6",
  boxShadow: "0 2px 8px rgba(26, 54, 93, 0.08)",
};

const pieColors = ["#3b6fa8", "#7c9dc2", "#c2d3e8"];

const tickStyle = {
  fontSize: 12,
};

export default function AdminAnalytics() {
  const [data, setData] = React.useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchAnalytics = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = getValidatedAuthHeaders();
      if (!headers) return;
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
      const usesApiPrefix = /\/api$/i.test(baseUrl);
      const primaryUrl = `${baseUrl}/admin/analytics`;
      const fallbackUrl = usesApiPrefix
        ? `${baseUrl.replace(/\/api$/i, "")}/api/admin/analytics`
        : `${baseUrl}/api/admin/analytics`;

      try {
        const response = await axios.get<AnalyticsResponse>(primaryUrl, { headers });
        setData(response.data);
      } catch (err: any) {
        if (err?.response?.status !== 404) throw err;
        const fallbackResponse = await axios.get<AnalyticsResponse>(fallbackUrl, { headers });
        setData(fallbackResponse.data);
      }
    } catch (err: any) {
      if (handleAuthFailure(err?.response?.status, err?.response?.data)) return;
      setError(err?.response?.data?.error || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="320px">
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <Button variant="contained" onClick={fetchAnalytics}>
          Retry
        </Button>
      </Stack>
    );
  }

  const maxTrendBooking = Math.max(...data.bookingTrend.map((item) => item.bookings), 1);
  const currency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  const chartEventStatus = [
    { name: "Approved", value: data.eventStatus.approved },
    { name: "Pending", value: data.eventStatus.pending },
    { name: "Disapproved", value: data.eventStatus.disapproved },
  ];

  return (
    <Stack spacing={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        flexDirection={{ xs: "column", sm: "row" }}
        gap={1.2}
      >
        <Typography variant="h6">Analytics Dashboard</Typography>
        <Button size="small" variant="outlined" onClick={fetchAnalytics}>
          Refresh
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={2}>
        {metricLabels.map((metric) => {
          const value = data.summary[metric.key];
          const formattedValue =
            metric.key === "totalRevenue" ? currency.format(value as number) : value;

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={metric.key}>
              <Paper sx={shadedCardSx}>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
                <Typography variant="h5" fontWeight={700}>
                  {formattedValue}
                </Typography>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={shadedCardSx}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Event Status
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">Approved: {data.eventStatus.approved}</Typography>
              <Typography variant="body2">Pending: {data.eventStatus.pending}</Typography>
              <Typography variant="body2">Disapproved: {data.eventStatus.disapproved}</Typography>
            </Stack>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={shadedCardSx}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              User Roles
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">Admins: {data.roleBreakdown.admin}</Typography>
              <Typography variant="body2">Customers: {data.roleBreakdown.customer}</Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={shadedCardSx}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Bookings & Revenue Trend (7 Days)
            </Typography>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={data.bookingTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#cad5e5" />
                  <XAxis dataKey="date" tick={tickStyle} />
                  <YAxis yAxisId="left" allowDecimals={false} tick={tickStyle} width={30} />
                  <YAxis yAxisId="right" orientation="right" tick={tickStyle} width={38} />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="bookings"
                    stroke="#3b6fa8"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Bookings"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2e5f95"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Revenue (INR)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={shadedCardSx}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Event Status Share
            </Typography>
            <Box sx={{ width: "100%", height: 280 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={chartEventStatus}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    labelLine={false}
                  >
                    {chartEventStatus.map((entry, index) => (
                      <Cell key={`${entry.name}-${index}`} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={shadedCardSx}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Last 7 Days Booking Trend
        </Typography>
        <Stack spacing={1.2}>
          {data.bookingTrend.map((item) => (
            <Box key={item.date}>
              <Box display="flex" justifyContent="space-between" mb={0.6}>
                <Typography variant="body2">{item.date}</Typography>
                <Typography variant="body2">
                  {item.bookings} bookings / {currency.format(item.revenue)}
                </Typography>
              </Box>
              <Box sx={{ height: 10, bgcolor: "#d9e1ec", borderRadius: 999 }}>
                <Box
                  sx={{
                    height: "100%",
                    width: `${(item.bookings / maxTrendBooking) * 100}%`,
                    bgcolor: "#3b6fa8",
                    borderRadius: 999,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Stack>
      </Paper>

      <Paper sx={shadedCardSx}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          Top Events by Bookings
        </Typography>
        <Box sx={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data.topEvents}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cad5e5" />
              <XAxis dataKey="eventName" hide={data.topEvents.length > 4} tick={tickStyle} />
              <YAxis allowDecimals={false} tick={tickStyle} width={30} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#3b6fa8" radius={[6, 6, 0, 0]} name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <TableContainer
        component={Paper}
        sx={{
          ...shadedCardSx,
          p: 0,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Table sx={{ minWidth: 560 }}>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Top Event</TableCell>
              <TableCell sx={{ color: "white" }}>Bookings</TableCell>
              <TableCell sx={{ color: "white" }}>Tickets Sold</TableCell>
              <TableCell sx={{ color: "white" }}>Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.topEvents.length === 0 ? (
              <TableRow>
                <TableCell align="center" colSpan={4}>
                  No bookings yet
                </TableCell>
              </TableRow>
            ) : (
              data.topEvents.map((item) => (
                <TableRow key={`${item.eventId}-${item.eventName}`}>
                  <TableCell>{item.eventName}</TableCell>
                  <TableCell>{item.bookings}</TableCell>
                  <TableCell>{item.tickets}</TableCell>
                  <TableCell>{currency.format(item.revenue)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="caption" color="text.secondary">
        Last updated: {new Date(data.generatedAt).toLocaleString()}
      </Typography>
    </Stack>
  );
}
