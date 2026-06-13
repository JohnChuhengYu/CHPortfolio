import { Outlet, Link, useLocation, useNavigation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Zap, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/api/apiClient";
import { useTheme } from "@/hooks/useTheme";

const navLinks = [
    { to: "/", label: "Home" },
    { to: "/projects", label: "Projects" },
    { to: "/daily", label: "Daily" },
    { to: "/devlog", label: "DevLog" },
    { to: "/components", label: "Components" },
];

export function RootLayout() {
    const { pathname } = useLocation();
    const navigation = useNavigation();
    const navigate = useNavigate();
    const { user, isLoggedIn, isAdminModeEnbaled, toggleAdminMode, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const isNavigating = navigation.state === "loading" || navigation.state === "submitting";
    
    const [loginTransition, setLoginTransition] = useState({ active: false, x: 0, y: 0, size: 0 });

    const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        
        // Trigger smooth fade out of the scrollbar colors via CSS variables
        document.documentElement.classList.add("hide-scrollbar");
        // Also hide overflow physically to prevent scrolling after the fade
        setTimeout(() => {
            document.body.style.overflow = "hidden";
        }, 400);

        const rect = e.currentTarget.getBoundingClientRect();
        setLoginTransition({
            active: true,
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            size: Math.max(rect.width, rect.height)
        });

        setTimeout(() => {
            navigate("/login");
            setTimeout(() => {
                setLoginTransition({ active: false, x: 0, y: 0, size: 0 });
            }, 100);
        }, 600);
    };

    const isAdmin = user?.email === "ych0911y@gmail.com" || user?.email === "admin@chportfolio.dev";

    // Route change cleanup & tracking
    useEffect(() => {
        if (pathname !== "/login") {
            // Restore geometry first at 0px width
            document.body.style.overflow = "";
            // Delay class removal so the transition from 0px -> 10px correctly triggers!
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    document.documentElement.classList.remove("hide-scrollbar");
                });
            });
        }

        const sessionKey = `tracked:${pathname} `;
        if (sessionStorage.getItem(sessionKey)) return; // already tracked this path this session
        sessionStorage.setItem(sessionKey, "1");

        // Fire-and-forget — don't block navigation
        apiClient.post("/api/track", { path: pathname }).catch(() => { });
    }, [pathname]);

    return (
        <div className="min-h-screen flex flex-col bg-brutal-bg relative">
            {/* ─── Global Route Loading Bar ─── */}
            <div
                className={`fixed top - 0 left - 0 h - 1.5 bg - brutal - cyan z - [100] transition - all ease - out shadow - [0_2px_10px_rgba(140, 255, 251, 0.5)] ${isNavigating ? "w-2/3 duration-[3000ms] opacity-100" : "w-full duration-300 opacity-0"
                    } `}
            />
            {/* ─── Floating Navbar ─── */}
            <header className="sticky top-4 md:top-8 z-50 mb-8 md:mb-12 px-4 md:px-8 max-w-7xl mx-auto w-full pointer-events-none">
                <div className="bg-brutal-white border-3 md:border-4 border-black dark:border-gray-700 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_#333] h-16 md:h-20 flex items-center justify-between px-3 md:px-6 pointer-events-auto transition-all">
                    {/* Brand */}
                    <Link
                        to="/"
                        className="font-heading font-black text-xl md:text-2xl tracking-tight text-brutal-black
                                   transition-all inline-block hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[3px_3px_0px_0px_#000] dark:hover:shadow-[3px_3px_0px_0px_#333] border-2 border-transparent hover:border-black dark:hover:border-gray-700 px-2 py-1 bg-transparent hover:bg-brutal-yellow hover:text-[#000]"
                    >
                        CH<span className="text-brutal-purple">.</span>
                    </Link>

                    <nav className="flex-1 flex items-center justify-end overflow-hidden ml-2 sm:ml-4">
                        <div className="flex items-center gap-1 md:gap-4 overflow-x-auto py-3 px-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-nowrap w-full justify-start md:justify-end">
                            {navLinks.map(({ to, label }, index) => {
                                const isActive = pathname === to || (to !== "/" && pathname.startsWith(to));
                                return (
                                    <Link
                                        key={to}
                                        to={to}
                                        className={[
                                            "flex-shrink-0 px-4 md:px-5 py-2 font-heading font-semibold text-sm",
                                            "border-2 border-transparent transition-all duration-150 rounded-sm",
                                            "hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] dark:hover:shadow-[4px_4px_0px_0px_#333] active:translate-y-0 active:shadow-none",
                                            "animate-fade-in",
                                            isActive
                                                ? "bg-brutal-yellow text-[#000] border-black brutal-shadow-sm dark:border-gray-700"
                                                : "text-brutal-black hover:bg-brutal-yellow hover:text-[#000] hover:border-black dark:hover:border-gray-700",
                                        ].filter(Boolean).join(" ")}
                                        style={{ animationDelay: `${index * 50} ms`, animationFillMode: "both" }}
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>

                    </nav>

                    <div className="flex items-center gap-2">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`flex-shrink-0 flex items-center justify-center w-10 h-10 border-2 border-black dark:border-gray-700 rounded-full transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none bg-brutal-bg text-brutal-black hover:bg-brutal-yellow hover:text-[#000] ml-2`}
                            aria-label="Toggle dark mode"
                        >
                            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {isLoggedIn && isAdmin && (
                            <button
                                onClick={toggleAdminMode}
                                className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-2 border-2 border-black dark:border-gray-700 font-heading font-black text-xs sm:text-sm uppercase transition-all shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333] hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${isAdminModeEnbaled ? "bg-brutal-pink text-white" : "bg-brutal-white text-brutal-black"
                                    }`}
                            >
                                <Zap className="w-4 h-4" />
                                <span className="hidden sm:inline">{isAdminModeEnbaled ? "GOD MODE ON" : "GOD MODE OFF"}</span>
                                <span className="sm:hidden">{isAdminModeEnbaled ? "ON" : "OFF"}</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* ─── Main Content ─── */}
            <main className="flex-1 flex flex-col items-center w-full">
                <div className={`${pathname === "/devlog" ? "w-full" : "max-w-7xl w-full"} mx-auto pb-16`}>
                    <Outlet />
                </div>
            </main>

            {/* ─── Footer ─── */}
            <footer className="border-t-2 border-black dark:border-gray-700 bg-brutal-bg text-brutal-black mt-auto">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="font-heading font-bold text-xl">
                        CH<span className="text-brutal-yellow">.</span> Portfolio
                    </p>
                    <p className="text-sm text-brutal-muted font-mono">
                        Built with React 19 + .NET 10 · Monash MIT
                    </p>
                    <div className="flex gap-4">
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2 border-2 border-black dark:border-gray-600 font-heading font-bold text-sm
                                       hover:bg-brutal-yellow hover:text-black hover:border-black transition-all"
                        >
                            GitHub
                        </a>
                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2 border-2 border-black dark:border-gray-600 font-heading font-bold text-sm
                                       hover:bg-brutal-cyan hover:text-black hover:border-black transition-all"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>
            </footer>

            {/* ─── Floating User Widget ─── */}
            {pathname !== "/login" && (
                <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex flex-col items-end gap-2">
                    {isLoggedIn ? (
                        <div className="group relative">
                            <div className="bg-brutal-yellow border-4 border-black dark:border-gray-700 p-3 rounded-full cursor-pointer shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all relative after:absolute after:-inset-4 after:content-[''] after:rounded-full text-[#000]">
                                <span className="font-heading font-black text-lg uppercase leading-none block">
                                    {user?.email.substring(0, 2)}
                                </span>
                            </div>

                            {/* Hover Menu */}
                            <div className="absolute bottom-full right-0 mb-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all flex flex-col gap-2 min-w-[120px]">
                                <div className="bg-brutal-white border-4 border-black dark:border-gray-700 p-2 text-center brutal-shadow-sm pointer-events-none">
                                    <p className="font-mono text-xs font-bold truncate max-w-[150px]">{user?.email}</p>
                                </div>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="bg-brutal-pink text-black border-4 border-black dark:border-gray-700 px-4 py-2 font-heading font-black text-sm uppercase text-center shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all w-full"
                                    >
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={() => {
                                        logout();
                                        window.location.href = "/";
                                    }}
                                    className="bg-brutal-red text-white border-4 border-black dark:border-gray-700 px-4 py-2 font-heading font-black text-sm uppercase shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all w-full"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <a
                            href="/login"
                            onClick={handleLoginClick}
                            className="bg-brutal-cyan text-black border-4 border-black dark:border-gray-700 px-6 py-3 rounded-full font-heading font-black text-base uppercase shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333] hover:bg-brutal-pink hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center relative after:absolute after:-inset-4 after:content-[''] after:rounded-full"
                        >
                            LOGIN
                        </a>
                    )}
                </div>
            )}

            {/* ─── Expand Animation Overlay ─── */}
            <AnimatePresence>
                {loginTransition.active && (
                    <motion.div
                        initial={{
                            x: loginTransition.x - loginTransition.size / 2,
                            y: loginTransition.y - loginTransition.size / 2,
                            width: loginTransition.size,
                            height: loginTransition.size,
                            borderRadius: "100%"
                        }}
                        animate={{
                            x: loginTransition.x - 3000,
                            y: loginTransition.y - 3000,
                            width: 6000,
                            height: 6000,
                            borderRadius: "100%"
                        }}
                        transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
                        className="fixed z-[9999] bg-brutal-purple pointer-events-none"
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
