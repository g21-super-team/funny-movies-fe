import { Stack } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";
import { Posts } from "../pages/Posts";
import { Share } from "../pages/Share";

type Props = {};

export const Content = (props: Props) => {
  return (
    <Stack
      sx={{
        height: "100%",
        width: 1000,
        background: "white",
        mt: "200px",
        pb: "100px",
      }}>
      <Routes>
        <Route path='/' element={<Posts />} />
        <Route path='/share' element={<Share />} />
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Stack>
  );
};
