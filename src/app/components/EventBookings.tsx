import React from "react";
import {
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { getValidatedAuthHeaders, handleAuthFailure } from "@/utils/authSession";

interface BookingEvent {
  _id: string;
  eventName?: string;
  date?: string;
  location?: string;
}

interface BookingItem {
  _id: string;
  eventId: BookingEvent | null;
  tickets: number;
  totalAmount: number;
  paymentStatus: string;
  createdAt: string;
}

type PagedResponse<T> = {
  data?: T[];
  total?: number;
};

type ErrorPayload = {
  error?: string;
  message?: string;
  details?: string;
};

const rowsPerPage = 10;

export default function EventBookings() {
  const [bookings, setBookings] = React.useState<BookingItem[]>([]);
  const [totalBookings, setTotalBookings] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(0);

  const fetchBookings = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = getValidatedAuthHeaders();
      if (!headers) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings?page=${page + 1}&limit=${rowsPerPage}`,
        { headers }
      );
      const data: BookingItem[] | PagedResponse<BookingItem> = await res.json();

      if (!res.ok) {
        const payload = data as ErrorPayload;
        if (handleAuthFailure(res.status, payload)) return;
        throw new Error(payload.error || payload.message || "Failed to fetch bookings");
      }

      if (Array.isArray(data)) {
        setBookings(data);
        setTotalBookings(data.length);
      } else {
        setBookings(Array.isArray(data?.data) ? data.data : []);
        setTotalBookings(Number(data?.total) || 0);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
      setTotalBookings(0);
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  }, [page]);

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Your Event Bookings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        sx={{
          mt: 1,
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: 2,
          backgroundColor: "transparent",
          boxShadow: "none",
          border: "none",
        }}
      >
        <Table
          size="small"
          sx={{
            minWidth: { xs: 430, sm: 760 },
            borderCollapse: "separate",
            borderSpacing: "0 3px",
            "& .MuiTableCell-root": {
              borderBottom: "none",
              fontSize: "0.86rem",
              py: 0.75,
              lineHeight: 1.2,
            },
          }}
        >
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", borderTopLeftRadius: 12, borderBottomLeftRadius: 12, py: 0.85, fontSize: "0.83rem" }}>
                Event
              </TableCell>
              <TableCell sx={{ color: "white", py: 0.85, fontSize: "0.83rem" }}>
                Tickets
              </TableCell>
              <TableCell sx={{ color: "white", py: 0.85, fontSize: "0.83rem" }}>
                Amount
              </TableCell>
              <TableCell sx={{ color: "white", py: 0.85, fontSize: "0.83rem" }}>
                Payment
              </TableCell>
              <TableCell sx={{ color: "white", display: { xs: "none", sm: "table-cell" }, py: 0.85, fontSize: "0.83rem" }}>
                Booked On
              </TableCell>
              <TableCell sx={{ color: "white", borderTopRightRadius: 12, borderBottomRightRadius: 12, py: 0.85, fontSize: "0.83rem" }}>
                Event Date
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 2 }}>
                  <CircularProgress size={22} />
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    You haven&apos;t booked any events yet.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow
                  key={booking._id}
                  sx={{
                    "& .MuiTableCell-root": {
                      backgroundColor: "rgba(231, 236, 244, 0.88)",
                      py: 0.68,
                      transition: "background-color 0.2s ease, transform 0.2s ease",
                    },
                    "& .MuiTableCell-root:first-of-type": {
                      borderTopLeftRadius: 12,
                      borderBottomLeftRadius: 12,
                    },
                    "& .MuiTableCell-root:last-of-type": {
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                    },
                    "&:hover .MuiTableCell-root": {
                      backgroundColor: "rgba(220, 228, 239, 0.95)",
                    },
                  }}
                >
                  <TableCell>
                    <Typography
                      fontWeight={500}
                      fontSize="0.95rem"
                      sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}
                      title={booking.eventId?.eventName || "Event unavailable"}
                    >
                      {booking.eventId?.eventName || "Event unavailable"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: { xs: "block", sm: "none" }, mt: 0.5 }}
                      title={booking.eventId?.location || ""}
                    >
                      {booking.eventId?.location || "Location not available"}
                    </Typography>
                  </TableCell>

                  <TableCell>{booking.tickets}</TableCell>
                  <TableCell>{`Rs. ${booking.totalAmount}`}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>{booking.paymentStatus}</TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {booking.eventId?.date ? new Date(booking.eventId.date).toLocaleDateString() : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalBookings}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
        sx={{
          "& .MuiTablePagination-toolbar": { minHeight: 30, px: 0.25 },
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-input": { display: "none" },
          "& .MuiTablePagination-displayedRows": { margin: 0, fontSize: "0.75rem" },
          "& .MuiIconButton-root": { p: 0.5 },
        }}
      />
    </>
  );
}
