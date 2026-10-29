import { useState } from "react";
import { createBrowserRouter, RouterProvider, Link } from "react-router";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { RootLayout } from "./components/RootLayout";
import { AdminLayout } from "./components/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "./hooks/useTheme";
import { apiClient } from "./api/apiClient";
import { Trash2 } from "lucide-react";

function BrutalLineChart({ data, isLoading }: { data: any[], isLoading: boolean }) {
  const [mode, setMode] = useState<"total" | "unique">("total");
  if (isLoading) return <div className="h-64 flex items-center justify-center font-mono text-sm animate-pulse border-4 border-black dark:border-gray-700 bg-brutal-white text-brutal-black brutal-shadow">CALCULATING ANALYTICS...</div>;
  if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center font-mono text-sm border-4 border-black dark:border-gray-700 bg-brutal-white text-brutal-black brutal-shadow">NO DATA AVAILABLE</div>;

  const getValue = (d: any) => mode === "total" ? d.totalViews : d.uniqueVisitors;
  const maxCount = Math.max(...data.map(getValue), 5);
  const height = 200;
  const width = 600;
  const padding = 40;

  const points = data.map((d, i) => {
    const val = getValue(d);
    const x = padding + (i * (width - 2 * padding) / (data.length - 1));
    const y = height - padding - (val / maxCount * (height - 2 * padding));
    return { x, y, count: val, date: d.date };
  });

  const pathD = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="bg-brutal-white border-2 border-brutal-border shadow-[2px_2px_0px_0px_var(--theme-border)] p-6 md:p-8 overflow-hidden text-brutal-black">
      <div className="flex flex-col mb-6 border-b-2 border-brutal-border pb-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-heading font-black text-2xl uppercase italic leading-none">Views Trend</h3>
          <div className="flex border-2 border-brutal-border divide-x-2 divide-brutal-border overflow-hidden shadow-[2px_2px_0px_0px_var(--theme-border)]">
            <button
              onClick={() => setMode("total")}
              className={`px-3 py-1 font-mono text-[10px] uppercase font-bold transition-all ${mode === "total" ? "bg-brutal-yellow text-black" : "bg-brutal-bg text-brutal-black hover:bg-brutal-yellow/20"}`}
            >
              Total
            </button>
            <button
              onClick={() => setMode("unique")}
              className={`px-3 py-1 font-mono text-[10px] uppercase font-bold transition-all ${mode === "unique" ? "bg-brutal-yellow text-black" : "bg-brutal-bg text-brutal-black hover:bg-brutal-yellow/20"}`}
            >
              Unique
            </button>
          </div>
        </div>
        <span className="font-mono text-[10px] border border-brutal-border px-2 py-0.5 uppercase font-bold w-fit bg-brutal-bg text-brutal-muted">
          Last 14 Days ({mode === "total" ? "Total Hits" : "Unique Visitors"})
        </span>
      </div>
      <div className="relative h-64 w-full group">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = padding + (i * (height - 2 * padding) / 4);
            const val = Math.round(maxCount - (i * maxCount / 4));
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="currentColor" className="text-gray-200 dark:text-gray-800" strokeWidth="1" />
                <text x={padding - 10} y={y + 4} textAnchor="end" className="text-[10px] font-mono fill-current text-brutal-muted font-bold">{val}</text>
              </g>
            );
          })}

          {/* Main Path with Shadow */}
          <path d={pathD} fill="none" stroke="currentColor" className="text-black/10 dark:text-black/50" strokeWidth="10" strokeLinejoin="round" />
          <path d={pathD} fill="none" stroke={mode === "total" ? "var(--theme-lime)" : "var(--theme-cyan)"} strokeWidth="4" strokeLinejoin="round" />

          {/* Points */}
          {points.map((p, i) => (
            <g key={i} className="cursor-pointer group/point">
              <circle cx={p.x} cy={p.y} r="6" className="fill-current text-brutal-black" />
              <circle cx={p.x} cy={p.y} r="3" className="fill-current text-brutal-bg group-hover/point:text-brutal-yellow transition-colors" />
              <text x={p.x} y={p.y - 12} textAnchor="middle" className="text-[12px] font-heading font-black hidden group-hover/point:block fill-current text-brutal-black">{p.count}</text>
              <text x={p.x} y={height - 10} textAnchor="middle" className="text-[8px] font-mono fill-current text-brutal-muted font-bold">{i % 2 === 0 ? p.date : ""}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function BrutalHeatMap({ data, isLoading }: { data: any[], isLoading: boolean }) {
  const [mode, setMode] = useState<"total" | "unique">("total");
  if (isLoading) return <div className="h-32 bg-brutal-white border-2 border-brutal-border shadow-[2px_2px_0px_0px_var(--theme-border)] animate-pulse" />;
  const squares = [...(data || [])];

  const getValue = (d: any) => mode === "total" ? d.totalViews : d.uniqueVisitors;
  const maxVal = Math.max(...squares.map(getValue), 5);

  const colors = mode === "total"
    ? ["bg-brutal-bg", "bg-brutal-lime/30", "bg-brutal-lime/60", "bg-brutal-lime/80", "bg-brutal-lime"]
    : ["bg-brutal-bg", "bg-brutal-sky/30", "bg-brutal-sky/60", "bg-brutal-sky/80", "bg-brutal-sky"];

  return (
    <div className="bg-brutal-white border-2 border-brutal-border shadow-[2px_2px_0px_0px_var(--theme-border)] p-5">
      {/* Header */}
      <div className="mb-4 border-b-2 border-brutal-border pb-3 text-brutal-black">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="font-heading font-black text-lg uppercase italic leading-none">Engagement</h3>
          <div className="flex border-2 border-brutal-border divide-x-2 divide-brutal-border overflow-hidden shadow-[2px_2px_0px_0px_var(--theme-border)] flex-shrink-0">
            <button
              onClick={() => setMode("total")}
              className={`px-2 py-0.5 font-mono text-[9px] uppercase font-bold transition-all ${mode === "total" ? "bg-brutal-yellow text-black" : "bg-brutal-bg text-brutal-black hover:bg-brutal-yellow/20"}`}
            >Total</button>
            <button
              onClick={() => setMode("unique")}
              className={`px-2 py-0.5 font-mono text-[9px] uppercase font-bold transition-all ${mode === "unique" ? "bg-brutal-yellow text-black" : "bg-brutal-bg text-brutal-black hover:bg-brutal-yellow/20"}`}
            >Unique</button>
          </div>
        </div>
        <span className="font-mono text-[9px] border border-brutal-border px-1.5 py-0.5 uppercase font-bold inline-block bg-brutal-bg text-brutal-muted">
          {mode === "total" ? "Total Hits" : "Unique Visitors"}
        </span>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {squares.map((s, i) => {
          const val = getValue(s);
          const intensity = Math.min(Math.ceil(val / (maxVal / 4)), 4);
          return (
            <div key={i} title={`${s.date}: ${val} ${mode === "total" ? "views" : "visitors"}`} className={`aspect-square border border-brutal-border ${colors[intensity]} hover:-translate-y-0.5 transition-all cursor-crosshair`} />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between font-mono text-[8px] uppercase font-bold text-brutal-muted">
        <span>Low</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className={`w-3 h-3 border border-brutal-border ${colors[i]}`} />
          ))}
        </div>
        <span>High</span>
      </div>
    </div>
  );
}

// Pages
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { DailyTimelinePage } from "./pages/DailyTimelinePage";
import { DailyDetailPage } from "./pages/DailyDetailPage";
import { DevLogListPage } from "./pages/DevLogListPage";
import { DevLogDetailPage } from "./pages/DevLogDetailPage";
import { ProjectDetail } from "./pages/ProjectDetail";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { AdminProjectsPage } from "./pages/admin/AdminProjectsPage";
import { AdminDailyPage } from "./pages/admin/AdminDailyPage";
import { AdminDevLogPage } from "./pages/admin/AdminDevLogPage";
import { AdminComponentsPage } from "./pages/admin/AdminComponentsPage";
import { AdminCommentsPage } from "./pages/admin/AdminCommentsPage";
import { PublicComponentsPage } from "./pages/PublicComponentsPage";

// TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Dashboard index — shows overview cards
function AdminDashboard() {
  const queryClient = useQueryClient();
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await apiClient.get("/api/admin/stats");
      return res.data;
    },
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await apiClient.get("/api/admin/users");
      return res.data;
    },
  });

  const { data: trend, isLoading: trendLoading } = useQuery({
    queryKey: ["admin-views-trend"],
    queryFn: async () => {
      const res = await apiClient.get("/api/admin/analytics/views-trend");
      return res.data;
    },
  });

  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["admin-visitor-leaderboard"],
    queryFn: async () => {
      const res = await apiClient.get("/api/admin/analytics/visitor-leaderboard");
      return res.data;
    },
  });

  const handleClearLogs = async () => {
    if (!confirm("Clear ALL visitor logs? This cannot be undone.")) return;
    await apiClient.delete("/api/admin/clear-logs");
    queryClient.invalidateQueries();
  };

  return (
    <div className="animate-fade-in text-brutal-black">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-black uppercase text-brutal-black">Dashboard<span className="text-brutal-yellow">.</span></h1>
          <p className="font-mono text-brutal-muted font-bold text-xs uppercase mt-1">System Overview & Analytics</p>
        </div>
        <button onClick={handleClearLogs} className="font-mono text-xs uppercase font-bold px-3 py-2 border-2 border-brutal-border bg-brutal-white text-brutal-black hover:bg-brutal-red hover:text-white hover:border-brutal-red transition-all shadow-[2px_2px_0px_0px_var(--theme-border)] cursor-pointer">
          <Trash2 className="w-3.5 h-3.5 inline-block mr-1.5" /> Clear Visitor Logs
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {[
          { label: "Projects", val: stats?.projects ?? 0, color: "bg-brutal-yellow" },
          { label: "Daily Shares", val: stats?.daily ?? 0, color: "bg-brutal-cyan" },
          { label: "DevLogs", val: stats?.devlogs ?? 0, color: "bg-brutal-purple" },
          { label: "Comments", val: stats?.comments ?? 0, color: "bg-brutal-pink" },
          { label: "Unique Visitors", val: stats?.uniqueVisitors ?? 0, color: "bg-brutal-lime" },
          { label: "Total Views", val: stats?.totalViews ?? 0, color: "bg-brutal-sky" },
        ].map((s, idx) => (
          <div key={idx} className="bg-brutal-white border-2 border-brutal-border shadow-[2px_2px_0px_0px_var(--theme-border)] p-5 hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all text-brutal-black relative overflow-hidden group">
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${s.color}`} />
            <div className="flex justify-between items-start mb-2">
              <p className="font-mono text-xs text-brutal-muted uppercase font-bold tracking-wider">{s.label}</p>
              <span className={`w-2.5 h-2.5 rounded-full ${s.color} border border-brutal-border`} />
            </div>
            <p className="font-heading text-3xl font-black">{statsLoading ? "..." : s.val}</p>
          </div>
        ))}
      </div>

      {/* Views Trend — full width */}
      <div className="mb-8">
        <BrutalLineChart data={trend} isLoading={trendLoading} />
      </div>

      {/* Visitor Leaderboard */}
      <div className="bg-brutal-white border-2 border-brutal-border shadow-[2px_2px_0px_0px_var(--theme-border)] p-6 mb-8 text-brutal-black">
        <h2 className="font-heading text-2xl font-black uppercase mb-6 border-b-2 border-brutal-border pb-3 flex items-center justify-between">
          <span>Visitor Leaderboard</span>
          <span className="font-mono text-[10px] bg-brutal-yellow text-black border border-brutal-border px-2 py-0.5 uppercase font-bold">Top Active</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-brutal-border font-heading font-bold text-xs uppercase text-brutal-muted tracking-wider">
                <th className="py-3 px-2">Visitor / Email</th>
                <th className="py-3 px-2">Total Hits</th>
                <th className="py-3 px-2">Last Path</th>
                <th className="py-3 px-2">Last Active</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs font-bold uppercase">
              {leaderboardLoading ? (
                <tr><td colSpan={4} className="py-8 text-center text-brutal-muted animate-pulse">Calculating visit intensity...</td></tr>
              ) : (
                leaderboard?.map((v: any) => (
                  <tr key={v.identifier} className="border-b border-brutal-border/40 hover:bg-brutal-bg transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${v.isAuthenticated ? "bg-brutal-lime animate-pulse" : "bg-gray-400 dark:bg-gray-600"}`} />
                        <span className={v.isAuthenticated ? "text-brutal-black font-black" : "text-brutal-muted"}>
                          {v.identifier || "Anonymous Visitor"}
                        </span>
                        {v.isAuthenticated && (
                          <span className="text-[8px] bg-brutal-yellow text-black px-1 font-mono font-bold border border-brutal-border">AUTH</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span className="bg-brutal-yellow/20 text-brutal-black px-2 py-0.5 border border-brutal-border inline-block font-mono text-xs font-bold">{v.totalViews} Views</span>
                    </td>
                    <td className="py-3 px-2 text-brutal-muted max-w-[200px] truncate">{v.lastPath}</td>
                    <td className="py-3 px-2 text-brutal-muted">{new Date(v.lastActive).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Actions */}
          <div className="bg-brutal-white border-2 border-brutal-border shadow-[2px_2px_0px_0px_var(--theme-border)] p-6 text-brutal-black">
            <h2 className="font-heading text-2xl font-black uppercase mb-6 border-b-2 border-brutal-border pb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/admin/projects" className="bg-brutal-bg hover:bg-brutal-lime hover:text-black text-brutal-black p-4 border-2 border-brutal-border font-heading font-bold text-center uppercase text-sm shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                New Project
              </Link>
              <Link to="/admin/daily" className="bg-brutal-bg hover:bg-brutal-sky hover:text-black text-brutal-black p-4 border-2 border-brutal-border font-heading font-bold text-center uppercase text-sm shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                New Daily
              </Link>
              <Link to="/admin/devlog" className="bg-brutal-bg hover:bg-brutal-purple hover:text-white text-brutal-black p-4 border-2 border-brutal-border font-heading font-bold text-center uppercase text-sm shadow-[2px_2px_0px_0px_var(--theme-border)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                New DevLog
              </Link>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-brutal-white border-2 border-brutal-border shadow-[2px_2px_0px_0px_var(--theme-border)] p-6 text-brutal-black">
            <h2 className="font-heading text-2xl font-black uppercase mb-6 border-b-2 border-brutal-border pb-3">User Directory</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-brutal-border font-heading font-bold text-xs uppercase text-brutal-muted tracking-wider">
                    <th className="py-3 px-2">User</th>
                    <th className="py-3 px-2">Contributions</th>
                    <th className="py-3 px-2">Last Active</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs font-bold uppercase">
                  {usersLoading ? (
                    <tr><td colSpan={3} className="py-8 text-center text-brutal-muted animate-pulse">Scanning users...</td></tr>
                  ) : (
                    users?.map((u: any) => (
                      <tr key={u.id} className="border-b border-brutal-border/40 hover:bg-brutal-bg transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-none border-2 border-brutal-border bg-brutal-yellow text-black flex items-center justify-center font-heading font-black text-sm">
                              {u.userName.charAt(0)}
                            </div>
                            <span className="text-brutal-black font-semibold">{u.userName.split('@')[0]}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-brutal-muted">{u.commentCount} Comments</td>
                        <td className="py-3 px-2 text-brutal-muted">
                          {u.lastAction ? new Date(u.lastAction).toLocaleDateString() : "Never"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* System Info */}
          <div className="bg-brutal-white text-brutal-black border-2 border-brutal-border shadow-[2px_2px_0px_0px_var(--theme-border)] p-6 h-fit">
            <h2 className="font-heading text-xl font-black uppercase mb-6 border-b-2 border-brutal-border pb-3">System Info</h2>
            <ul className="font-mono text-xs space-y-3 uppercase font-bold">
              <li className="flex justify-between border-b border-brutal-border/40 pb-2">
                <span className="text-brutal-muted">Version</span>
                <span>v1.0.5-stable</span>
              </li>
              <li className="flex justify-between border-b border-brutal-border/40 pb-2">
                <span className="text-brutal-muted">Admin Users</span>
                <span>2 Registered</span>
              </li>
              <li className="flex justify-between border-b border-brutal-border/40 pb-2">
                <span className="text-brutal-muted">Storage</span>
                <span className="text-brutal-lime">Healthy</span>
              </li>
              <li className="flex justify-between border-b border-brutal-border/40 pb-2">
                <span className="text-brutal-muted">Database</span>
                <span className="text-brutal-cyan">PostgreSQL 17</span>
              </li>
              <li className="flex justify-between">
                <span className="text-brutal-muted">Uptime</span>
                <span className="text-brutal-yellow font-black">99.99%</span>
              </li>
            </ul>
          </div>

          {/* Engagement Heatmap — below System Info */}
          <BrutalHeatMap data={trend} isLoading={trendLoading} />
        </div>
      </div>

    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "project/:id", element: <ProjectDetail /> },
      { path: "daily", element: <DailyTimelinePage /> },
      { path: "daily/:id", element: <DailyDetailPage /> },
      { path: "devlog", element: <DevLogListPage /> },
      { path: "devlog/:id", element: <DevLogDetailPage /> },
      { path: "components", element: <PublicComponentsPage /> },
      { path: "login", element: <AdminLogin /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "projects", element: <AdminProjectsPage /> },
      { path: "daily", element: <AdminDailyPage /> },
      { path: "devlog", element: <AdminDevLogPage /> },
      { path: "components", element: <AdminComponentsPage /> },
      { path: "comments", element: <AdminCommentsPage /> },
    ],
  },
]);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
