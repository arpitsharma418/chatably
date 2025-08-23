import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularIndeterminate() {
  return (
    <>
      <Box className="flex justify-center mt-64">
        <CircularProgress sx={{color: "black"}}/>
      </Box>
    </>
  );
}
