import { Box, styled,  } from "@mui/material"; //Button, Icon
import { Breadcrumb, SimpleCard } from "app/components";
import PaginationTable from "./PaginationTable";

const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
  },
}));

const AppTable = () => {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Booking" }]} />
      </Box>

      <SimpleCard title="Booking">
        <PaginationTable />
      </SimpleCard>
    </Container>
  );
};

export default AppTable;
