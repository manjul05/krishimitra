import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const stats = [
  { label: "Active Crops", value: "4", icon: "🌱" },
  { label: "Scans This Month", value: "12", icon: "📸" },
  { label: "Weather Alerts", value: "2", icon: "🌧️" },
  { label: "AI Queries", value: "28", icon: "🤖" },
];

const recentActivity = [
  { action: "Wheat scan completed", time: "2 hours ago", status: "Healthy" },
  { action: "Rice disease detected", time: "Yesterday", status: "Action needed" },
  { action: "Weather alert received", time: "2 days ago", status: "Info" },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:py-10 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 sm:mb-10">
            <p className="km-section-label mb-3">Dashboard</p>
            <h1 className="mb-2 text-2xl font-bold km-text-primary sm:text-3xl md:text-4xl">
              Your Farming Dashboard
            </h1>
            <p className="max-w-2xl text-sm km-text-muted sm:text-base md:text-lg">
              Crop insights, weather updates, and AI-driven recommendations at a
              glance.
            </p>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-km-border km-glass p-4 sm:p-5 dark:border-km-green/20"
              >
                <span className="mb-2 block text-xl sm:text-2xl" aria-hidden="true">
                  {stat.icon}
                </span>
                <p className="text-xl font-bold text-km-green sm:text-2xl">{stat.value}</p>
                <p className="mt-0.5 text-xs km-text-muted sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-km-border km-glass p-5 sm:p-6 dark:border-km-green/20">
              <h2 className="mb-4 text-lg font-semibold km-text-primary">Recent Activity</h2>
              <ul className="flex flex-col gap-3">
                {recentActivity.map((item) => (
                  <li
                    key={item.action}
                    className="flex flex-col gap-1 rounded-xl border border-km-border/50 bg-white/50 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-km-green/15 dark:bg-km-green-dark/30"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium km-text-primary">
                        {item.action}
                      </p>
                      <p className="text-xs km-text-muted">{item.time}</p>
                    </div>
                    <span className="shrink-0 self-start rounded-full bg-km-green-light px-2.5 py-0.5 text-xs font-medium text-km-green dark:bg-km-green/20 sm:self-center">
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl border border-km-border km-glass p-5 sm:p-6 dark:border-km-green/20">
              <h2 className="mb-4 text-lg font-semibold km-text-primary">Quick Actions</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { href: "/detect", label: "Scan Crop", icon: "📸" },
                  { href: "#weather", label: "Check Weather", icon: "🌤️" },
                  { href: "#ai-chat", label: "Ask AI", icon: "🤖" },
                  { href: "#market-prices", label: "View Prices", icon: "📈" },
                ].map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="flex items-center gap-3 rounded-xl border border-km-border/50 bg-white/50 p-4 transition-colors hover:border-km-green/40 hover:bg-km-green-light/30 dark:border-km-green/15 dark:bg-km-green-dark/30 dark:hover:bg-km-green/10"
                  >
                    <span className="text-xl" aria-hidden="true">{action.icon}</span>
                    <span className="text-sm font-medium km-text-primary">{action.label}</span>
                  </a>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
