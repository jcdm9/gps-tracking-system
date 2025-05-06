import { Button } from "@mui/material";
import { SnackbarProvider, useSnackbar } from "notistack";
import { useState } from "react";
import React from "react";

function StackedSnackbar({ message }) {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => enqueueSnackbar("I love snacks.");

  const handleClickVariant = (variant, message) => () => {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant });
  };

  return (
    <React.Fragment>
      <Button onClick={handleClick}>Show snackbar</Button>
      <Button onClick={handleClickVariant("error", message)}>
        Show warning snackbar
      </Button>
    </React.Fragment>
  );
}

export default function IntegrationNotistack({ message }) {
  return (
    <SnackbarProvider maxSnack={3}>
      <StackedSnackbar message={message} />
    </SnackbarProvider>
  );
}
