import Navbar from '../components/layout/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '@/components/Footer';
import Aviso from '../components/layout/warning/Aviso';

export default function AppLayout() {
    return (
        <>
            <Navbar />
            <Aviso />
            <main className="min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}