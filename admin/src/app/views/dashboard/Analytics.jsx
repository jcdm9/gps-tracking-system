import { Grid, styled, useTheme } from "@mui/material";
import useAuth from "app/hooks/useAuth";
import { Fragment } from "react";
import { Container, Box, Typography, Button } from "@mui/material";

const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const Analytics = () => {
  const { user } = useAuth();
  return (
    <section>
      <Container maxWidth="md">
        <Box textAlign="center">
          <Typography
            variant="h2"
            component="h2"
            gutterBottom={true}
            sx={{ mt: 20 }}
          >
            <Typography variant="h2" component="span">
              Welcome back{" "}
            </Typography>
            <Typography color="primary" variant="h2" component="span">
              {user.name}
            </Typography>
            <Typography variant="h2" component="span">
              !
            </Typography>
          </Typography>
          <Container maxWidth="sm">
            <Typography
              variant="subtitle1"
              color="textSecondary"
              paragraph={true}
            ></Typography>
          </Container>
        </Box>
      </Container>
    </section>
  );
};

export default Analytics;
