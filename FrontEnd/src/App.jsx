import { AuthProvider } from '@/modules/auth';
import AppRoutes from './routes/AppRoutes';

export default function App() {
    return (
        <div>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </div>
    );
}