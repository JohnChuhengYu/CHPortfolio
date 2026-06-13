import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    isAdminModeEnbaled: boolean;
    login: (token: string, email: string) => void;
    logout: () => void;
    toggleAdminMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAdminModeEnbaled, setIsAdminModeEnabled] = useState(false);

    // Initialize state from localStorage
    useEffect(() => {
        const token = localStorage.getItem("ch_token");
        const email = localStorage.getItem("ch_email");
        if (token && email) {
            setUser({ email });
        }
    }, []);

    const login = (token: string, email: string) => {
        localStorage.setItem("ch_token", token);
        localStorage.setItem("ch_email", email);
        setUser({ email });
    };

    const logout = () => {
        localStorage.removeItem("ch_token");
        localStorage.removeItem("ch_email");
        setUser(null);
        setIsAdminModeEnabled(false);
    };

    const toggleAdminMode = () => {
        setIsAdminModeEnabled((prev) => !prev);
    };

    const isLoggedIn = !!user;

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, isAdminModeEnbaled, login, logout, toggleAdminMode }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
