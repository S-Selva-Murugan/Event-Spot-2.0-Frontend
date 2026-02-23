"use client";
import * as React from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";

type Props = {
  searchInput: string;
  setSearchInput: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
  onClearFilters: () => void;
};

const categoryOptions = [
  "Music",
  "Tech",
  "Workshop",
  "Sports",
  "Food",
  "Art",
  "Business",
  "Community",
];

export default function EventsSearchFilter({
  searchInput,
  setSearchInput,
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  onClearFilters,
}: Props) {
  const [filterAnchorEl, setFilterAnchorEl] = React.useState<HTMLElement | null>(null);
  const isFilterOpen = Boolean(filterAnchorEl);
  const [draftCategory, setDraftCategory] = React.useState(category);
  const [draftMinPrice, setDraftMinPrice] = React.useState(minPrice);
  const [draftMaxPrice, setDraftMaxPrice] = React.useState(maxPrice);
  const [draftStartDate, setDraftStartDate] = React.useState(startDate);
  const [draftEndDate, setDraftEndDate] = React.useState(endDate);

  React.useEffect(() => {
    if (isFilterOpen) {
      setDraftCategory(category);
      setDraftMinPrice(minPrice);
      setDraftMaxPrice(maxPrice);
      setDraftStartDate(startDate);
      setDraftEndDate(endDate);
    }
  }, [isFilterOpen, category, minPrice, maxPrice, startDate, endDate]);

  const handleApplyFilters = () => {
    setCategory(draftCategory);
    setMinPrice(draftMinPrice);
    setMaxPrice(draftMaxPrice);
    setStartDate(draftStartDate);
    setEndDate(draftEndDate);
    setFilterAnchorEl(null);
  };

  const handleClearDraft = () => {
    setDraftCategory("");
    setDraftMinPrice("");
    setDraftMaxPrice("");
    setDraftStartDate("");
    setDraftEndDate("");
  };

  const activeFilterCount =
    Number(Boolean(category)) +
    Number(Boolean(minPrice)) +
    Number(Boolean(maxPrice)) +
    Number(Boolean(startDate)) +
    Number(Boolean(endDate));

  return (
    <Box sx={{ flexShrink: 0, px: { xs: 1.2, sm: 1.5, md: 2 }, pt: 1, pb: 1.1, borderBottom: "1px solid rgba(171, 186, 206, 0.9)" }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
          gap: 1,
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          label="Search Events"
          placeholder="Search by name, location, organizer"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.2, fontSize: "0.95rem" } }}
        />

        <Button
          variant="contained"
          onClick={(e) => setFilterAnchorEl(e.currentTarget)}
          startIcon={<FilterListIcon fontSize="small" />}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2.2,
            height: 40,
            px: 2,
            minWidth: 140,
            whiteSpace: "nowrap",
            boxShadow: "none",
            background: "linear-gradient(90deg, #1e67b9 0%, #2f82de 100%)",
            transition: "none",
            "&:hover": {
              background: "linear-gradient(90deg, #1e67b9 0%, #2f82de 100%)",
              boxShadow: "none",
            },
          }}
        >
          Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </Button>
      </Box>

      <Popover
        open={isFilterOpen}
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 2.1,
            width: { xs: 320, sm: 430 },
            borderRadius: 4,
            background: "linear-gradient(180deg, rgba(248,252,255,0.98) 0%, rgba(232,241,251,0.98) 100%)",
            border: "1px solid rgba(179, 196, 219, 0.7)",
            boxShadow: "0 18px 32px rgba(27, 54, 88, 0.22)",
          },
        }}
      >
        <Typography sx={{ mb: 1.5, fontWeight: 800, color: "#19508f", fontSize: "1.1rem" }}>
          Refine Results
        </Typography>
        <Stack spacing={1.3}>
          <FormControl
            size="small"
            fullWidth
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, backgroundColor: "rgba(255,255,255,0.78)" } }}
          >
            <InputLabel>Category</InputLabel>
            <Select value={draftCategory} label="Category" onChange={(e) => setDraftCategory(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              {categoryOptions.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.1 }}>
            <TextField
              size="small"
              type="number"
              label="Min Price"
              value={draftMinPrice}
              onChange={(e) => setDraftMinPrice(e.target.value)}
              inputProps={{ min: 0 }}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, backgroundColor: "rgba(255,255,255,0.78)" } }}
            />
            <TextField
              size="small"
              type="number"
              label="Max Price"
              value={draftMaxPrice}
              onChange={(e) => setDraftMaxPrice(e.target.value)}
              inputProps={{ min: 0 }}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, backgroundColor: "rgba(255,255,255,0.78)" } }}
            />
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.1 }}>
            <TextField
              size="small"
              type="date"
              label="Start Date"
              value={draftStartDate}
              onChange={(e) => setDraftStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, backgroundColor: "rgba(255,255,255,0.78)" } }}
            />
            <TextField
              size="small"
              type="date"
              label="End Date"
              value={draftEndDate}
              onChange={(e) => setDraftEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2.5, backgroundColor: "rgba(255,255,255,0.78)" } }}
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => {
                handleClearDraft();
                onClearFilters();
              }}
              sx={{ textTransform: "none", fontWeight: 700, borderRadius: 2.4, px: 2.2 }}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                borderRadius: 2.4,
                px: 2.2,
                background: "linear-gradient(90deg, #1e67b9 0%, #2f82de 100%)",
                boxShadow: "0 8px 16px rgba(26, 90, 168, 0.35)",
                "&:hover": {
                  background: "linear-gradient(90deg, #1e67b9 0%, #2f82de 100%)",
                },
              }}
            >
              Apply Filters
            </Button>
          </Box>
        </Stack>
      </Popover>
    </Box>
  );
}
