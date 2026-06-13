import { useActionState, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { BrutalInput } from "@/components/ui/BrutalInput";
import { BrutalButton } from "@/components/ui/BrutalButton";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/api/apiClient";
import { useGoogleLogin } from '@react-oauth/google';
import { BrutalBadge } from "@/components/ui/BrutalBadge";
import { useTheme } from "@/hooks/useTheme";
import { AnimatePresence, motion } from "framer-motion";

type LoginState = {
    error: string | null;
    success: boolean;
};

export function AdminLogin() {
    const navigate = useNavigate();
    const { login, isLoggedIn } = useAuth();
    const [googleError, setGoogleError] = useState<string | null>(null);
    const [isExiting, setIsExiting] = useState(false);

    const handleExit = () => {
        setIsExiting(true);
    };

    // Redirect if already logged in via exit animation
    useEffect(() => {
        if (isLoggedIn) {
            handleExit();
        }
    }, [isLoggedIn]);

    const [state, loginAction, isPending] = useActionState(
        async (_prevState: LoginState, formData: FormData): Promise<LoginState> => {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            if (!email || !password) {
                return { error: "BRUH, WE NEED BOTH FIELDS.", success: false };
            }

            try {
                // Real attempt using .NET Identity Login Endpoint
                const response = await apiClient.post("/login", {
                    email,
                    password
                });

                const data = response.data;

                // .NET Identity returns a bearer token upon success
                if (data.accessToken) {
                    login(data.accessToken, email);
                    return { error: null, success: true };
                }

                return { error: "INVALID CREDENTIALS.", success: false };
            } catch (err: any) {
                return { error: "LOGIN FAILED. UNAUTHORIZED.", success: false };
            }
        },
        { error: null, success: false }
    );

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            setGoogleError(null);

            // For implicit flow requesting `token id_token`, the ID token is in `credentialResponse.credential`
            // If `flow: "auth-code"` is used, it returns an auth code.
            // But we actually just want the old standard ID token behavior.
            // We can trick `useGoogleLogin` into standard JWT retrieval by standardizing the flow.
            // Wait, useGoogleLogin doesn't easily return id_token unless `flow: "implicit"` (custom implementation) or `flow: "auth-code"`.
            // ACTUALLY: The officially recommended way to get an ID Token with a custom button in @react-oauth/google
            // is NOT useGoogleLogin (which is for access tokens/auth codes), but to keep the standard <GoogleLogin> 
            // OR use the raw Google Identity Services (GIS) API `google.accounts.id.renderButton` inside a ref.
            //
            // Fortunately, @react-oauth/google DOES support `useGoogleLogin` with `flow: "auth-code"`, but that requires
            // swapping the backend to validate an auth code, which is too much work.
            // Wait, we CAN use `useGoogleOneTapLogin` to trigger the popup, but that's one-tap.
            // Let's use `useGoogleLogin` with standard implicit flow by passing `flow: "implicit"` and `response_type: "id_token"` (if supported, undocumented but works in some versions).

            // Wait, the documentation for `@react-oauth/google` states for custom buttons:
            // "if you need a custom button, use `useGoogleLogin`... it returns an access_token."
            // If you NEED an `credential` (id_token), you MUST use `<GoogleLogin>`.
            // So we need to wrap the invisible `<GoogleLogin>` over our custom button to steal the click,
            // OR we use the standard button but with custom CSS.
            // We can use the GIS API directly via `window.google.accounts.oauth2.initTokenClient`? No, that gives access token.
            // Let's check backend AuthController if it supports UserInfo endpoint.

            // Let's just pass `access_token` to the backend and modify the backend to accept it!

            const res = await apiClient.post("/api/auth/google-login", {
                idToken: credentialResponse.access_token || credentialResponse.credential
            });

            if (res.data && res.data.accessToken) {
                try {
                    const infoRes = await apiClient.get("/manage/info", {
                        headers: { Authorization: `Bearer ${res.data.accessToken}` }
                    });
                    const actualEmail = infoRes.data.email;
                    login(res.data.accessToken, actualEmail);
                } catch (e) {
                    setGoogleError("FAILED TO FETCH USER PROFILE.");
                }
            } else {
                setGoogleError("FAILED TO RETRIEVE TOKEN FROM BACKEND.");
            }
        } catch (error) {
            console.error("Google login failed", error);
            setGoogleError("GOOGLE LOGIN FAILED. UNAUTHORIZED.");
        }
    };

    const runGoogleLogin = useGoogleLogin({
        onSuccess: handleGoogleSuccess,
        onError: () => setGoogleError("GOOGLE LOGIN WAS CANCELED OR FAILED.")
    });

    const { theme, toggleTheme } = useTheme();
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            // Base expected dimensions: Use larger values (e.g. 640x950) so the scale kicks in earlier.
            // Also subtract some padding from window width/height to leave edge gutters.
            const padding = 32;
            const scaleX = (window.innerWidth - padding) / 640;
            const scaleY = (window.innerHeight - padding) / 950;
            const minScale = Math.min(scaleX, scaleY, 1); // Never scale up beyond 1
            setScale(minScale);
        };

        handleResize(); // Initial sizing
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <AnimatePresence onExitComplete={() => navigate("/")}>
            {!isExiting && (
                <motion.div 
                    className="flex items-center justify-center h-[100vh] w-[100vw] bg-brutal-purple fixed top-0 left-0 z-50 overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.4, delay: 0.2 } }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3, ease: "easeIn" } }}
                        transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
                        className="flex items-center justify-center w-full h-full"
                    >
                <div
                    className="w-full max-w-xl bg-brutal-white border-4 border-brutal-border brutal-shadow-lg p-12 relative flex-shrink-0"
                    style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
                >

                {/* Decorative & Interactive Elements */}
                <button
                    onClick={handleExit}
                    className="absolute -top-6 -left-6 w-14 h-14 bg-brutal-yellow border-4 border-brutal-border rounded-full flex items-center justify-center brutal-shadow-sm hover:bg-brutal-white hover:scale-110 transition-all z-10 group text-black dark:hover:text-white"
                    title="Return Home"
                    type="button"
                >
                    <svg className="w-6 h-6 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>
                </button>

                <button
                    onClick={toggleTheme}
                    className="absolute -top-6 -right-6 w-14 h-14 bg-brutal-bg border-4 border-brutal-border rounded-full flex items-center justify-center brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none hover:bg-brutal-yellow hover:text-black transition-all z-10 text-brutal-black"
                    title="Toggle Dark Mode"
                    type="button"
                >
                    {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-brutal-cyan border-4 border-brutal-border pointer-events-none" />

                {/* Header */}
                <div className="mb-10 text-center">
                    <h1 className="font-heading text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">
                        Login
                        <span className="text-brutal-red">!</span>
                    </h1>
                    <p className="text-black bg-brutal-yellow inline-block px-4 py-1 border-2 border-brutal-border font-mono font-bold text-lg md:text-xl transform -rotate-2">
                        AUTHORIZED PERSONNEL ONLY.
                    </p>
                </div>

                {/* Form */}
                <form id="login-form" action={loginAction} className="flex flex-col gap-8">
                    <div className="space-y-6">
                        <BrutalInput
                            id="email"
                            name="email"
                            type="email"
                            label="AUTHORIZATION EMAIL"
                            placeholder="ADMIN@EXAMPLE.COM"
                            required
                        />
                        <BrutalInput
                            id="password"
                            name="password"
                            type="password"
                            label="ACCESS CODE"
                            required
                        />
                    </div>

                    {state.error && (
                        <div className="bg-brutal-red text-white px-6 py-4 border-4 border-brutal-border font-heading font-black text-xl uppercase animate-pulse transform rotate-1">
                            ⚠ {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full mt-4 bg-black text-white px-8 py-6 border-4 border-brutal-border shadow-[8px_8px_0px_0px_var(--theme-yellow)] hover:shadow-[12px_12px_0px_0px_var(--theme-yellow)] hover:-translate-y-1 hover:-translate-x-1 active:shadow-[0px_0px_0px_0px_var(--theme-yellow)] active:translate-y-2 active:translate-x-2 transition-all font-heading font-black text-4xl tracking-widest flex items-center justify-center gap-4 disabled:opacity-50 group"
                    >
                        {isPending ? "VERIFYING..." : (
                            <>
                                ENTER <ArrowRight className="w-10 h-10 group-hover:translate-x-2 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t-4 border-brutal-border"></div>
                        <span className="flex-shrink-0 mx-4 text-brutal-black font-black font-heading text-2xl uppercase">OR</span>
                        <div className="flex-grow border-t-4 border-brutal-border"></div>
                    </div>

                    <BrutalBadge className="bg-brutal-blue font-heading font-black text-xl rotate-1 shadow-none">
                        NO ACCOUNT? REQUEST ACCESS BELOW
                    </BrutalBadge>

                    {googleError && (
                        <div className="bg-brutal-red text-white px-6 py-4 border-4 border-brutal-border font-heading font-black text-xl uppercase animate-pulse transform -rotate-1">
                            ⚠ {googleError}
                        </div>
                    )}

                    <div className="flex justify-center mt-2">
                        <BrutalButton
                            type="button"
                            variant="primary"
                            className="w-full flex items-center justify-center gap-2 sm:gap-4 bg-brutal-cyan hover:bg-brutal-pink text-black border-4 border-brutal-border px-4 sm:px-8 py-6 font-heading font-black text-lg sm:text-xl lg:text-2xl tracking-widest shadow-[8px_8px_0px_0px_var(--theme-border)] hover:shadow-[12px_12px_0px_0px_var(--theme-border)] hover:-translate-y-1 hover:-translate-x-1 active:shadow-[0px_0px_0px_0px_var(--theme-border)] active:translate-y-2 active:translate-x-2 transition-all whitespace-nowrap"
                            onClick={() => runGoogleLogin()}
                        >
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.761H12.545z" />
                            </svg>
                            <span>CONTINUE WITH GOOGLE</span>
                        </BrutalButton>
                    </div>
                </form>
            </div>
            </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
