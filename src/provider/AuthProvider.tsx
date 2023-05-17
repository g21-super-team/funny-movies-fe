import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { getMe } from "../utils/apis";

type AuthContextProps = {
  refetchGetMe: () => void;
  user?: any;
  isFetchingUserInfo: boolean;
};
export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: any) => {
  const {
    data: user = {},
    isFetching: isFetchingUserInfo,
    refetch: refetchGetMe,
  } = useQuery({
    queryKey: ["getMe"],
    queryFn: getMe,
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        isFetchingUserInfo,
        refetchGetMe,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("Components cannot be rendered outside the Auth component");
  }
  return context;
};
