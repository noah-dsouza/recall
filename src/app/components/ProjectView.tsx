import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  GitCommit,
  MessageSquare,
  FileText,
  CheckCircle2,
  Info,
  Brain,
  Upload,
} from "lucide-react";
import { Button } from "./ui/button";
import { MemoryRecallPanel } from "./MemoryRecallPanel";
import { DocumentUploadDrawer, ExtractedDecision } from "./DocumentUploadDrawer";

interface ProjectViewProps {
  projectId: string; // this is your THREAD ID now
  onBack: () => void;
}

interface TimelineEvent {
  id: string;
  type: "commit" | "comment" | "decision" | "milestone";
  title: string;
  description: string;
  timestamp: string;
  author: string;
}

interface Decision {
  id: string;
  title: string;
  rationale: string;
  outcome: string;
  timestamp: string;
  author: string;
  confidence: number;
  tags: string[];
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "decision",
    title: "Chose React over Angular for UI framework",
    description: "After evaluating performance, ecosystem, and team expertise",
    timestamp: "2 hours ago",
    author: "Sarah Chen",
  },
  {
    id: "2",
    type: "milestone",
    title: "Design system approved",
    description: "All stakeholders signed off on the new component library",
    timestamp: "5 hours ago",
    author: "Design Team",
  },
  {
    id: "3",
    type: "comment",
    title: "Accessibility concerns raised",
    description: "Need to ensure WCAG 2.1 AA compliance across all components",
    timestamp: "1 day ago",
    author: "Alex Kim",
  },
  {
    id: "4",
    type: "commit",
    title: "API integration completed",
    description: "Connected frontend to new microservices architecture",
    timestamp: "1 day ago",
    author: "Dev Team",
  },
];

const decisions: Decision[] = [
  {
    id: "1",
    title: "Use TypeScript for type safety",
    rationale:
      "After encountering multiple runtime errors in the previous version, we decided TypeScript would catch issues at compile time and improve developer experience with better autocomplete and refactoring tools.",
    outcome: "Reduced bugs by 40% and improved onboarding time for new developers",
    timestamp: "3 days ago",
    author: "Engineering Lead",
    confidence: 92,
    tags: ["Technical", "Long-term"],
  },
  {
    id: "2",
    title: "Implement progressive disclosure in complex forms",
    rationale:
      "User testing showed that showing all fields at once was overwhelming. Progressive disclosure improves completion rates while maintaining data quality.",
    outcome: "Form completion increased by 35%",
    timestamp: "5 days ago",
    author: "UX Research",
    confidence: 88,
    tags: ["UX", "Data-driven"],
  },
  {
    id: "3",
    title: "Defer mobile optimization to Q2",
    rationale:
      "Analytics show 85% of enterprise users access the platform on desktop. Mobile optimization would delay critical features needed by our largest customers.",
    outcome: "Delivered core features on time, mobile planned for Q2",
    timestamp: "1 week ago",
    author: "Product Manager",
    confidence: 75,
    tags: ["Strategy", "Trade-off"],
  },
];

