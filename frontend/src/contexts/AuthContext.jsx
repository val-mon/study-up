import { createContext, useContext, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { gql } from '@apollo/client';

const AuthContext = createContext(null);

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export function AuthProvider({ children }) {
  const client = useApolloClient();

  // The JWT lives in an HttpOnly cookie and is NOT accessible here.
  // We only keep the (non-sensitive) user info to drive the UI/auth state.
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  const login = (newUser) => {
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
  };

  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(merged));
    setUser(merged);
  };

  const logout = async () => {
    try {
      await client.mutate({ mutation: LOGOUT }); // clears the HttpOnly cookie server-side
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem('user');
    setUser(null);
    await client.clearStore();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
