"use client";
import * as React from "react";
import { Box, Typography, Button, Paper, List, ListItem, ListItemText, Divider, Stack } from "@mui/material";
import { getValidatedAuthHeaders, handleAuthFailure } from "@/utils/authSession";

type UploadedFile = {
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: string;
};

export default function CustomizeChatbot() {
  const [file, setFile] = React.useState<File | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([]);
  const [statusMessage, setStatusMessage] = React.useState("");
  const [loadingFiles, setLoadingFiles] = React.useState(true);
  const [uploading, setUploading] = React.useState(false);

  const backendBaseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:3001";

  const isPdfFile = (selectedFile: File) =>
    selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf");

  const formatSize = (bytes: number) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const parseApiResponse = async (res: Response) => {
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return res.json();
    }

    const text = await res.text();
    return {
      message: res.ok
        ? "Unexpected non-JSON response from server"
        : `Server returned ${res.status}. Check backend route/server restart.`,
      raw: text,
    };
  };

  const fetchUploadedFiles = React.useCallback(async () => {
    try {
      setLoadingFiles(true);
      const headers = getValidatedAuthHeaders();
      if (!headers) return;
      const res = await fetch(`${backendBaseUrl}/api/chatbot/files`, {
        headers,
      });
      const data = await parseApiResponse(res);
      if (!res.ok) {
        if (handleAuthFailure(res.status, data)) return;
        throw new Error(data?.message || data?.error || "Failed to fetch files");
      }
      setUploadedFiles(Array.isArray(data?.files) ? data.files : []);
    } catch (err: any) {
      setStatusMessage(err?.message || "Unable to load uploaded PDF list.");
    } finally {
      setLoadingFiles(false);
    }
  }, [backendBaseUrl]);

  React.useEffect(() => {
    fetchUploadedFiles();
  }, [fetchUploadedFiles]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (!isPdfFile(selectedFile)) {
        alert("Please upload a PDF file only.");
        return;
      }
      setFile(selectedFile);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (!isPdfFile(selectedFile)) {
        alert("Please upload a PDF file only.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setUploading(true);
      setStatusMessage("");
      const headers = getValidatedAuthHeaders();
      if (!headers) return;
      const res = await fetch(`${backendBaseUrl}/api/chatbot/upload`, {
        method: "POST",
        headers,
        body: formData,
      });

      const data = await parseApiResponse(res);
      if (res.ok) {
        const uploadedName = data?.file?.originalname || file.name;
        setStatusMessage(`Uploaded successfully: ${uploadedName}`);
        setFile(null);
        await fetchUploadedFiles();
      } else {
        if (handleAuthFailure(res.status, data)) return;
        setStatusMessage(`Upload failed: ${data?.message || data?.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Something went wrong while uploading the file.");
    } finally {
      setUploading(false);
    }
  };

  const handlePreview = async (uploaded: UploadedFile) => {
    try {
      setStatusMessage("");
      const headers = getValidatedAuthHeaders();
      if (!headers) return;
      const res = await fetch(
        `${backendBaseUrl}/api/chatbot/files/${encodeURIComponent(uploaded.filename)}/preview`,
        { headers }
      );

      if (!res.ok) {
        const data = await parseApiResponse(res);
        if (handleAuthFailure(res.status, data)) return;
        throw new Error(data?.message || "Unable to preview PDF.");
      }

      const blob = await res.blob();
      const previewUrl = URL.createObjectURL(blob);
      window.open(previewUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(previewUrl), 60_000);
    } catch (err: any) {
      setStatusMessage(err?.message || "Unable to preview PDF.");
    }
  };

  const handleDelete = async (uploaded: UploadedFile) => {
    const confirmed = window.confirm(`Delete "${uploaded.originalName}"?`);
    if (!confirmed) return;

    try {
      setStatusMessage("");
      const headers = getValidatedAuthHeaders();
      if (!headers) return;
      const res = await fetch(
        `${backendBaseUrl}/api/chatbot/files/${encodeURIComponent(uploaded.filename)}`,
        {
          method: "DELETE",
          headers,
        }
      );

      const data = await parseApiResponse(res);
      if (!res.ok) {
        if (handleAuthFailure(res.status, data)) return;
        throw new Error(data?.message || "Unable to delete PDF.");
      }

      setStatusMessage(`Deleted: ${uploaded.originalName}`);
      await fetchUploadedFiles();
    } catch (err: any) {
      setStatusMessage(err?.message || "Unable to delete PDF.");
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>Customize Chatbot</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload or drag & drop your chatbot PDF file below.
      </Typography>
      {statusMessage && (
        <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
          {statusMessage}
        </Typography>
      )}

      <Box
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: dragging ? "2px dashed #1976d2" : "2px dashed #ccc",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          cursor: "pointer",
          backgroundColor: dragging ? "#f0f8ff" : "transparent",
          transition: "0.3s"
        }}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <Typography variant="body1" sx={{ mb: 1 }}>
          {file ? <strong>{file.name}</strong> : "Drag & drop a file here or click to upload"}
        </Typography>
        <input
          id="fileInput"
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>

      {file && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Button variant="contained" color="primary" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload File"}
          </Button>
        </Box>
      )}

      <Paper sx={{ mt: 4, p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            Uploaded PDFs
          </Typography>
          <Button size="small" onClick={fetchUploadedFiles} disabled={loadingFiles}>
            Refresh
          </Button>
        </Box>

        {loadingFiles ? (
          <Typography variant="body2" color="text.secondary">
            Loading uploaded files...
          </Typography>
        ) : uploadedFiles.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No PDF uploaded yet for chatbot configuration.
          </Typography>
        ) : (
          <List dense>
            {uploadedFiles.map((uploaded, index) => (
              <React.Fragment key={uploaded.filename}>
                <ListItem disableGutters>
                  <ListItemText
                    primary={uploaded.originalName}
                    secondary={`${formatSize(uploaded.size)} • ${new Date(uploaded.uploadedAt).toLocaleString()}`}
                  />
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" onClick={() => handlePreview(uploaded)}>
                      Preview
                    </Button>
                    <Button size="small" color="error" variant="outlined" onClick={() => handleDelete(uploaded)}>
                      Delete
                    </Button>
                  </Stack>
                </ListItem>
                {index !== uploadedFiles.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </>
  );
}
