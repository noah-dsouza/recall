import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, FolderOpen, Clock, Users, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { createProjectThread } from "../lib/backend";

interface Project {
  id: string;
  name: string;
  description: string;
  lastActivity: string;
  teamMembers: number;
  decisionsCount: number;
  color: string;
}

interface ProjectsDashboardProps {
  onProjectClick: (projectId: string) => void;
  onCreateProject: (threadId: string) => void; // ✅ NEW
}

const gradientOptions = [
  "from-[#2D4B9E] to-[#5B75D8]",
  "from-[#5B75D8] to-[#8B5CF6]",
  "from-[#8B5CF6] to-[#A78BFA]",
];

const initialProjects: Project[] = [
  {
    id: "1",
    name: "Platform Redesign Q1",
    description: "Complete overhaul of the user experience and visual design system",
    lastActivity: "2 hours ago",
    teamMembers: 8,
    decisionsCount: 24,
    color: gradientOptions[0],
  },
  {
    id: "2",
    name: "API Gateway Migration",
    description: "Moving from monolithic architecture to microservices",
    lastActivity: "5 hours ago",
    teamMembers: 6,
    decisionsCount: 18,
    color: gradientOptions[1],
  },
  {
    id: "3",
    name: "Mobile App Launch",
    description: "iOS and Android native applications for Q2 release",
    lastActivity: "1 day ago",
    teamMembers: 12,
    decisionsCount: 31,
    color: gradientOptions[2],
  },
  {
    id: "4",
    name: "Security Audit & Compliance",
    description: "SOC 2 Type II certification and security hardening",
    lastActivity: "2 days ago",
    teamMembers: 5,
    decisionsCount: 15,
    color: gradientOptions[0],
  },
];

