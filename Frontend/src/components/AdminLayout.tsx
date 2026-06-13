import { Outlet, Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { LayoutDashboard, Rocket, FileText, Code, Palette, Menu, X, Home, MessageSquare, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";

const adminNavItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/projects", label: "Projects", icon: Rocket },
    { to: "/admin/daily", label: "Daily", icon: FileText },
    { to: "/admin/devlog", label: "DevLog", icon: Code },
    { to: "/admin/components", label: "Components", icon: Palette },
    { to: "/admin/comments", label: "Comments", icon: MessageSquare },
];

export function AdminLayout() {
    const { pathname } = useLocation();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="h-screen flex bg-brutal-bg overflow-hidden relative">
            {/* ─── Mobile Sidebar Overlay ─── */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* ─── Sidebar ─── */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50 transform 
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0 transition-transform duration-300 ease-in-out
                w-64 bg-brutal-white border-r-4 border-brutal-border flex flex-col shrink-0
            `}>
                {/* Sidebar Header */}
                <div className="p-6 border-b-3 border-brutal-border flex justify-between items-center">
                    <Link to="/" className="font-heading font-bold text-xl text-brutal-black">
                        CH<span className="text-brutal-yellow">.</span> Admin
                    </Link>
                    <button
                        className="md:hidden text-brutal-black hover:text-brutal-red"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
                    {adminNavItems.map(({ to, label, icon: Icon, exact }) => {
                        const isActive = exact ? pathname === to : pathname.startsWith(to) && pathname !== "/admin";
                        return (
                            <Link
                                key={to}
                                to={to}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={[
                                    "px-4 py-3 font-heading font-semibold text-sm transition-all duration-150 flex items-center gap-3",
                                    isActive
                                        ? "bg-brutal-yellow text-black border-2 border-brutal-border brutal-shadow-sm"
                                        : "text-brutal-black hover:bg-brutal-yellow hover:text-black hover:border-brutal-border hover:brutal-shadow-sm border-2 border-transparent",
                                ].join(" ")}
                            >
                                <Icon className="w-5 h-5" />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t-2 border-brutal-border flex flex-col gap-4">
                    <div className="text-brutal-black text-xs font-mono opacity-60 break-all">
                        {user?.email}
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = "/";
                        }}
                        className="w-full px-4 py-2 font-heading font-bold text-sm
                                   bg-brutal-red text-brutal-white border-2 border-brutal-border
                                   brutal-shadow-sm brutal-interactive"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* ─── Content Area ─── */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Top Bar */}
                <header className="h-16 border-b-4 border-brutal-border bg-brutal-white px-4 md:px-8 flex items-center justify-between shadow-[0_4px_0_0_var(--theme-border)] z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button
                            className="md:hidden p-2 bg-brutal-yellow border-2 border-brutal-border text-black brutal-shadow-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="font-heading font-bold text-base md:text-2xl truncate text-brutal-black">Control Panel</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`flex-shrink-0 flex items-center justify-center w-10 h-10 border-2 border-brutal-border rounded-full transition-all shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none bg-brutal-bg text-brutal-black hover:bg-brutal-yellow hover:text-black`}
                            aria-label="Toggle dark mode"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <Link
                            to="/"
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-brutal-yellow text-black border-2 border-brutal-border font-heading font-black text-xs sm:text-sm uppercase shadow-[4px_4px_0px_0px_var(--theme-border)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shrink-0"
                        >
                            <Home className="w-4 h-4" />
                            <span className="hidden sm:inline">Homepage</span>
                        </Link>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
