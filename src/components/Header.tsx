import {
  AppBar,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Typography,
  Stack,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useMutation } from "@tanstack/react-query";
import { login, logout } from "../utils/apis";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CircularProgress from "@mui/joy/CircularProgress";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../lib/react-query";
import { useAuth } from "../provider/AuthProvider";

type HeaderProps = {};

export const Header = (props: HeaderProps) => {
  const navigate = useNavigate();
  const { user, refetchGetMe, isFetchingUserInfo } = useAuth();

  const { mutate: loginMutation } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      refetchGetMe();
      queryClient.refetchQueries(["getPost"]);
    },
    onError: ({ message }) => {
      window.alert(message);
    },
  });

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      window.location.reload();
    },
  });
  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email address"),
    password: Yup.string().required("Password is required").min(6),
  });

  const renderForm = () => {
    return (
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          loginMutation(values);
        }}
        enableReinitialize>
        {({ errors, setFieldValue }) => (
          <Form>
            <Stack direction={"row"} spacing={2}>
              <TextField
                type='email'
                name='email'
                placeholder='email'
                size='small'
                error={!!errors.email}
                helperText={errors.email}
                onChange={(e) => setFieldValue("email", e.target.value)}
              />
              <TextField
                type='password'
                name='password'
                placeholder='password'
                size='small'
                error={!!errors.password}
                helperText={errors.password}
                onChange={(e) => setFieldValue("password", e.target.value)}
              />
              <Button type='submit' variant='outlined'>
                Login/Register
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    );
  };

  const renderUserInfo = () => {
    return (
      <Stack spacing={2} direction='row' alignItems={"center"}>
        <Typography>Welcome {user.email}</Typography>
        <Button onClick={() => navigate("/share")}>Share a movie</Button>
        <Button onClick={() => logoutMutation()}>Logout</Button>
      </Stack>
    );
  };

  console.log(user);

  return (
    <AppBar component='nav'>
      <Toolbar
        sx={{
          minHeight: "100px !important",
          background: "#",
        }}>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          edge='start'
          sx={{ mr: 2 }}
          onClick={() => navigate("/")}>
          <HomeIcon />
        </IconButton>

        <Typography
          variant='h6'
          component='div'
          fontWeight='bold'
          onClick={() => navigate("/")}
          sx={{ flexGrow: 1, cursor: "pointer" }}>
          Funny Movies
        </Typography>
        <Stack
          direction={"row"}
          sx={{
            display: { xs: "none", sm: "block" },
            input: {
              background: "white",
            },
            button: {
              background: "white",
              fontWeight: "bold",
              "&:hover": {
                background: "white",
              },
            },
          }}
          spacing={2}>
          {isFetchingUserInfo ? (
            <CircularProgress variant='soft' />
          ) : (
            <>{!!user?._id ? renderUserInfo() : renderForm()}</>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
