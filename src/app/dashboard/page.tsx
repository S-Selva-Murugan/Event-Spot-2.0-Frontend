import AllEvents from "../components/AllEvents"
import FeaturedMap from "../components/FeaturedMap";
import { Box } from "@mui/material";

export default function DashboardPage() {
  return (
    <Box sx={{ padding: 0, height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          width: '100%',
        }}
      >
        {/* Left Half - Map */}
        <Box
          sx={{
            width: '50%',
            height: '100%',
            borderRight: '1px solid #e0e0e0',
            padding: '16px 0 16px 16px',
            boxSizing: 'border-box',
          }}
        >
          <FeaturedMap/>
        </Box>
        
        {/* Right Half - Event Tiles */}
        <Box
          sx={{
            width: '50%',
            height: '100%',
            overflowY: 'auto',
          }}
        >
          <AllEvents/>
        </Box>
      </Box>
    </Box>
  );
}
