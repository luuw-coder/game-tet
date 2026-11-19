import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isFirebaseConfigured } from '../services/firebase';
import * as svc from '../services/authService';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: isFirebaseConfigured ? 'loading' : 'unconfigured', user: null, error: '' });
  useEffect(() => (isFirebaseConfigured ? svc.watchSession(setState) : undefined), []);

  const login = useCallback(async (creds) => {
    const user = await svc.login(creds);
    setState({ status: 'in', user, error: '' });
  }, []);
  const register = useCallback(async (data) => {
    const user = await svc.register(data);
    setState({ status: 'in', user, error: '' });
  }, []);
  const logout = useCallback(() => svc.logout(), []);
  const uid = state.user?.uid;
  const rename = useCallback(async (name) => {
    const displayName = await svc.rename(uid, name);
    setState((s) => ({ ...s, user: { ...s.user, displayName } }));
  }, [uid]);

  const value = useMemo(() => ({ ...state, login, register, logout, rename }), [state, login, register, logout, rename]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
