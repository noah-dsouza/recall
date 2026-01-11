import { motion, AnimatePresence } from "motion/react";
import { X, Info, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface MemoryRecallPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RecalledDecision {
  id: string;
  title: string;
  context: string;
  confidence: number;
  relevanceScore: number;
  whyRecalled: string;
  references: string[];
  timestamp: string;
  project: string;
}

const recalledDecisions: RecalledDecision[] = [
  {
    id: "1",
    title: "Progressive form design pattern",
    context:
      "We implemented progressive disclosure in the user onboarding flow, which increased completion rates by 42%. This pattern works especially well for complex enterprise workflows.",
    confidence: 94,
    relevanceScore: 89,
    whyRecalled:
      "Similar form complexity and user segment. Previous implementation in onboarding showed strong results with enterprise users.",
    references: ["Memory #247", "Decision #89"],
    timestamp: "Q4 2025",
    project: "User Onboarding v2",
  },
  {
    id: "2",
    title: "TypeScript migration strategy",
    context:
      "Migrated incrementally rather than all-at-once, starting with new features. This approach reduced risk and allowed the team to learn while maintaining velocity.",
    confidence: 91,
    relevanceScore: 85,
    whyRecalled:
      "Current project involves similar technical migration concerns. Incremental approach proved successful in similar scale project.",
    references: ["Memory #182", "Decision #56", "Memory #201"],
    timestamp: "Q3 2025",
    project: "Platform Modernization",
  },
  {
    id: "3",
    title: "API versioning decision",
    context:
      "Chose URL-based versioning over header-based for better discoverability and easier debugging. Enterprise clients appreciated the clarity.",
    confidence: 87,
    relevanceScore: 78,
    whyRecalled:
      "API design decisions for enterprise clients. Similar requirements for backward compatibility and ease of use.",
    references: ["Memory #312"],
    timestamp: "Q2 2025",
    project: "API Gateway v3",
  },
];

export function MemoryRecallPanel({
  isOpen,
  onClose,
}: MemoryRecallPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-auto"
          >
            <div className="sticky top-0 bg-white border-b border-[rgba(0,0,0,0.08)] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-semibold text-[#1A1D2E]">
                  Memory Recall
                </h2>
                <p className="text-sm text-[#6B7280]">
                  Relevant decisions from past projects
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-[#F8F9FA]"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {recalledDecisions.map((decision, index) => (
                <motion.div
                  key={decision.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="bg-gradient-to-br from-[#F8F9FA] to-[#F3E8FF] rounded-xl p-5 border border-[rgba(139,92,246,0.2)]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1A1D2E] mb-1">
                        {decision.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#6B7280]">
                        <span>{decision.project}</span>
                        <span>•</span>
                        <span>{decision.timestamp}</span>
                      </div>
                    </div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-[#8B5CF6] hover:text-[#7C3AED]">
                            <Info className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-[#1A1D2E] text-white">
                          <p className="text-sm">{decision.whyRecalled}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <p className="text-sm text-[#1A1D2E] mb-4">
                    {decision.context}
                  </p>

                  {/* Confidence Gauges */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-[#6B7280]">
                          Confidence
                        </span>
                        <span className="text-xs font-semibold text-[#2D4B9E]">
                          {decision.confidence}%
                        </span>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${decision.confidence}%` }}
                          transition={{
                            duration: 0.8,
                            delay: index * 0.1 + 0.3,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          className="h-full bg-gradient-to-r from-[#2D4B9E] to-[#5B75D8] rounded-full"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-[#6B7280]">
                          Relevance
                        </span>
                        <span className="text-xs font-semibold text-[#8B5CF6]">
                          {decision.relevanceScore}%
                        </span>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${decision.relevanceScore}%` }}
                          transition={{
                            duration: 0.8,
                            delay: index * 0.1 + 0.4,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* References */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-[#6B7280] mb-2">
                      References
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {decision.references.map((ref, refIndex) => (
                        <span
                          key={refIndex}
                          className="px-2 py-1 text-xs bg-white text-[#2D4B9E] rounded border border-[rgba(45,75,158,0.2)]"
                        >
                          {ref}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex-1"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Apply as Precedent
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#8B5CF6] text-[#8B5CF6] hover:bg-[#F3E8FF]"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
