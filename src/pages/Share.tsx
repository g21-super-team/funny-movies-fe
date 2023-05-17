import { Stack, TextField, Button, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { shareMovies } from "../utils/apis";
import * as Yup from "yup";
import { useAuth } from "../provider/AuthProvider";

type Props = {};

export const Share = (props: Props) => {
  const navigate = useNavigate();
  const { user, isFetchingUserInfo } = useAuth();
  if (!isFetchingUserInfo && !user) {
    navigate("/");
  }

  const { mutate: shareMovieMutation } = useMutation({
    mutationFn: shareMovies,
    onSuccess: () => {
      navigate("/");
    },
    onError: ({ message }) => {
      window.alert(message);
    },
  });

  const validationSchema = Yup.object({
    url: Yup.string().required("Url is required").url("Not a url"),
  });

  return (
    <Stack spacing={2} sx={{ p: 2, pt: 5 }}>
      <Typography variant='h5'>Share a youtube movie</Typography>
      <Formik
        initialValues={{ url: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          shareMovieMutation(values.url);
        }}
        enableReinitialize  >
        {({ isValid, dirty, errors, setFieldValue }) => (
          <Form>
            <Stack spacing={2}>
              <TextField
                label='Youtube URL'
                placeholder='https://youtube.com/....'
                error={!!errors.url}
                helperText={errors.url}
                onChange={(e) =>
                  setFieldValue("url", e.target.value)
                }></TextField>
              <Button
                disabled={!isValid || !dirty}
                type='submit'
                variant='contained'>
                Share
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>
    </Stack>
  );
};
