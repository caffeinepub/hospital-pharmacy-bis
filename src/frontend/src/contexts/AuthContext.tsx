import { createContext, useContext, useState } from "react";

export interface User {
  id: string;
  email: string;
  password: string;
  role: "admin" | "viewer";
}

interface AuthContextValue {
  currentUser: User | null;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const DEFAULT_USERS: User[] = [
  { id: "1", email: "admin@pharmacy.com", password: "admin123", role: "admin" },
  {
    id: "2",
    email: "viewer@pharmacy.com",
    password: "viewer123",
    role: "viewer",
  },
];

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users] = useState<User[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  function login(email: string, password: string): boolean {
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === email.trim().toLowerCase() &&
        u.password === password,
    );
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  }

  function logout() {
    setCurrentUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin: currentUser?.role === "admin",
        login,
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
