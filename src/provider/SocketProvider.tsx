import React, { useEffect, createContext, useState } from "react";
import { useAuth } from "./AuthProvider";
import { Socket, io } from "socket.io-client";
import { SOCKET_URL } from "../configs";
import { useSnackbar } from "notistack";
import { Stack } from "@mui/material";
import { queryClient } from "../lib/react-query";

type SocketProviderProps = {
  children: React.ReactNode;
};

type SocketContextProps = {
  socket?: Socket;
};

export const SocketContext = createContext({} as SocketContextProps);

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket>();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const sk = io(SOCKET_URL, {
      path: "",
      transports: ["websocket"],
      autoConnect: false,
    });
    setSocket(sk);
    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return () => {};
    if (socket && socket.connected) return () => {};
    socket.connect();

    const onConnect = () => {
      if (user) {
        socket.emit("auth", { token: user.token }, () => {
          setSocket(socket);
        });
      }
    };

    const onShareMovieListener = (data: any) => {
      const { movie } = data;
      if (data?.user && data.user._id !== user._id) {
        queryClient.invalidateQueries(["getPost"]);
        enqueueSnackbar(
          <Stack>
            {data?.user.email} was share new video
            <br />
            {movie.title}
          </Stack>,
          {
            variant: "info",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
            autoHideDuration: 3000,
            hideIconVariant: true,
          }
        );
      }
    };

    socket.on("connect", onConnect);
    socket.on("share:new-movie", onShareMovieListener);
    return () => {
      socket.off("connect", onConnect);
      socket.off("share:new-movie", onShareMovieListener);
    };
  }, [socket, user]);

  return (
    <SocketContext.Provider value={{ socket: socket }}>
      {children}
    </SocketContext.Provider>
  );
};
