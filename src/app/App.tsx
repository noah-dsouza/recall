import { useState } from "react";
import { LoginPage } from "./components/LoginPage";
import { Sidebar } from "./components/Sidebar";
import { ProjectsDashboard } from "./components/ProjectsDashboard";
import { ProjectView } from "./components/ProjectView";
import { TeamsPage } from "./components/TeamsPage";
import { InsightsPage } from "./components/InsightsPage";

type Page = "login" | "projects" | "teams" | "insights" | `project-${string}`;

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleLogin = () => setCurrentPage("projects");

  const handleLogout = () => {
    setCurrentPage("login");
    setSelectedProjectId(null);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    if (page !== "projects") setSelectedProjectId(null);
  };

  // clicking an existing project card
  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPage(`project-${projectId}`);
  };

  // NEW: dashboard creates a thread -> open it immediately
  const handleCreateProject = (threadId: string) => {
    setSelectedProjectId(threadId);
    setCurrentPage(`project-${threadId}`);
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setCurrentPage("projects");
  };

  if (currentPage === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {currentPage === "projects" && (
        <ProjectsDashboard
          onProjectClick={handleProjectClick}
          onCreateProject={handleCreateProject}
        />
      )}

      {currentPage.startsWith("project-") && selectedProjectId && (
        <ProjectView
          projectId={selectedProjectId}
          onBack={handleBackToProjects}
        />
      )}

      {currentPage === "teams" && <TeamsPage />}
      {currentPage === "insights" && <InsightsPage />}
    </div>
  );
}