export function ProjectsDashboard({ onProjectClick, onCreateProject }: ProjectsDashboardProps) {
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);
  const [showCreateDrawer, setShowCreateDrawer] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectObjective, setProjectObjective] = useState("");
  const [collaboratorInput, setCollaboratorInput] = useState("");
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const resetForm = () => {
    setProjectName("");
    setProjectDescription("");
    setProjectObjective("");
    setCollaboratorInput("");
    setCollaborators([]);
    setCreateError(null);
  };

  const handleAddCollaborator = () => {
    const cleaned = collaboratorInput.trim();
    if (!cleaned) return;
    setCollaborators((prev) => (prev.includes(cleaned) ? prev : [...prev, cleaned]));
    setCollaboratorInput("");
  };

  const handleRemoveCollaborator = (email: string) => {
    setCollaborators((prev) => prev.filter((entry) => entry !== email));
  };

  const handleCollaboratorKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      handleAddCollaborator();
    }
  };

  const handleCreateProject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!projectName.trim()) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      // ✅ REAL: backend creates thread_id
      const threadId = await createProjectThread();

      const collaboratorCount = Math.max(collaborators.length, 1);
      const color = gradientOptions[projectList.length % gradientOptions.length] || gradientOptions[0];
      const summary = projectDescription.trim() || "Institutional memory is being set up for this initiative.";
      const enrichedDescription = projectObjective.trim()
        ? `${summary} Focus: ${projectObjective.trim()}.`
        : summary;

      const newProject: Project = {
        id: threadId, // ✅ IMPORTANT: id IS thread_id
        name: projectName.trim(),
        description: enrichedDescription,
        lastActivity: "Just now",
        teamMembers: collaboratorCount,
        decisionsCount: 0,
        color,
      };

      setProjectList((prev) => [newProject, ...prev]);
      setShowCreateDrawer(false);
      resetForm();

      // ✅ Immediately open the project view for this thread
      onCreateProject(threadId);
    } catch (err: any) {
      console.error(err);
      setCreateError(err?.message || "Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-[#1A1D2E] mb-2">Projects</h1>
                <p className="text-[#6B7280]">Track decisions and institutional memory across your projects</p>
              </div>
              <Button
                className="bg-[#2D4B9E] hover:bg-[#253D82] text-white flex items-center gap-2"
                onClick={() => setShowCreateDrawer(true)}
              >
                <Plus className="w-5 h-5" />
                New Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projectList.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ y: -4 }}
                  onClick={() => onProjectClick(project.id)}
                  className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center`}>
                      <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1A1D2E] mb-1">{project.name}</h3>
                      <p className="text-sm text-[#6B7280] line-clamp-2">{project.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-[#6B7280]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{project.lastActivity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{project.teamMembers} members</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[rgba(0,0,0,0.08)]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6B7280]">Decision ledger</span>
                      <span className="text-sm font-medium text-[#2D4B9E]">{project.decisionsCount} decisions</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-[#E8EAF0] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((project.decisionsCount / 40) * 100, 100)}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className={`h-full bg-gradient-to-r ${project.color}`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showCreateDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => {
                if (!isCreating) {
                  setShowCreateDrawer(false);
                  resetForm();
                }
              }}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-50 overflow-auto"
            >
              <div className="sticky top-0 bg-white border-b border-[rgba(0,0,0,0.08)] px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#6B7280]">Launch new workspace</p>
                  <h2 className="text-xl font-semibold text-[#1A1D2E]">Create project</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-[#F8F9FA]"
                  onClick={() => {
                    if (!isCreating) {
                      setShowCreateDrawer(false);
                      resetForm();
                    }
                  }}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleCreateProject} className="p-6 space-y-6">
                {createError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {createError}
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-[#1A1D2E] mb-1">Project name</p>
                  <p className="text-xs text-[#6B7280] mb-3">What initiative do you want Recall to track?</p>
                  <Input
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                    placeholder="e.g. Customer Trust Modernization"
                    className="bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]"
                    autoFocus
                    required
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-[#1A1D2E] mb-1">Executive summary</p>
                  <p className="text-xs text-[#6B7280] mb-3">Summarize what success looks like for this program.</p>
                  <Textarea
                    value={projectDescription}
                    onChange={(event) => setProjectDescription(event.target.value)}
                    placeholder="Outline scope, outcomes, and risks..."
                    className="bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]"
                    rows={4}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-[#1A1D2E] mb-1">Decision focus</p>
                  <p className="text-xs text-[#6B7280] mb-3">Optional tag that lets Recall prioritize ledger insights.</p>
                  <Input
                    value={projectObjective}
                    onChange={(event) => setProjectObjective(event.target.value)}
                    placeholder="e.g. Modernize authentication, improve NPS"
                    className="bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-[#1A1D2E]">Invite collaborators</p>
                      <p className="text-xs text-[#6B7280]">Teammates gain access to document uploads & the ledger.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={collaboratorInput}
                      onChange={(event) => setCollaboratorInput(event.target.value)}
                      onKeyDown={handleCollaboratorKeyDown}
                      placeholder="pat@enterprise.com"
                      className="bg-[#F8F9FA] border-[rgba(0,0,0,0.08)]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-[#2D4B9E] text-[#2D4B9E] hover:bg-[#EEF2FF]"
                      onClick={handleAddCollaborator}
                    >
                      Invite
                    </Button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 min-h-[2.5rem]">
                    {collaborators.length === 0 && (
                      <p className="text-xs text-[#9CA3AF]">Add at least one collaborator to share this space.</p>
                    )}
                    {collaborators.map((email) => (
                      <span
                        key={email}
                        className="px-3 py-1.5 text-xs rounded-full bg-[#EEF2FF] text-[#2D4B9E] flex items-center gap-2"
                      >
                        {email}
                        <button
                          type="button"
                          onClick={() => handleRemoveCollaborator(email)}
                          className="text-[#6B7280] hover:text-[#1A1D2E]"
                          aria-label={`Remove ${email}`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-dashed border-[#C7D2FE] rounded-lg p-4 bg-[#F8FAFF] text-xs text-[#4C51BF]">
                  Recall automatically indexes uploaded documents and adds high-confidence decisions to your institutional memory.
                  You can always edit or remove entries later.
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="text-sm text-[#6B7280] hover:text-[#1A1D2E]"
                    onClick={() => {
                      resetForm();
                      setShowCreateDrawer(false);
                    }}
                    disabled={isCreating}
                  >
                    Cancel
                  </button>

                  <Button
                    type="submit"
                    className="bg-[#2D4B9E] hover:bg-[#253D82] text-white"
                    disabled={!projectName.trim() || collaborators.length === 0 || isCreating}
                  >
                    {isCreating ? "Creating..." : "Launch Workspace"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
