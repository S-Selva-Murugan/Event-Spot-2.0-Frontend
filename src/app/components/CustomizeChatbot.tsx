"use client";
import * as React from "react";
import { Box, Typography, Button } from "@mui/material";

export default function CustomizeChatbot() {
  const [file, setFile] = React.useState<File | null>(null);
  const [dragging, setDragging] = React.useState(false);

  const isPdfFile = (selectedFile: File) =>
    selectedFile.type === "application/pdf" || selectedFile.name.toLowerCase().endsWith(".pdf");

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
    const res = await fetch("http://localhost:3001/api/chatbot/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert(`File uploaded successfully: ${data.filename}`);
      setFile(null); // reset file
    } else {
      alert(`Upload failed: ${data.error}`);
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while uploading the file.");
  }
};

  return (
    <>
      <Typography variant="h6" gutterBottom>Customize Chatbot</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Upload or drag & drop your chatbot PDF file below.
      </Typography>

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
          <Button variant="contained" color="primary" onClick={handleUpload}>Upload File</Button>
        </Box>
      )}
    </>
  );
}