export function ProjectView({ projectId, onBack }: ProjectViewProps) {
  const [showRecallPanel, setShowRecallPanel] = useState(false);
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [timelineItems, setTimelineItems] = useState<TimelineEvent[]>(timelineEvents);
  const [decisionItems, setDecisionItems] = useState<Decision[]>(decisions);
  const [recentDecisionId, setRecentDecisionId] = useState<string | null>(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSaveDecision = (extracted: ExtractedDecision) => {
    const newTimelineEvent: TimelineEvent = {
      id: `timeline-${Date.now()}`,
      type: "decision",
      title: `Decision extracted from document`,
      description: extracted.title,
      timestamp: "Just now",
      author: "Document Analysis",
    };
    setTimelineItems((prev) => [newTimelineEvent, ...prev]);

    const newDecision: Decision = {
      id: extracted.id,
      title: extracted.title,
      rationale: extracted.rationale,
      outcome: "Saved to memory (thread) via /api/ask",
      timestamp: "Just now",
      author: "Recall",
      confidence: extracted.confidence,
      tags: ["From Document", extracted.source.split(".")[0]],
    };

    setDecisionItems((prev) => [newDecision, ...prev]);
    setRecentDecisionId(extracted.id);

    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    highlightTimeoutRef.current = setTimeout(() => {
      setRecentDecisionId((current) => (current === extracted.id ? null : current));
    }, 3200);
  };

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
    };
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case "commit":
        return GitCommit;
      case "comment":
        return MessageSquare;
      case "decision":
        return CheckCircle2;
      case "milestone":
        return FileText;
      default:
        return Info;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-[#10B981]";
    if (confidence >= 70) return "text-[#F59E0B]";
    return "text-[#EF4444]";
  };

  return (
    <div className="flex-1 overflow-auto relative">
      <div className="max-w-7xl mx-auto p-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-4 -ml-2 text-[#6B7280] hover:text-[#1A1D2E]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Projects
            </Button>

            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <h1 className="text-3xl font-semibold text-[#1A1D2E] mb-2">
                  Project Workspace
                </h1>
                <p className="text-[#6B7280]">
                  This workspace is backed by a thread in your backend.
                </p>

                {/* thread id pill */}
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#EEF2FF] px-3 py-1 text-xs text-[#2D4B9E]">
                  <span className="font-medium">Thread</span>
                  <span className="font-mono truncate max-w-[520px]">{projectId}</span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <Button
                  onClick={() => setShowUploadDrawer(true)}
                  variant="outline"
                  className="border-[#2D4B9E] text-[#2D4B9E] hover:bg-[#EEF2FF] flex items-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload Document
                </Button>

                <Button
                  onClick={() => setShowRecallPanel(true)}
                  className="bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] hover:from-[#7C3AED] hover:to-[#9333EA] text-white flex items-center gap-2"
                >
                  <Brain className="w-5 h-5" />
                  Recall Memory
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Timeline */}
            <div>
              <h2 className="text-xl font-semibold text-[#1A1D2E] mb-4">Timeline</h2>
              <div className="space-y-4">
                {timelineItems.map((event, index) => {
                  const Icon = getEventIcon(event.type);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                      className="bg-white rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] relative pl-12"
                    >
                      <div className="absolute left-4 top-4 w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center">
                        <Icon className="w-4 h-4 text-[#2D4B9E]" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[#1A1D2E] mb-1">{event.title}</h3>
                        <p className="text-sm text-[#6B7280] mb-2">{event.description}</p>
                        <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                          <span>{event.author}</span>
                          <span>•</span>
                          <span>{event.timestamp}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Decision Ledger */}
            <div>
              <h2 className="text-xl font-semibold text-[#1A1D2E] mb-4">Decision Ledger</h2>
              <div className="space-y-4">
                {decisionItems.map((decision, index) => {
                  const isHighlighted = recentDecisionId === decision.id;

                  return (
                    <motion.div
                      key={decision.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0, scale: isHighlighted ? 1.01 : 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                      className={`bg-white rounded-lg p-5 border-l-4 border-[#8B5CF6] transition-shadow duration-300 ${
                        isHighlighted
                          ? "ring-2 ring-[#8B5CF6]/40 shadow-[0_15px_45px_rgba(139,92,246,0.15)]"
                          : "shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-[#1A1D2E] flex-1">{decision.title}</h3>
                        <span className={`text-sm font-medium ${getConfidenceColor(decision.confidence)}`}>
                          {decision.confidence}%
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-[#6B7280] mb-1">Why</p>
                          <p className="text-sm text-[#1A1D2E]">{decision.rationale}</p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-[#6B7280] mb-1">Outcome</p>
                          <p className="text-sm text-[#1A1D2E]">{decision.outcome}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          {decision.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 text-xs bg-[#F3E8FF] text-[#8B5CF6] rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-[#6B7280]">{decision.timestamp}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <MemoryRecallPanel isOpen={showRecallPanel} onClose={() => setShowRecallPanel(false)} />

      <DocumentUploadDrawer
        isOpen={showUploadDrawer}
        onClose={() => setShowUploadDrawer(false)}
        onSaveDecision={handleSaveDecision}
        threadId={projectId}
      />
    </div>
  );
}
