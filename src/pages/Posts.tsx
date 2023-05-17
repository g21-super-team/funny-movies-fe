import { Stack, Typography, Divider, Grid, useTheme } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPosts, like, unlike } from "../utils/apis";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ReactPlayer from "react-player/youtube";
import React from "react";
import { useState } from "react";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { queryClient } from "../lib/react-query";
import Pagination from "@mui/material/Pagination";

type Props = {};

export const Posts = (props: Props) => {
  const LIMIT = 10;
  const [page, setPage] = useState(1);
  const theme = useTheme();

  const { data, isFetching } = useQuery({
    queryKey: ["getPost", page],
    initialData: {
      result: [],
    },
    queryFn: () => getPosts({ limit: LIMIT, skip: LIMIT * (page - 1) }),
    onSuccess: () => {},
  });

  const { mutate: likeMutation } = useMutation({
    mutationFn: like,
    onSuccess: (resp) => {
      queryClient.setQueryData(["getPost", page], (oldData: any) => {
        const updatedData = oldData.result.map((post: any) => {
          if (post._id === resp.postId) {
            const unlikeCount =
              !post.reaction_state ||
              post.reaction_state === "idle" ||
              post.unlike_count === 0
                ? post.unlike_count
                : post.unlike_count - 1;

            return {
              ...post,
              like_count: resp.count,
              unlike_count: unlikeCount,
              reaction_state: post.reaction_state === "like" ? "idle" : "like",
            };
          }
          return post;
        });
        return {
          result: updatedData,
          count: oldData.count,
        };
      });
    },
    onError: ({ message }) => {
      window.alert(message);
    },
  });

  const { mutate: unlikeMutation } = useMutation({
    mutationFn: unlike,
    onSuccess: (resp) => {
      queryClient.setQueryData(["getPost", page], (oldData: any) => {
        const updatedData = oldData.result.map((post: any) => {
          if (post._id === resp.postId) {
            const likeCount =
              !post.reaction_state ||
              post.reaction_state === "idle" ||
              post.like_count === 0
                ? post.like_count
                : post.like_count - 1;
            return {
              ...post,
              unlike_count: resp.count,
              like_count: likeCount,
              reaction_state:
                post.reaction_state === "un_like" ? "idle" : "un_like",
            };
          }
          return post;
        });
        return {
          result: updatedData,
          count: oldData.count,
        };
      });
    },
    onError: ({ message }) => {
      window.alert(message);
    },
  });

  const posts = data?.result;
  const [openMovieIds, setOpenMovieIds] = useState([]);

  return (
    <Stack sx={{ p: 4, overflow: "auto", boxSizing: "border-box" }} spacing={2}>
      {posts.map((post: any) => {
        return (
          <React.Fragment key={post._id}>
            <Stack direction={"row"} spacing={2}>
              <Grid container>
                <Grid item sm={12} md={6}>
                  <Stack
                    sx={{
                      flex: 1,
                      [theme.breakpoints.down("md")]: {
                        alignItems: "center",
                      },
                    }}>
                    {openMovieIds.find((id) => id === post._id) ? (
                      <ReactPlayer width={400} url={post.url} />
                    ) : (
                      <Stack
                        sx={{
                          position: "relative",
                          justifyContent: "center",
                          alignItems: "center",
                        }}>
                        <img
                          src={post.thumbnail}
                          width={400}
                          alt={post.thumbnail}
                        />
                        <PlayCircleOutlineIcon
                          role='presentation'
                          sx={{
                            position: "absolute",
                            color: "white",
                            width: 50,
                            height: 50,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setOpenMovieIds((v) => v.concat(post._id));
                          }}
                        />
                      </Stack>
                    )}
                  </Stack>
                </Grid>
                <Grid item sm={12} md={6}>
                  <Stack
                    key={post._id}
                    sx={{
                      flex: 1,
                      [theme.breakpoints.down("md")]: {
                        alignItems: "center",
                      },
                      my: 2,
                    }}
                    spacing={1}>
                    <Typography sx={{ color: "red", fontWeight: "bold" }}>
                      {post?.title}
                    </Typography>
                    <Typography>Shared by:{post?.sharer?.email}</Typography>

                    <Stack direction={"row"} alignItems='center'>
                      <Stack
                        direction={"row"}
                        sx={{ cursor: "pointer" }}
                        spacing={0.5}
                        onClick={() => {
                          likeMutation(post._id);
                        }}>
                        <Typography>{post?.like_count || ""}</Typography>
                        {post.reaction_state === "like" ? (
                          <ThumbUpAltIcon />
                        ) : (
                          <ThumbUpOffAltIcon />
                        )}
                      </Stack>

                      <Stack
                        direction={"row"}
                        sx={{ ml: 2, cursor: "pointer" }}
                        spacing={0.5}
                        onClick={() => {
                          unlikeMutation(post._id);
                        }}>
                        <Typography>{post?.unlike_count || ""}</Typography>
                        {post.reaction_state === "un_like" ? (
                          <ThumbDownAltIcon />
                        ) : (
                          <ThumbDownOffAltIcon />
                        )}
                      </Stack>
                    </Stack>

                    <Typography>Description:</Typography>
                    <Typography sx={{ whiteSpace: "break-spaces" }}>
                      {post.description}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
            <Divider />
          </React.Fragment>
        );
      })}
      {!isFetching && posts.length ? (
        <Pagination
          count={data.count ? Math.ceil(data.count / LIMIT) : 0}
          color='primary'
          page={page}
          onChange={(_, v) => {
            setPage(v);
          }}
        />
      ) : (
        ""
      )}
    </Stack>
  );
};
