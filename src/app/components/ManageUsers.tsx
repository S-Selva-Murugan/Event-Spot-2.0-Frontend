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
} from "@mui/material";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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

  // Fetch users from API
  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`);
      setUsers(res.data);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.error || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

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
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUser._id}`,
        editFormData
      );
      await fetchUsers(); // Refresh the list
      setEditDialogOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error("Error updating user:", err);
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
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${selectedUser._id}`
      );
      await fetchUsers(); // Refresh the list
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error("Error deleting user:", err);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

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

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Name</TableCell>
              <TableCell sx={{ color: "white" }}>Email</TableCell>
              <TableCell sx={{ color: "white" }}>Role</TableCell>
              <TableCell sx={{ color: "white" }}>Created At</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No users found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name || "N/A"}</TableCell>
                  <TableCell>{user.email}</TableCell>
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
                  <TableCell>
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
