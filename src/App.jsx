import { AuthProvider } from './hooks/useAuth';
import AppRoutes from './router/routes';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
