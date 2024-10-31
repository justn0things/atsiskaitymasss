import React, { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { signin } from "../services/auth.service";
import Alert from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const schema = yup.object({
  email: yup.string().email("Email is invalid.").required("Email is required."),
  password: yup
    .string()
    .required("Please enter a password.")
    .min(12, "Password must contain 12 or more characters.")
    .matches(/[0-9]/, "Password requires a number.")
    .matches(/[a-z]/, "Password requires a lowercase letter.")
    .matches(/[A-Z]/, "Password requires an uppercase letter.")
    .matches(/[^\w]/, "Password requires a special character."),
});

type FormData = yup.InferType<typeof schema>;

export default function SignIn() {
  let navigate: NavigateFunction = useNavigate();
  
  // State for sign in dialog
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const { email, password } = data;

    setMessage("");

    signin(email, password).then(
      () => {
        navigate("/protected-resource");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
      }
    );
  };

  // Functions to handle opening and closing the dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container component="main">
      {/* Navbar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Application
          </Typography>
          <Button color="inherit" onClick={handleClickOpen}>
            Sign In
          </Button>
        </Toolbar>
      </AppBar>

      {/* Sign In Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Sign In</DialogTitle>
        <DialogContent>
          <CssBaseline />
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="email"
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      {...register("email")}
                      required
                      fullWidth
                      label="Email Address"
                      autoFocus
                    />
                  )}
                />
                <Typography variant="inherit" color="error">
                  {errors.email?.message}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Controller
                  control={control}
                  name="password"
                  defaultValue=""
                  render={({ field }) => (
                    <TextField
                      {...field}
                      {...register("password")}
                      required
                      fullWidth
                      label="Password"
                      type="password"
                    />
                  )}
                />
                <Typography variant="inherit" color="error">
                  {errors.password?.message}
                </Typography>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            {message && <Alert severity="error">{message}</Alert>}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
