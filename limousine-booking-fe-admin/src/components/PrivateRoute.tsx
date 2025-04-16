import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoadingScreen = () => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="space-x-1 text-cyan-600 text-2xl">
                <span className="inline-block animate-[bounce_1s_infinite]">.</span>
                <span className="inline-block animate-[bounce_1s_infinite_.1s]">.</span>
                <span className="inline-block animate-[bounce_1s_infinite_.2s]">.</span>
            </div>
        </div>
    );
};

const PrivateRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;

    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute; 