import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Upload, FileText, CheckCircle2, Loader2, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

// CHANGE THIS IMPORT PATH if your api helper is elsewhere
import { askThread } from "../lib/api";

interface DocumentUploadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDecision: (decision: ExtractedDecision) => void;
  threadId: string;
}

export interface ExtractedDecision {
  id: string;
  title: string;
  rationale: string;
  confidence: number;
  source: string;
}

type UploadState = "upload" | "analyzing" | "complete";

const analysisSteps = [
  { label: "Uploading", key: "uploading" },
  { label: "Analyzing", key: "analyzing" },
  { label: "Extracting decisions", key: "extracting" },
];

const mockExtractedDecisions: ExtractedDecision[] = [
  {
    id: "ext-1",
    title: "Adopt microservices architecture for user service",
    rationale:
      "To improve scalability and enable independent deployment cycles, we decided to split the monolithic user service into separate microservices. This allows teams to work independently and reduces deployment risks.",
    confidence: 92,
    source: "Platform_Redesign_RFC.pdf",
  },
  {
    id: "ext-2",
    title: "Implement OAuth 2.0 for authentication",
    rationale:
      "After security audit findings, we chose OAuth 2.0 over custom JWT implementation. This provides better security guarantees and reduces maintenance burden by leveraging proven standards.",
    confidence: 88,
    source: "Platform_Redesign_RFC.pdf",
  },
  {
    id: "ext-3",
    title: "Use PostgreSQL for primary data store",
    rationale:
      "PostgreSQL was selected over MongoDB for its ACID compliance, strong consistency guarantees, and excellent support for complex queries. The relational model better fits our data structure.",
    confidence: 85,
    source: "Platform_Redesign_RFC.pdf",
  },
];

const documentTypes = [
  { value: "RFC", label: "RFC / Design Doc" },
  { value: "MEETING_NOTES", label: "Meeting Notes" },
  { value: "PRD", label: "PRD / Requirements" },
  { value: "POSTMORTEM", label: "Postmortem" },
  { value: "OTHER", label: "Other" },
];

