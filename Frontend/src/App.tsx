import { useState } from "react";
import { createBrowserRouter, RouterProvider, Link } from "react-router";
import { QueryClient, QueryClientProvider, useQuery, useQueryClient } from "@tanstack/react-query";
import { RootLayout } from "./components/RootLayout";
import { AdminLayout } from "./components/AdminLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";
import { apiClient } from "./api/apiClient";
import { Trash2 } from "lucide-react";

function BrutalLineChart({ data, isLoading }: { data: any[], isLoading: boolean }) {
  const [mode, setMode] = useState<"total" | "unique">("total");
  if (isLoading) return <div className="h-64 flex items-center justify-center font-mono text-sm animate-pulse border-4 border-black bg-white brutal-shadow">CALCULATING ANALYTICS...</div>;
  if (!data || data.length === 0) return <div className="h-64 flex items-center justify-center font-mono text-sm border-4 border-black bg-white brutal-shadow">NO DATA AVAILABLE</div>;

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
    <div className="bg-brutal-white border-4 border-black dark:border-gray-700 brutal-shadow p-8 overflow-hidden">
      <div className="flex flex-col mb-8 border-b-4 border-black dark:border-gray-700 pb-4 text-brutal-black">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-heading font-black text-2xl uppercase italic leading-none">Views Trend</h3>
          <div className="flex border-2 border-black divide-x-2 divide-black overflow-hidden shadow-[2px_2px_0px_0px_#000]">
            <button
              onClick={() => setMode("total")}
              className={`px-3 py-1 font-mono text-[10px] uppercase font-bold transition-all ${mode === "total" ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
            >
              Total
            </button>
            <button
              onClick={() => setMode("unique")}
              className={`px-3 py-1 font-mono text-[10px] uppercase font-bold transition-all ${mode === "unique" ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
            >
              Unique
            </button>
          </div>
        </div>
        <span className="font-mono text-[10px] border-2 border-black px-2 py-0.5 uppercase font-bold w-fit">
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
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#eee" strokeWidth="1" />
                <text x={padding - 10} y={y + 4} textAnchor="end" className="text-[10px] font-mono fill-gray-400 font-bold">{val}</text>
              </g>
            );
          })}

          {/* Main Path with Shadow */}
          <path d={pathD} fill="none" stroke="black" strokeWidth="10" strokeLinejoin="round" />
          <path d={pathD} fill="none" stroke={mode === "total" ? "#A3E635" : "#38BDF8"} strokeWidth="5" strokeLinejoin="round" />

          {/* Points */}
          {points.map((p, i) => (
            <g key={i} className="cursor-pointer group/point">
              <circle cx={p.x} cy={p.y} r="6" fill="black" />
              <circle cx={p.x} cy={p.y} r="3" fill="white" className="group-hover/point:fill-brutal-lime transition-colors" />
              <text x={p.x} y={p.y - 12} textAnchor="middle" className="text-[12px] font-heading font-black hidden group-hover/point:block fill-black">{p.count}</text>
              <text x={p.x} y={height - 10} textAnchor="middle" className="text-[8px] font-mono fill-gray-500 font-bold">{i % 2 === 0 ? p.date : ""}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

function BrutalHeatMap({ data, isLoading }: { data: any[], isLoading: boolean }) {
  const [mode, setMode] = useState<"total" | "unique">("total");
  if (isLoading) return <div className="h-32 bg-white border-4 border-black brutal-shadow animate-pulse" />;
  const squares = [...(data || [])];

  const getValue = (d: any) => mode === "total" ? d.totalViews : d.uniqueVisitors;
  const maxVal = Math.max(...squares.map(getValue), 5);

  const colors = mode === "total"
    ? ["bg-gray-100", "bg-brutal-lime/30", "bg-brutal-lime/60", "bg-brutal-lime/90", "bg-brutal-lime"]
    : ["bg-gray-100", "bg-brutal-sky/30", "bg-brutal-sky/60", "bg-brutal-sky/90", "bg-brutal-sky"];

  return (
    <div className="bg-brutal-white border-4 border-black dark:border-gray-700 brutal-shadow p-5">
      {/* Header */}
      <div className="mb-4 border-b-4 border-black dark:border-gray-700 pb-3 text-brutal-black">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="font-heading font-black text-lg uppercase italic leading-none">Engagement</h3>
          <div className="flex border-2 border-black divide-x-2 divide-black overflow-hidden shadow-[2px_2px_0px_0px_#000] flex-shrink-0">
            <button
              onClick={() => setMode("total")}
              className={`px-2 py-0.5 font-mono text-[9px] uppercase font-bold transition-all ${mode === "total" ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
            >Total</button>
            <button
              onClick={() => setMode("unique")}
              className={`px-2 py-0.5 font-mono text-[9px] uppercase font-bold transition-all ${mode === "unique" ? "bg-black text-white" : "bg-white hover:bg-gray-100"}`}
            >Unique</button>
          </div>
        </div>
        <span className="font-mono text-[9px] border-2 border-black px-1.5 py-0.5 uppercase font-bold inline-block">
          {mode === "total" ? "Total Hits" : "Unique Visitors"}
        </span>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {squares.map((s, i) => {
          const val = getValue(s);
          const intensity = Math.min(Math.ceil(val / (maxVal / 4)), 4);
          return (
            <div key={i} title={`${s.date}: ${val} ${mode === "total" ? "views" : "visitors"}`} className={`aspect-square border-2 border-black ${colors[intensity]} hover:-translate-y-0.5 transition-all cursor-crosshair`} />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between font-mono text-[8px] uppercase font-bold text-gray-400">
        <span>Low</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className={`w-3 h-3 border border-black ${colors[i]}`} />
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
    <div className="animate-fade-in">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-black uppercase">Dashboard<span className="text-brutal-yellow">.</span></h1>
          <p className="font-mono text-gray-500 font-bold text-sm uppercase mt-1">System Overview & Analytics</p>
        </div>
        <button onClick={handleClearLogs} className="font-mono text-[10px] uppercase font-bold px-3 py-2 border-2 border-black bg-white text-black dark:bg-gray-800 dark:text-gray-200 hover:bg-brutal-red dark:hover:bg-brutal-red dark:hover:text-white hover:text-white transition-all shadow-[2px_2px_0px_0px_#000] dark:shadow-[2px_2px_0px_0px_#333]">
          <Trash2 className="w-3 h-3 inline-block mr-1" /> Clear Visitor Logs
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-12">
        <div className="bg-brutal-yellow border-4 border-black dark:border-gray-700 brutal-shadow p-6 group hover:-translate-x-1 hover:-translate-y-1 transition-all text-black">
          <p className="font-heading font-black text-[10px] uppercase mb-1">Projects</p>
          <p className="font-heading text-4xl font-black">{statsLoading ? "..." : stats?.projects ?? 0}</p>
        </div>
        <div className="bg-brutal-cyan border-4 border-black dark:border-gray-700 brutal-shadow p-6 group hover:-translate-x-1 hover:-translate-y-1 transition-all text-black">
          <p className="font-heading font-black text-[10px] uppercase mb-1">Daily Shares</p>
          <p className="font-heading text-4xl font-black">{statsLoading ? "..." : stats?.daily ?? 0}</p>
        </div>
        <div className="bg-brutal-purple border-4 border-black dark:border-gray-700 brutal-shadow p-6 text-white group hover:-translate-x-1 hover:-translate-y-1 transition-all">
          <p className="font-heading font-black text-[10px] uppercase mb-1">DevLogs</p>
          <p className="font-heading text-4xl font-black">{statsLoading ? "..." : stats?.devlogs ?? 0}</p>
        </div>
        <div className="bg-brutal-pink border-4 border-black dark:border-gray-700 brutal-shadow p-6 group hover:-translate-x-1 hover:-translate-y-1 transition-all text-black">
          <p className="font-heading font-black text-[10px] uppercase mb-1">Comments</p>
          <p className="font-heading text-4xl font-black">{statsLoading ? "..." : stats?.comments ?? 0}</p>
        </div>
        <div className="bg-brutal-lime border-4 border-black dark:border-gray-700 brutal-shadow p-6 group hover:-translate-x-1 hover:-translate-y-1 transition-all text-black">
          <p className="font-heading font-black text-[10px] uppercase mb-1">Unique Visitors</p>
          <p className="font-heading text-4xl font-black">{statsLoading ? "..." : stats?.uniqueVisitors ?? 0}</p>
        </div>
        <div className="bg-brutal-sky border-4 border-black dark:border-gray-700 brutal-shadow p-6 group hover:-translate-x-1 hover:-translate-y-1 transition-all text-black">
          <p className="font-heading font-black text-[10px] uppercase mb-1">Total Views</p>
          <p className="font-heading text-4xl font-black">{statsLoading ? "..." : stats?.totalViews ?? 0}</p>
        </div>
      </div>

      {/* Views Trend — full width */}
      <div className="mb-8">
        <BrutalLineChart data={trend} isLoading={trendLoading} />
      </div>

      {/* Visitor Leaderboard */}
      <div className="bg-brutal-white border-4 border-black dark:border-gray-700 brutal-shadow p-8 mb-8 text-brutal-black">
        <h2 className="font-heading text-2xl font-black uppercase mb-6 border-b-4 border-black dark:border-gray-700 pb-2 flex items-center gap-2">
          <span>Visitor Leaderboard</span>
          <span className="font-mono text-[10px] bg-black dark:bg-white text-white dark:text-black px-2 py-0.5 uppercase">Top Active</span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-black dark:border-gray-700 font-heading font-black text-xs uppercase italic">
                <th className="py-4 px-2">Visitor / Email</th>
                <th className="py-4 px-2">Total Hits</th>
                <th className="py-4 px-2">Last Path</th>
                <th className="py-4 px-2">Last Active</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs font-bold uppercase">
              {leaderboardLoading ? (
                <tr><td colSpan={4} className="py-8 text-center animate-pulse">Calculating visit intensity...</td></tr>
              ) : (
                leaderboard?.map((v: any) => (
                  <tr key={v.identifier} className="border-b-2 border-black/10 dark:border-gray-700 hover:bg-brutal-cyan/5 transition-colors">
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${v.isAuthenticated ? "bg-brutal-lime animate-pulse" : "bg-gray-300 dark:bg-gray-600"}`} />
                        <span className={v.isAuthenticated ? "text-black dark:text-gray-200 font-black" : "text-gray-500 dark:text-gray-400"}>
                          {v.identifier || "Anonymous Visitor"}
                        </span>
                        {v.isAuthenticated && (
                          <span className="text-[8px] bg-black dark:bg-white text-white dark:text-black px-1 font-mono">AUTH</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <span className="bg-brutal-yellow text-black px-2 py-0.5 border-2 border-black inline-block">{v.totalViews} Views</span>
                    </td>
                    <td className="py-4 px-2 text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{v.lastPath}</td>
                    <td className="py-4 px-2 text-gray-500 dark:text-gray-400">{new Date(v.lastActive).toLocaleString()}</td>
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
          <div className="bg-brutal-white border-4 border-black dark:border-gray-700 brutal-shadow p-8 text-brutal-black">
            <h2 className="font-heading text-2xl font-black uppercase mb-6 border-b-4 border-black pb-2">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/admin/projects" className="bg-brutal-lime text-black p-4 border-4 border-black dark:border-gray-700 font-heading font-black text-center uppercase text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333]">
                New Project
              </Link>
              <Link to="/admin/daily" className="bg-brutal-sky text-black p-4 border-4 border-black dark:border-gray-700 font-heading font-black text-center uppercase text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333]">
                New Daily
              </Link>
              <Link to="/admin/devlog" className="bg-brutal-amber text-black p-4 border-4 border-black dark:border-gray-700 font-heading font-black text-center uppercase text-sm hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[4px_4px_0px_0px_#000] dark:shadow-[4px_4px_0px_0px_#333]">
                New DevLog
              </Link>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-brutal-white border-4 border-black dark:border-gray-700 brutal-shadow p-8 text-brutal-black">
            <h2 className="font-heading text-2xl font-black uppercase mb-6 border-b-4 border-black dark:border-gray-700 pb-2">User Directory</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-4 border-black dark:border-gray-700 font-heading font-black text-xs uppercase">
                    <th className="py-4 px-2">User</th>
                    <th className="py-4 px-2">Contributions</th>
                    <th className="py-4 px-2">Last Active</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs font-bold uppercase">
                  {usersLoading ? (
                    <tr><td colSpan={3} className="py-8 text-center animate-pulse">Scanning users...</td></tr>
                  ) : (
                    users?.map((u: any) => (
                      <tr key={u.id} className="border-b-2 border-black/10 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-none border-2 border-black bg-brutal-yellow text-black flex items-center justify-center font-heading font-black text-sm">
                              {u.userName.charAt(0)}
                            </div>
                            <span className="dark:text-gray-200">{u.userName.split('@')[0]}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2 dark:text-gray-300">{u.commentCount} Comments</td>
                        <td className="py-4 px-2 text-gray-500 dark:text-gray-400">
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
          <div className="bg-black text-white border-4 border-black dark:border-gray-700 brutal-shadow p-8 h-fit">
            <h2 className="font-heading text-xl font-black uppercase mb-6 border-b-2 border-white/20 pb-2">System Info</h2>
            <ul className="font-mono text-[10px] space-y-4 uppercase">
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50">Version</span>
                <span>v1.0.5-stable</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50">Admin Users</span>
                <span>2 Registered</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50">Storage</span>
                <span className="text-brutal-lime">Healthy</span>
              </li>
              <li className="flex justify-between border-b border-white/10 pb-2">
                <span className="text-white/50">Database</span>
                <span className="text-brutal-cyan">PostgreSQL</span>
              </li>
              <li className="flex justify-between">
                <span className="text-white/50">Uptime</span>
                <span className="text-brutal-yellow">99.99%</span>
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
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
