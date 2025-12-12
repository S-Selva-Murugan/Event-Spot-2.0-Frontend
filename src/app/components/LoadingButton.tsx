"use client";

import React from "react";
import { Button, ButtonProps, CircularProgress } from "@mui/material";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  children: React.ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  children,
  disabled = false,
  ...props
}) => {
  return (
    <Button
      disabled={loading || disabled}
      {...props}
      sx={{
        position: "relative",
        minWidth: 100,
        ...props.sx,
      }}
    >
      {loading ? (
        <CircularProgress
          size={20}
          color="inherit"
          sx={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
