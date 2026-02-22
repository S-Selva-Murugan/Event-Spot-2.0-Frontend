"use client";
import * as React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  IconButton,
  TablePagination,
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { getValidatedAuthHeaders, handleAuthFailure } from "@/utils/authSession";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  image?: string;
  createdAt?: string;
}

export default function ManageUsers() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [editFormData, setEditFormData] = React.useState({
    name: "",
    email: "",
    role: "customer" as "admin" | "customer",
  });
  const [actionLoading, setActionLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 10;

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = getValidatedAuthHeaders();
      if (!headers) return;
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users?page=${page + 1}&limit=${rowsPerPage}`,
        {
        headers,
      });

      if (Array.isArray(res.data)) {
        setUsers(res.data);
        setTotalUsers(res.data.length);
      } else {
        setUsers(Array.isArray(res.data?.data) ? res.data.data : []);
        setTotalUsers(Number(res.data?.total) || 0);
      }
    } catch (err: any) {
      console.error("Error fetching users:", err);
      if (handleAuthFailure(err?.response?.status, err?.response?.data)) return;
      setError(err.response?.data?.error || "Failed to fetch users");
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Fetch users from API
  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "customer",
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      setError(null);
      const headers = getValidatedAuthHeaders();
      if (!headers) return;
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUser._id}`,
        editFormData,
        { headers }
      );
      await fetchUsers(); // Refresh the list
      setEditDialogOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error("Error updating user:", err);
      if (handleAuthFailure(err?.response?.status, err?.response?.data)) return;
      setError(err.response?.data?.error || "Failed to update user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      setError(null);
      const headers = getValidatedAuthHeaders();
      if (!headers) return;
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUser._id}`,
        { headers }
      );
      await fetchUsers(); // Refresh the list
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error("Error deleting user:", err);
      if (handleAuthFailure(err?.response?.status, err?.response?.data)) return;
      setError(err.response?.data?.error || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCloseDialogs = () => {
    setEditDialogOpen(false);
    setDeleteDialogOpen(false);
    setSelectedUser(null);
    setError(null);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const pagedUsers = users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Manage Users
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
          backgroundColor: "transparent",
          boxShadow: "none",
          border: "none",
        }}
      >
        <Table
          size="small"
          sx={{
            minWidth: { xs: 420, sm: 700 },
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
                Name
              </TableCell>
              <TableCell sx={{ color: "white", display: { xs: "none", sm: "table-cell" }, py: 0.85, fontSize: "0.83rem" }}>
                Email
              </TableCell>
              <TableCell sx={{ color: "white", py: 0.85, fontSize: "0.83rem" }}>Role</TableCell>
              <TableCell sx={{ color: "white", display: { xs: "none", sm: "table-cell" }, py: 0.85, fontSize: "0.83rem" }}>
                Created At
              </TableCell>
              <TableCell sx={{ color: "white", borderTopRightRadius: 12, borderBottomRightRadius: 12, py: 0.85, fontSize: "0.83rem" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                  <CircularProgress size={22} />
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No users found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              pagedUsers.map((user) => (
                <TableRow
                  key={user._id}
                  sx={{
                    "& .MuiTableCell-root": {
                      backgroundColor: "rgba(224, 230, 239, 0.72)",
                      py: 0.68,
                    },
                    "& .MuiTableCell-root:first-of-type": {
                      borderTopLeftRadius: 12,
                      borderBottomLeftRadius: 12,
                    },
                    "& .MuiTableCell-root:last-of-type": {
                      borderTopRightRadius: 12,
                      borderBottomRightRadius: 12,
                    },
                  }}
                >
                  <TableCell>
                    <Typography
                      fontWeight={500}
                      fontSize="0.95rem"
                      sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 180 }}
                      title={user.name || "N/A"}
                    >
                      {user.name || "N/A"}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: { xs: "block", sm: "none" }, mt: 0.5 }}
                    >
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{user.email}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        textTransform: "capitalize",
                        color: user.role === "admin" ? "primary.main" : "text.secondary",
                        fontWeight: user.role === "admin" ? 600 : 400,
                      }}
                    >
                      {user.role}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditClick(user)}
                        disabled={actionLoading}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(user)}
                        disabled={actionLoading}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalUsers}
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

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseDialogs} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={editFormData.name}
              onChange={(e) =>
                setEditFormData({ ...editFormData, name: e.target.value })
              }
            />
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={editFormData.email}
              onChange={(e) =>
                setEditFormData({ ...editFormData, email: e.target.value })
              }
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editFormData.role}
                label="Role"
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    role: e.target.value as "admin" | "customer",
                  })
                }
              >
                <MenuItem value="customer">Customer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDialogs}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user{" "}
            <strong>{selectedUser?.name || selectedUser?.email}</strong>? This
            action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            disabled={actionLoading}
          >
            {actionLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
