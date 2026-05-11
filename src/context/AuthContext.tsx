import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/store/store";
import { selectUser } from "@/store/store";
import type { DecodedUser } from "@/types";

interface AuthContextValue {
  user: DecodedUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectUser) as DecodedUser | null;

  // Redux-persist loads state async → we infer loading
  const loading = user === undefined;

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}