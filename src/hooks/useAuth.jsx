import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { isFirebaseConfigured } from '../services/firebase';
import * as svc from '../services/authService';

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: isFirebaseConfigured ? 'loading' : 'unconfigured', user: null, error: '' });
  useEffect(() => (isFirebaseConfigured ? svc.watchSession(setState) : undefined), []);

  const login = useCallback(async (name, code) => {
    const user = await svc.joinWithCode(name, code);
    setState({ status: 'in', user, error: '' });
  }, []);
  const logout = useCallback(() => svc.logout(), []);
  const uid = state.user?.uid;
  const rename = useCallback(async (name) => {
    const displayName = await svc.rename(uid, name);
    setState((s) => ({ ...s, user: { ...s.user, displayName } }));
  }, [uid]);

  const value = useMemo(() => ({ ...state, login, logout, rename }), [state, login, logout, rename]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
