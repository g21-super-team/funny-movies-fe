import CssBaseline from "@mui/material/CssBaseline";
import { Header } from "./components/Header";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/react-query";
import { BrowserRouter } from "react-router-dom";
import { Content } from "./components/Content";
import { AuthProvider } from "./provider/AuthProvider";
import { SocketProvider } from "./provider/SocketProvider";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SnackbarProvider maxSnack={3}>
          <SocketProvider>
            <BrowserRouter>
              <Header />
              <Content />
            </BrowserRouter>
          </SocketProvider>
        </SnackbarProvider>

        <CssBaseline />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
