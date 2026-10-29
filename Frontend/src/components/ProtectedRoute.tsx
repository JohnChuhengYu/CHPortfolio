import { type ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isLoggedIn, user } = useAuth();

    const isAdmin = user?.email === "ych0911y@gmail.com" || user?.email === "admin@chportfolio.dev";

    if (!isLoggedIn || !isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
