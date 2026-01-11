import { motion } from "motion/react";
import {
  Brain,
  TrendingUp,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const decisionVelocityData = [
  { month: "Sep", decisions: 12 },
  { month: "Oct", decisions: 18 },
  { month: "Nov", decisions: 24 },
  { month: "Dec", decisions: 31 },
  { month: "Jan", decisions: 28 },
];

const confidenceDistribution = [
  { range: "90-100%", count: 34 },
  { range: "80-89%", count: 28 },
  { range: "70-79%", count: 15 },
  { range: "60-69%", count: 8 },
];

const memoryRecallData = [
  { week: "Week 1", recalls: 45 },
  { week: "Week 2", recalls: 52 },
  { week: "Week 3", recalls: 68 },
  { week: "Week 4", recalls: 73 },
];

const decisionCategories = [
  { name: "Technical", value: 42, color: "#2D4B9E" },
  { name: "UX/Design", value: 28, color: "#5B75D8" },
  { name: "Strategy", value: 18, color: "#8B5CF6" },
  { name: "Process", value: 12, color: "#A78BFA" },
];

const stats = [
  {
    icon: Brain,
    label: "Total Decisions",
    value: "113",
    change: "+24%",
    trend: "up",
    color: "from-[#2D4B9E] to-[#5B75D8]",
  },
  {
    icon: TrendingUp,
    label: "Avg. Confidence",
    value: "87%",
    change: "+5%",
    trend: "up",
    color: "from-[#5B75D8] to-[#8B5CF6]",
  },
  {
    icon: Clock,
    label: "Recall Usage",
    value: "238",
    change: "+62%",
    trend: "up",
    color: "from-[#8B5CF6] to-[#A78BFA]",
  },
  {
    icon: Target,
    label: "Applied Precedents",
    value: "47",
    change: "+18%",
    trend: "up",
    color: "from-[#A78BFA] to-[#C4B5FD]",
  },
];

export function InsightsPage() {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-[#1A1D2E] mb-2">
              Insights
            </h1>
            <p className="text-[#6B7280]">
              Track decision patterns and institutional memory effectiveness
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        stat.trend === "up"
                          ? "text-[#10B981]"
                          : "text-[#EF4444]"
                      }`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold text-[#1A1D2E] mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-[#6B7280]">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Decision Velocity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <h3 className="font-semibold text-[#1A1D2E] mb-4">
                Decision Velocity
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={decisionVelocityData}>
                  <defs>
                    <linearGradient id="colorDecisions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D4B9E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2D4B9E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF0" />
                  <XAxis
                    dataKey="month"
                    stroke="#6B7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1D2E",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="decisions"
                    stroke="#2D4B9E"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorDecisions)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Confidence Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <h3 className="font-semibold text-[#1A1D2E] mb-4">
                Confidence Distribution
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={confidenceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF0" />
                  <XAxis
                    dataKey="range"
                    stroke="#6B7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1D2E",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="count" fill="#5B75D8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Memory Recall Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <h3 className="font-semibold text-[#1A1D2E] mb-4">
                Memory Recall Trend
              </h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={memoryRecallData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E8EAF0" />
                  <XAxis
                    dataKey="week"
                    stroke="#6B7280"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#6B7280" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A1D2E",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="recalls"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ fill: "#8B5CF6", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Decision Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <h3 className="font-semibold text-[#1A1D2E] mb-4">
                Decision Categories
              </h3>
              <div className="flex items-center justify-between">
                <ResponsiveContainer width="50%" height={240}>
                  <PieChart>
                    <Pie
                      data={decisionCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {decisionCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3">
                  {decisionCategories.map((category) => (
                    <div key={category.name} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-[#1A1D2E]">{category.name}</p>
                        <p className="text-xs text-[#6B7280]">
                          {category.value} decisions
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
          >
            <h3 className="font-semibold text-[#1A1D2E] mb-4">
              AI-Powered Insights
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-[#EEF2FF] to-[#F3E8FF] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-[#1A1D2E] mb-1">
                    Strong precedent alignment detected
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    Your recent API versioning decision aligns 94% with the successful
                    pattern from Q3 2025. This suggests high likelihood of success.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-[#FEF3C7] to-[#FDE68A] rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-[#1A1D2E] mb-1">
                    Consider reviewing similar past trade-offs
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    Three previous projects deferred mobile optimization. Two faced
                    challenges in Q2 catch-up. Consider reviewing those lessons.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