export function DocumentUploadDrawer({ isOpen, onClose, onSaveDecision, threadId }: DocumentUploadDrawerProps) {
  const [uploadState, setUploadState] = useState<UploadState>("upload");
  const [currentStep, setCurrentStep] = useState(0);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const [docType, setDocType] = useState<(typeof documentTypes)[number]["value"]>("RFC");

  const [extractedDecisions, setExtractedDecisions] = useState<ExtractedDecision[]>([]);
  const [savedDecisionIds, setSavedDecisionIds] = useState<Set<string>>(new Set());
  const [ignoredDecisionIds, setIgnoredDecisionIds] = useState<Set<string>>(new Set());

  const [savingId, setSavingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const analysisProgress = Math.min((currentStep / analysisSteps.length) * 100, 100);
  const activeStageLabel = analysisSteps[Math.min(currentStep, analysisSteps.length - 1)].label;

  const handleReset = useCallback(() => {
    setUploadState("upload");
    setCurrentStep(0);
    setFileName("");
    setDocType("RFC");
    setExtractedDecisions([]);
    setSavedDecisionIds(new Set());
    setIgnoredDecisionIds(new Set());
    setSavingId(null);
    setSaveError(null);
  }, []);

  useEffect(() => {
    if (!isOpen) handleReset();
  }, [isOpen, handleReset]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  }, []);

  const handleFile = (file: File) => {
    setFileName(file.name);
    setSaveError(null);
  };

  const handleUploadAndAnalyze = async () => {
    if (!fileName) return;
    setSaveError(null);

    setUploadState("analyzing");
    setCurrentStep(0);

    const documentName = fileName;

    for (let i = 0; i < analysisSteps.length; i++) {
      // simulated steps
      await new Promise((resolve) => setTimeout(resolve, 900));
      setCurrentStep(i + 1);
    }

    await new Promise((resolve) => setTimeout(resolve, 350));

    // demo: keep mock decisions, just stamp source to the selected file
    setExtractedDecisions(
      mockExtractedDecisions.map((decision) => ({
        ...decision,
        id: `${decision.id}-${Date.now()}`, // avoid collisions between uploads
        source: documentName || decision.source,
      }))
    );
    setUploadState("complete");
  };

  const handleSave = async (decision: ExtractedDecision) => {
    if (savedDecisionIds.has(decision.id)) return;

    setSaveError(null);
    setSavingId(decision.id);

    try {
      // This is the key: write to your backend memory system
      const prompt = [
        `Document type: ${docType}`,
        `Source file: ${decision.source}`,
        ``,
        `Decision record: ${decision.title}`,
        `Rationale: ${decision.rationale}`,
        `Confidence: ${decision.confidence}%`,
        ``,
        `Save this as institutional memory for this thread. Keep it concise and factual.`,
      ].join("\n");

      await askThread(threadId, prompt);

      setSavedDecisionIds((prev) => {
        const next = new Set(prev);
        next.add(decision.id);
        return next;
      });

      // update UI ledger/timeline
      onSaveDecision(decision);
    } catch (err) {
      console.error(err);
      setSaveError("Backend save failed. Is your backend running on :3000?");
    } finally {
      setSavingId(null);
    }
  };

  const handleIgnore = (decisionId: string) => {
    if (ignoredDecisionIds.has(decisionId)) return;
    setIgnoredDecisionIds((prev) => {
      const next = new Set(prev);
      next.add(decisionId);
      return next;
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-50 overflow-auto"
          >
            <div className="sticky top-0 bg-white border-b border-[rgba(0,0,0,0.08)] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-xl font-semibold text-[#1A1D2E]">Analyze Document</h2>
                <p className="text-sm text-[#6B7280]">
                  Upload a document to extract decisions + rationale into memory.
                </p>

                <div className="mt-2 text-xs text-[#6B7280]">
                  Thread: <span className="font-mono">{threadId}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-[#F8F9FA]">
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              {saveError && (
                <div className="mb-5 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-3 text-sm text-[#991B1B] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5" />
                  <div>{saveError}</div>
                </div>
              )}

              {/* UPLOAD */}
              {uploadState === "upload" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  {/* doc type */}
                  <div className="mb-4">
                    <p className="text-sm font-medium text-[#1A1D2E] mb-2">Document type</p>
                    <div className="relative">
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value as any)}
                        className="w-full rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#F8F9FA] px-3 py-2 text-sm text-[#1A1D2E] focus:outline-none focus:ring-2 focus:ring-[#2D4B9E]/40"
                      >
                        {documentTypes.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <p className="mt-2 text-xs text-[#6B7280]">
                      This helps Recall categorize decisions and show better “why it happened” context.
                    </p>
                  </div>

                  <div
                    className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2D4B9E] ${
                      dragActive ? "border-[#2D4B9E] bg-[#EEF2FF]" : "border-[rgba(0,0,0,0.1)] hover:border-[#2D4B9E]"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("document-upload-input")?.click()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        document.getElementById("document-upload-input")?.click();
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Upload a document for analysis"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#EEF2FF] flex items-center justify-center">
                      <Upload className="w-8 h-8 text-[#2D4B9E]" />
                    </div>
                    <h3 className="font-medium text-[#1A1D2E] mb-2">Drop your document here</h3>
                    <p className="text-sm text-[#6B7280] mb-4">or click to browse files</p>

                    <input
                      type="file"
                      id="document-upload-input"
                      className="hidden"
                      accept=".pdf,.docx,.txt"
                      onChange={handleFileInput}
                    />

                    <label htmlFor="document-upload-input" className="inline-block">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-[#2D4B9E] text-[#2D4B9E] hover:bg-[#EEF2FF]"
                      >
                        Browse Files
                      </Button>
                    </label>

                    <p className="text-xs text-[#6B7280] mt-4">Supported file types: PDF, DOCX, TXT</p>
                  </div>

                  {fileName && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-[#F8F9FA] rounded-lg flex items-center gap-3"
                    >
                      <FileText className="w-5 h-5 text-[#2D4B9E]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1D2E] truncate">{fileName}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setFileName("")}>
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}

                  <Button
                    className="w-full mt-6 bg-[#2D4B9E] hover:bg-[#253D82] text-white"
                    disabled={!fileName}
                    onClick={handleUploadAndAnalyze}
                  >
                    Upload & Analyze
                  </Button>
                </motion.div>
              )}

              {/* ANALYZING */}
              {uploadState === "analyzing" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#2D4B9E] to-[#5B75D8] flex items-center justify-center">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    </div>
                    <h3 className="text-center font-medium text-[#1A1D2E] mb-8">Analyzing your document</h3>

                    {fileName && (
                      <div className="mb-8 p-4 rounded-lg bg-[#F8F9FA] flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#2D4B9E]" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-[#6B7280] uppercase tracking-wide">Processing</p>
                          <p className="text-sm font-medium text-[#1A1D2E] truncate">{fileName}</p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {analysisSteps.map((step, index) => (
                        <motion.div
                          key={step.key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="flex items-center gap-3"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              currentStep > index
                                ? "bg-[#10B981] text-white"
                                : currentStep === index
                                ? "bg-[#2D4B9E] text-white"
                                : "bg-[#E8EAF0] text-[#6B7280]"
                            }`}
                          >
                            {currentStep > index ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm">{index + 1}</span>}
                          </div>

                          <span
                            className={`text-sm ${
                              currentStep >= index ? "text-[#1A1D2E] font-medium" : "text-[#6B7280]"
                            }`}
                          >
                            {step.label}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-8">
                      <div className="h-2 bg-[#E0E7FF] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${analysisProgress}%` }}
                          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                          className="h-full bg-gradient-to-r from-[#2D4B9E] to-[#5B75D8]"
                        />
                      </div>
                      <p className="text-xs text-center text-[#6B7280] mt-3">
                        {analysisProgress < 100 ? `${activeStageLabel}...` : "Finalizing results"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* COMPLETE */}
              {uploadState === "complete" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <div className="mb-6">
                    <h3 className="font-semibold text-[#1A1D2E] mb-1">Detected Decisions</h3>
                    <p className="text-sm text-[#6B7280]">Review and confirm what should be saved as institutional memory</p>

                    <div className="mt-4 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#F8F9FA] p-4">
                      <p className="text-xs uppercase tracking-wide text-[#6B7280] mb-2">Metadata</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-[#6B7280]">Document type</p>
                          <p className="text-sm font-medium text-[#1A1D2E]">
                            {documentTypes.find((t) => t.value === docType)?.label ?? docType}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-[#6B7280]">Filename</p>
                          <p className="text-sm font-medium text-[#1A1D2E] truncate">{fileName || "—"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {extractedDecisions.map((decision, index) => {
                      const isSaved = savedDecisionIds.has(decision.id);
                      const isIgnored = ignoredDecisionIds.has(decision.id);
                      const isHidden = isSaved || isIgnored;
                      const isSavingThis = savingId === decision.id;

                      return (
                        <motion.div
                          key={decision.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: isHidden ? 0 : 1,
                            y: isHidden ? -20 : 0,
                            x: isSaved ? -80 : isIgnored ? 80 : 0,
                            height: isHidden ? 0 : "auto",
                          }}
                          transition={{
                            duration: 0.4,
                            delay: isHidden ? 0 : index * 0.1,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          className={`bg-white rounded-lg p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border-l-4 border-[#8B5CF6] overflow-hidden ${
                            isHidden ? "pointer-events-none" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-[#1A1D2E] flex-1">{decision.title}</h4>
                          </div>

                          <div className="mb-4">
                            <p className="text-xs font-medium text-[#6B7280] mb-1">Extracted rationale</p>
                            <p className="text-sm text-[#1A1D2E]">{decision.rationale}</p>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium text-[#6B7280]">Confidence</span>
                              <span className="text-xs font-semibold text-[#8B5CF6]">{decision.confidence}%</span>
                            </div>
                            <div className="h-2 bg-[#F3E8FF] rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${decision.confidence}%` }}
                                transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: [0.4, 0, 0.2, 1] }}
                                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] rounded-full"
                              />
                            </div>
                          </div>

                          <div className="mb-4">
                            <p className="text-xs text-[#6B7280]">
                              From: <span className="font-medium">{decision.source}</span>
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex-1"
                              onClick={() => handleSave(decision)}
                              disabled={isSavingThis}
                            >
                              {isSavingThis ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-4 h-4 mr-2" />
                                  Save to Memory
                                </>
                              )}
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[rgba(0,0,0,0.1)] text-[#6B7280] hover:bg-[#F8F9FA]"
                              onClick={() => handleIgnore(decision.id)}
                              disabled={isSavingThis}
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Ignore
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {extractedDecisions.length > 0 &&
                    extractedDecisions.every((d) => savedDecisionIds.has(d.id) || ignoredDecisionIds.has(d.id)) && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
                        </div>
                        <h3 className="font-medium text-[#1A1D2E] mb-2">All decisions processed</h3>
                        <p className="text-sm text-[#6B7280] mb-6">
                          {savedDecisionIds.size} decisions saved to institutional memory
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                          <Button
                            variant="outline"
                            onClick={handleReset}
                            className="border-[#2D4B9E] text-[#2D4B9E] hover:bg-[#EEF2FF]"
                          >
                            Analyze Another Document
                          </Button>
                          <Button
                            onClick={onClose}
                            className="bg-[#2D4B9E] hover:bg-[#253D82] text-white"
                          >
                            Back to Workspace
                          </Button>
                        </div>
                      </motion.div>
                    )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
