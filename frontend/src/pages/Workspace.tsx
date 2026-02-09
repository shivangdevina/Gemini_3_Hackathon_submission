import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getEasingForSegment, motion } from "framer-motion";
import axios from "axios"
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/contexts/AuthContext";
import {
  Plus,
  ChevronRight,
  Users,
  Search as SearchIcon,
  Lightbulb,
  FileText,
  Code,
  Sparkles,
  Clock,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Share2,
  Link2,
  MessageCircle,
  Send,
  Pencil
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/hooks/use-toast";
import { UUID } from "crypto";
import { WorkspaceLoading } from "@/components/WorkspaceLoading";
function getStageLabel(stage: number) {
  const labels: Record<number, string> = {
    1: "Manage Team",
    2: "Research",
    3: "Ideation",
    4: "PRD",
    5: "Implementation",
  };
  return labels[stage] || "Unknown";
}

interface TeamMember {
  user_id: string;
  name: string;
  role?: string;
  //avatar_url?: string;
}
interface Project {
  id: number;
  name: string;
  hackathon: string;
  stage: number;
  stageLabel: string;
  members: number;
  deadline: string;
  daysLeft: number;
  progress: number;
}

const initialProjects: Project[] = [
  {
    id: 1,
    name: "AI Mental Health Companion",
    hackathon: "AI Innovation Challenge 2026",
    stage: 3,
    stageLabel: "Ideation",
    members: 4,
    deadline: "Feb 15, 2026",
    daysLeft: 13,
    progress: 45,
  },
  {
    id: 2,
    name: "EcoTrack 2.0",
    hackathon: "Climate Tech Sprint",
    stage: 1,
    stageLabel: "Manage Team",
    members: 2,
    deadline: "Feb 28, 2026",
    daysLeft: 26,
    progress: 15,
  },
];

const stages = [
  { id: 1, name: "Manage Team", icon: Users, description: "Build your dream team" },
  { id: 2, name: "Research", icon: SearchIcon, description: "Gather insights" },
  { id: 3, name: "Ideation", icon: Lightbulb, description: "Brainstorm solutions" },
  { id: 4, name: "PRD", icon: FileText, description: "Define requirements" },
  { id: 5, name: "Implementation", icon: Code, description: "Build & ship" },
];

export default function Workspace() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, email, role } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectError, setProjectError] = useState<string | null>(null);

  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const [project1, setProject1] = useState<number | null>(null);
  // const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);











  // all projects
  useEffect(() => {
    console.log("PROJECT STATE UPDATED:", projects);
  }, [projects])
  //   useEffect(() => {
  //   axios
  //     .get(`http://localhost:8000/project/${project.id}/team-members`)
  //     .then(res => setTeamMembers(res.data.members))
  //     .catch(() => toast({ title: "Failed to load team", variant: "destructive" }));
  // }, [selectedProject]);

  useEffect(() => {
    console.log("PROJECT STATE UPDATED:", selectedProject);
  }, [selectedProject])
  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        setLoadingProjects(true);
        setProjectError(null);

        //const userId = "efc98355-2b51-4734-a060-dbbf3b74d04a";

        const res = await axios.get("http://localhost:8000/project/user-projects", {
          params: { query: userId }
        });

        console.log("API RESPONSE:", res.data);

        const backendProjects = res.data?.projects || [];

        const formatted: Project[] = backendProjects.map((p: any) => {
          const stageNumber = Number(p.stage_label) || 1;

          return {
            id: p.project_id,
            name: p.project_name,
            hackathon: p.hackathon_name,
            stage: stageNumber,
            stageLabel: getStageLabel(stageNumber), // ✅ derive on frontend
            members: 1,
            deadline: "—",
            daysLeft: 0,
            progress: Math.round((stageNumber / 5) * 100),
          };
        });

        setProjects(formatted);

      } catch (err: any) {
        console.error("FETCH PROJECTS ERROR:", err);
        console.error("SERVER RESPONSE:", err?.response?.data);
        setProjectError("Failed to load projects");
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchUserProjects();

  }, []);

  // Handle new project from Explore page (supports backend id via selectedProjectId)
  useEffect(() => {
    const state = location.state as
      | {
        newProject?: { hackathonId: number; hackathonName: string; deadline: string; daysLeft: number; projectName?: string };
        selectedProjectId?: string | number;
      }
      | null;

    if (state?.selectedProjectId) {
      // If backend returned an ID, use it as the selected project so subsequent team fetches use the real id
      const backendId = state.selectedProjectId as string | number;

      const newProject: Project = {
        id: (backendId as any) || Date.now(),
        name: state.newProject?.projectName || state.newProject?.hackathonName || "New Project",
        hackathon: state.newProject?.hackathonName || "",
        stage: 1,
        stageLabel: "Manage Team",
        members: 1,
        deadline: state.newProject?.deadline || "—",
        daysLeft: state.newProject?.daysLeft || 0,
        progress: 0,
      };

      setProjects((prev) => [newProject, ...prev]);
      setSelectedProject(backendId as any);

      // Clear navigation state so reload doesn't reapply
      navigate(location.pathname, { replace: true, state: null });
      return;
    }

    if (state?.newProject) {
      const { hackathonName, deadline, daysLeft, projectName } = state.newProject;

      // Create a temporary client-side project until backend data is available
      const newProject: Project = {
        id: Date.now(),
        name: projectName || "New Project",
        hackathon: hackathonName,
        stage: 1,
        stageLabel: "Manage Team",
        members: 1,
        deadline,
        daysLeft,
        progress: 0,
      };

      setProjects((prev) => [newProject, ...prev]);
      setSelectedProject(newProject.id);

      // Clear the navigation state to prevent re-creating on refresh
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, navigate, location.pathname]);

  const handleUpdateProjectName = (projectId: number, newName: string) => {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, name: newName } : p
    ));
  };


  if (selectedProject) {
    const project = projects.find(p => p.id === selectedProject);







    if (project) {
      return (
        <ProjectWorkspace
          projectId={selectedProject}
          project={project}
          onBack={() => setSelectedProject(null)}
          onUpdateName={(newName) => handleUpdateProjectName(selectedProject, newName)}
        />
      );
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-2"
            >
              AI <span className="text-gradient">Co-Pilot</span> Workspace
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Manage your hackathon projects with AI-powered assistance
            </motion.p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => setSelectedProject(project.id)}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  {editingProjectId === project.id ? (
                    <Input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => {
                        if (editingName.trim()) {
                          setProjects(prev => prev.map(p =>
                            p.id === project.id ? { ...p, name: editingName.trim() } : p
                          ));
                        }
                        setEditingProjectId(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (editingName.trim()) {
                            setProjects(prev => prev.map(p =>
                              p.id === project.id ? { ...p, name: editingName.trim() } : p
                            ));
                          }
                          setEditingProjectId(null);
                        } else if (e.key === "Escape") {
                          setEditingProjectId(null);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                      className="h-8 text-lg font-semibold"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                        {project.name}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProjectId(project.id);
                          setEditingName(project.name);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-secondary transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">{project.hackathon}</p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 shrink-0 ml-2">
                  {project.stageLabel}
                </Badge>
              </div>

              {/* Progress Stepper */}
              <div className="flex items-center gap-1 mb-4">
                {stages.map((stage, i) => (
                  <div key={stage.id} className="flex items-center flex-1">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0",
                      i + 1 < project.stage && "bg-success text-success-foreground",
                      i + 1 === project.stage && "bg-primary text-primary-foreground",
                      i + 1 > project.stage && "bg-secondary text-muted-foreground"
                    )}>
                      {i + 1 < project.stage ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    {i < stages.length - 1 && (
                      <div className={cn(
                        "h-0.5 flex-1 mx-1",
                        i + 1 < project.stage ? "bg-success" : "bg-secondary"
                      )} />
                    )}
                  </div>
                ))}
              </div>

              {/* Meta: keep only Open action (removed deadline and members count) */}
              <div className="flex items-center justify-end text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" className="gap-1 group-hover:text-primary">
                  Open
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}

        </div>
      </div>
    </MainLayout>
  );
}

// Project Workspace Component
interface ProjectWorkspaceProps {
  projectId: number;
  project: Project;
  onBack: () => void;
  onUpdateName: (newName: string) => void;
}

function ProjectWorkspace({ projectId, project, onBack, onUpdateName }: ProjectWorkspaceProps) {
  const [savedStage, setSavedStage] = useState(project.stage); // real DB progress
  const [viewStage, setViewStage] = useState(project.stage);   // what user is viewing
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  //const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);


  const handleSaveName = () => {
    if (editName.trim()) onUpdateName(editName.trim());
    else setEditName(project.name);
    setIsEditingName(false);
  };

  const advanceStage = async () => {
    // Only allow advancing if user is on real current stage
    if (viewStage !== savedStage) return;

    const nextStage = savedStage + 1;
    if (nextStage > 5) return;

    try {
      await axios.patch("http://localhost:8000/project/stage", {
        project_id: project.id,
        stage: nextStage,
      });

      setSavedStage(nextStage);
      setViewStage(nextStage);
      toast({ title: "Stage updated" });

    } catch (err) {
      toast({ title: "Failed to update stage", variant: "destructive" });
    }
  };

  const fetchTeamMembers = async () => {
    if (!projectId) return;

    const maxRetries = 6;
    const delayMs = 500;

    try {
      setTeamLoading(true);

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const res = await axios.get(`http://localhost:8000/project/${projectId}/team-members`);
          const members = res.data || [];
          setTeamMembers(members);

          // If we got members (or even an empty array but request succeeded), stop retrying
          return;
        } catch (innerErr) {
          // If not last attempt, wait and retry
          if (attempt < maxRetries) {
            // small delay
            await new Promise((r) => setTimeout(r, delayMs));
            continue;
          }
          // last attempt failed
          throw innerErr;
        }
      }
    } catch (err) {
      console.error("Failed to fetch team members after retries", err);
      toast({ title: "Failed to load team members", variant: "destructive" });
    } finally {
      setTeamLoading(false);
    }
  };

  useEffect(() => {
    // Fetch team members whenever projectId changes; if backend hasn't created the team yet
    // the fetchTeamMembers function will retry a few times before giving up.
    fetchTeamMembers();
  }, [projectId]);


  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back
          </Button>
          <div className="flex-1">
            {isEditingName ? (
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleSaveName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveName();
                  if (e.key === "Escape") setIsEditingName(false);
                }}
                autoFocus
                className="text-2xl font-bold h-10 max-w-md"
              />
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <Pencil
                  className="w-4 h-4 cursor-pointer text-muted-foreground"
                  onClick={() => setIsEditingName(true)}
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground">{project.hackathon}</p>
          </div>
        </div>

        {/* Stage Stepper */}
        <div className="bg-card border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            {stages.map((stage, i) => {
              const StageIcon = stage.icon;
              const stageNum = i + 1;

              const isCompleted = stageNum < savedStage;
              const isCurrent = stageNum === savedStage;   // actual progress
              const isViewing = stageNum === viewStage;    // what user opened

              return (
                <div key={stage.id} className="flex items-center flex-1">
                  <button
                    onClick={() => {
                      if (stageNum <= savedStage) setViewStage(stageNum);
                    }}
                    disabled={stageNum > savedStage}
                    className={cn(
                      "flex flex-col items-center gap-2 px-4 py-2 rounded-lg transition-all",
                      isViewing && "ring-2 ring-primary/40",
                      isCurrent && "bg-primary/10",
                      stageNum <= savedStage && "cursor-pointer hover:bg-secondary",
                      stageNum > savedStage && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      isCompleted && "bg-success text-success-foreground",
                      isCurrent && "bg-primary text-primary-foreground glow-primary",
                      !isCompleted && !isCurrent && "bg-secondary text-muted-foreground"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <StageIcon className="w-5 h-5" />}
                    </div>

                    <p className={cn("text-sm font-medium", isCurrent && "text-primary")}>
                      {stage.name}
                    </p>
                  </button>

                  {i < stages.length - 1 && (
                    <div className={cn("h-0.5 flex-1 mx-2", isCompleted ? "bg-success" : "bg-secondary")} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Stage Content */}
        <StageContent
          stage={viewStage}
          onAdvance={advanceStage}
          isLocked={viewStage !== savedStage}
          projectId={project.id}
          teamMembers={teamMembers}
          refreshTeam={fetchTeamMembers}
        />
      </div>
    </MainLayout>
  );
}

interface StageContentProps {
  stage: number;
  onAdvance: () => void;
  isLocked: boolean;
  projectId: number;
  teamMembers: TeamMember[];
  refreshTeam: () => void;
}

function StageContent({ stage, onAdvance, isLocked, projectId, teamMembers, refreshTeam }: StageContentProps) {
  switch (stage) {
    case 1: return <ManageTeamStage onAdvance={onAdvance} disabled={isLocked} projectId={projectId} teamMembers={teamMembers}
      refreshTeam={refreshTeam} />;
    case 2: return <ResearchStage onAdvance={onAdvance} disabled={isLocked} projectId={projectId} teamMembers={teamMembers}
      refreshTeam={refreshTeam} />;
    case 3: return <IdeationStage onAdvance={onAdvance} disabled={isLocked} projectId={projectId} teamMembers={teamMembers}
      refreshTeam={refreshTeam} />; // ✅ added
    case 4: return <PRDStage onAdvance={onAdvance} disabled={isLocked} projectId={projectId} teamMembers={teamMembers}
      refreshTeam={refreshTeam} />; // ✅ added
    case 5: return <ImplementationStage onAdvance={onAdvance} disabled={isLocked} projectId={projectId} teamMembers={teamMembers} />;
    default: return null;
  }
}

// Stage 1: Manage Team
function ManageTeamStage({
  onAdvance,
  disabled,
  projectId,
  teamMembers,
}: {
  onAdvance: () => void;
  disabled?: boolean;
  projectId: number;
  teamMembers: TeamMember[];
}) {
  const { userId, email, role } = useAuth();
  const [problemStatement, setProblemStatement] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch existing problem statement (if any) when this stage loads
  useEffect(() => {
    let mounted = true;

    const fetchProblemStatement = async () => {
      if (!projectId) return;

      try {
        // Try a few possible GET endpoints the backend might expose
        const endpoints = [
          `http://localhost:8000/project/${projectId}/problem-statement`,
          //`http://localhost:8000/project/problem-statement?project_id=${projectId}`,
        ];

        for (const url of endpoints) {
          try {
            const res = await axios.get(url);
            const data = res.data;

            // Accept different response shapes
            const ps = data?.problem_statement;
            if (ps && mounted) {
              setProblemStatement(typeof ps === "string" ? ps : JSON.stringify(ps));
            }

            // Stop after first successful fetch
            return;
          } catch (err) {
            // try next endpoint
            continue;
          }
        }
      } catch (err) {
        console.error("Error fetching problem statement:", err);
      }
    };

    fetchProblemStatement();

    return () => {
      mounted = false;
    };
  }, [projectId]);

  const inviteLink = `${window.location.origin}/invite/${projectId}`;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Invite link copied!" });
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "Join my project", url: inviteLink });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-6">

        {/* 👥 TEAM MEMBERS SECTION */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Team Members</h3>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Member
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Invite Team Members</DialogTitle>
                  <DialogDescription>
                    Share this link with teammates to invite them to your project
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex-1 flex items-center gap-2 bg-secondary/50 border border-border rounded-lg px-3 py-2">
                      <Link2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm truncate">{inviteLink}</span>
                    </div>

                    <Button variant="outline" size="icon" onClick={handleCopyLink}>
                      {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="flex gap-2 w-full">
                    <Button onClick={handleCopyLink} className="flex-1 gap-2">
                      <Copy className="w-4 h-4" /> Copy Link
                    </Button>
                    <Button onClick={handleShare} variant="outline" className="flex-1 gap-2">
                      <Share2 className="w-4 h-4" /> Share
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* TEAM CARDS FROM API */}
          <div className="grid sm:grid-cols-2 gap-4">
            {teamMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No team members yet</p>
            ) : (
              teamMembers.map((member) => (
                <div key={member.user_id} className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role || "Member"}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 🧠 PROBLEM STATEMENT (YOUR ORIGINAL FEATURE) */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">Problem Statement</h3>
          <textarea
            placeholder="Define the problem you're solving..."
            value={problemStatement}
            onChange={(e) => setProblemStatement(e.target.value)}
            className="w-full h-32 bg-secondary/50 border border-border rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {/* 🚀 CONTINUE BUTTON (UNCHANGED LOGIC) */}
        <Button
          disabled={disabled || loading}
          onClick={async () => {
            if (!problemStatement.trim()) {
              toast({ title: "Problem statement required", variant: "destructive" });
              return;
            }

            try {
              setLoading(true);

              await axios.post("http://localhost:8000/project/problem-statement", {
                project_id: projectId,
                problem_statement: problemStatement,
              });

              await onAdvance();

            } catch {
              toast({ title: "Failed to save problem statement", variant: "destructive" });
            } finally {
              setLoading(false);
            }
          }}
          className="gap-2"
        >
          {loading ? "Saving..." : "Continue to Research"}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* RIGHT SIDE AI PANEL */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">AI Team Analysis</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          AI will analyze team skill gaps and suggest ideal roles to add.
        </p>
      </motion.div>
    </div>
  );
}

// Stage 2: Research
function ResearchStage({
  onAdvance,
  disabled,
  projectId,
  teamMembers,
}: {
  onAdvance: () => void;
  disabled?: boolean;
  projectId: number;
  teamMembers: TeamMember[];
}) {
  const { userId } = useAuth();
  const [teamData, setTeamData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const loggedInUserId = userId;

  useEffect(() => {
    fetchResearchOverview()
  }, [projectId]);

  const fetchResearchOverview = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:8000/research/${projectId}/todo`
      );


      const members = res.data.members || [];
      setTeamData(members);

      const hasTasks = members.some((m: any) => m.task?.length);

      // if (!hasTasks) {
      //   await fetchResearchOverview()
      // }

    } catch (err) {
      console.error("Failed loading research data", err);
    } finally {
      setLoading(false);
    }
  };


  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>, userId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const pdfup = await axios.post(
        `http://localhost:8000/uploadPdf/upload/${projectId}/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(pdfup)

      toast({ title: "PDF uploaded successfully" });
      //fetchResearchOverview();
      fetchResearchOverview()

    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    }
  };

  if (loading) return <WorkspaceLoading stage="research" message="Analyzing specific requirements and gathering resources..." />;

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Research Tasks</h3>

          <Button
            disabled={disabled || generating}
            onClick={fetchResearchOverview}
            variant="outline"
            size="sm"
          >
            {generating ? "Generating..." : "Regenerate Tasks"}
          </Button>
        </div>

        {/* Task Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {teamData.map((member) => (
            <div
              key={member.user_id}
              className="p-4 bg-secondary/50 border border-border rounded-lg space-y-3"
            >
              {/* Member Header */}
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center",
                    member.pdf_url ? "bg-success" : "bg-muted"
                  )}
                >
                  {member.pdf_url ? (
                    <CheckCircle2 className="w-4 h-4 text-success-foreground" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <span className="text-sm font-medium">{member.name}</span>
              </div>

              {/* Tasks */}
              {member.task?.length ? (
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {member.task.map((t: string, idx: number) => (
                    <li key={idx}>{t}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No task assigned</p>
              )}

              {/* Uploaded File Name */}
              {member.pdf_url != null && (
                <p className="text-xs text-primary truncate" title="Uploaded PDF">
                  📎 Research PDF Uploaded
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                {member.user_id === loggedInUserId && (
                  <label className="flex-1">
                    <input
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) => handlePdfUpload(e, member.user_id)}
                    />
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <span>{member.pdf_url != null ? "Replace PDF" : "Upload PDF"}</span>
                    </Button>
                  </label>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={member.pdf_url == null}
                  onClick={() => window.open(member.pdf_url, "_blank")}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-start">
        <Button disabled={disabled} onClick={onAdvance} className="gap-2">
          Continue to Ideation
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Stage 3: Ideation
function IdeationStage({ onAdvance, disabled, projectId }: {
  onAdvance: () => void;
  disabled?: boolean;
  projectId: string;
}) {
  const { userId, email, role } = useAuth();
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>([]);
  const [pitch, setPitch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch every time stage opens
  useEffect(() => {
    fetchIdeationData();
  }, [projectId]);

  const fetchIdeationData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`http://localhost:8000/ideation/qna/${projectId}`);
      // const res = await axios.get(`http://localhost:8000/project/ideation/qna/81c52ab7-c643-46b8-9031-4a6727300b1d`);



      const data = res.data;

      setPitch(data.pitch || "");
      setQuestions(data.qna || []);
    } catch {
      toast({ title: "Failed to load ideation data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index: number, value: string) => {
    setQuestions(prev => prev.map((q, i) => i === index ? { ...q, answer: value } : q));
  };

  const allFilled = pitch.trim() && questions.every(q => q.answer.trim());

  const handleGeneratePRD = async () => {
    if (!allFilled) {
      toast({ title: "Please complete all answers and pitch", variant: "destructive" });
      return;
    }

    try {
      setSaving(true);

      const res = await axios.get(`http://localhost:8000/prd/generate-prd/${projectId}`);

      // backend returns PRD
      // await axios.post("http://localhost:8000/prd/save-prd", {
      //   project_id: projectId,
      //   prd: res.data.prd
      // });

      await onAdvance(); // move to PRD stage

    } catch {
      toast({ title: "Failed to generate PRD", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <WorkspaceLoading stage="ideation" message="Generating innovative solutions and pitch drafts..." />;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Questions Panel */}
      <div className="space-y-4">
        <h3 className="font-semibold">Brainstorming Questions</h3>
        {questions.map((q, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm font-medium mb-2">{index + 1}. {q.question}</p>
            <textarea
              placeholder="Your answer..."
              value={q.answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              className="w-full h-24 bg-secondary/50 border border-border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        ))}
      </div>

      {/* Project Pitch */}
      <div className="space-y-4">
        <h3 className="font-semibold">Project Pitch</h3>
        <div className="bg-card border border-border rounded-xl p-6 h-[calc(100%-2rem)]">
          <p className="text-sm text-muted-foreground mb-4">
            Summarize your complete project including architecture, tech stack, and user flow.
          </p>
          <textarea
            placeholder="Write your complete project pitch here..."
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            className="w-full h-64 bg-secondary/50 border border-border rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="gap-2">
              <Sparkles className="w-4 h-4" />
              AI Suggestions
            </Button>
            <Button onClick={handleGeneratePRD} disabled={disabled || saving} className="gap-2 ml-auto">
              {saving ? "Generating..." : "Generate PRD"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stage 4: PRD
function PRDStage({ onAdvance, disabled, projectId }: {
  onAdvance: () => void;
  disabled?: boolean;
  projectId: string;
}) {
  const { userId, email, role } = useAuth();
  const { toast } = useToast();
  const [prdContent, setPrdContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPRD();
  }, [projectId]);

  const fetchPRD = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/prd/${projectId}`);

      // const res = await axios.get(`http://localhost:8000/prd/81c52ab7-c643-46b8-9031-4a6727300b1d`);

      setPrdContent(res.data.prd || "");
    } catch {
      toast({ title: "Failed to load PRD", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([prdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PRD.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <WorkspaceLoading stage="prd" message="Structuring product requirements and specifications..." />;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold">Product Requirements Document</h3>
        <Button variant="outline" size="sm" onClick={handleDownload}>Download</Button>
      </div>

      <div className="prose prose-sm prose-invert max-w-none">
        <div className="bg-secondary/50 rounded-lg p-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {prdContent}
          </ReactMarkdown>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button onClick={onAdvance} className="gap-2">
          Start Implementation
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

// Stage 5: Implementation
// Stage 5: Implementation
interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: Date;
}

interface Task {
  name: string;
  done: boolean;
  comments: Comment[];
}

interface MemberTasks {
  id: string | number;
  member: string;
  role: string;
  tasks: Task[];
}

function ImplementationStage({ projectId }: { projectId: number | string }) {
  const [tasks, setTasks] = useState<MemberTasks[]>([]);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Mock data for fallback (when using mock project IDs)
    const mockTasks: MemberTasks[] = [
      {
        id: 1, member: "Alex Chen", role: "Full Stack", tasks: [
          { name: "Set up project structure", done: true, comments: [] },
          {
            name: "Configure authentication", done: true, comments: [
              { id: "1", author: "You", text: "Looking good! Let me know if you need help with OAuth.", timestamp: new Date(Date.now() - 3600000) }
            ]
          },
          { name: "Implement API routes", done: false, comments: [] },
        ]
      },
      {
        id: 2, member: "Sarah Kim", role: "ML Engineer", tasks: [
          { name: "Set up OpenAI integration", done: true, comments: [] },
          { name: "Implement sentiment analysis", done: false, comments: [] },
          { name: "Train custom prompts", done: false, comments: [] },
        ]
      },
      {
        id: 3, member: "Marcus Johnson", role: "Frontend", tasks: [
          { name: "Build chat UI", done: true, comments: [] },
          { name: "Create dashboard", done: true, comments: [] },
          {
            name: "Add animations", done: false, comments: [
              { id: "2", author: "Emily Zhang", text: "Can you use framer-motion for this?", timestamp: new Date(Date.now() - 7200000) }
            ]
          },
        ]
      },
      {
        id: 4, member: "Emily Zhang", role: "Backend", tasks: [
          { name: "Design database schema", done: true, comments: [] },
          { name: "Set up Supabase", done: true, comments: [] },
          { name: "Implement RLS policies", done: false, comments: [] },
        ]
      },
    ];

    if (typeof projectId === 'number') {
      setTasks(mockTasks);
    } else {
      const fetchTeam = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:8000/project/${projectId}/team-members`);
          if (!response.ok) {
            throw new Error("Failed to fetch team members");
          }
          const data = await response.json();
          const mappedMembers: MemberTasks[] = data.map((m: any) => ({
            id: m.user_id,
            member: m.name,
            role: m.role,
            tasks: [
              { name: "Initial setup", done: false, comments: [] },
              { name: "Review project requirements", done: false, comments: [] }
            ]
          }));
          setTasks(mappedMembers);
        } catch (error) {
          console.error("Error loading team:", error);
          toast({
            title: "Error",
            description: "Failed to load team members.",
            variant: "destructive",
          });
          setTasks([]);
        } finally {
          setLoading(false);
        }
      };

      fetchTeam();
    }
  }, [projectId]);

  const toggleTask = (memberId: number | string, taskIndex: number) => {
    setTasks(prev => prev.map(member =>
      member.id === memberId
        ? {
          ...member,
          tasks: member.tasks.map((task, i) =>
            i === taskIndex ? { ...task, done: !task.done } : task
          )
        }
        : member
    ));
  };

  const addComment = (memberId: number | string, taskIndex: number, text: string) => {
    if (!text.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: "You",
      text: text.trim(),
      timestamp: new Date(),
    };

    setTasks(prev => prev.map(member =>
      member.id === memberId
        ? {
          ...member,
          tasks: member.tasks.map((task, i) =>
            i === taskIndex ? { ...task, comments: [...task.comments, comment] } : task
          )
        }
        : member
    ));
    setNewComment("");
    toast({ title: "Comment added", description: "Your comment has been posted." });
  };

  const totalTasks = tasks.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedTasks = tasks.reduce((acc, m) => acc + m.tasks.filter(t => t.done).length, 0);
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <WorkspaceLoading stage="implementation" message="Setting up development environment and tasks..." />
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Dashboard */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Team Progress</h3>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            {progress}% Complete
          </Badge>
        </div>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-primary to-success rounded-full"
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>

      {/* Task Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {tasks.map((member) => (
          <div key={member.id} className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.member.split(' ')[0].toLowerCase()}`}
                alt={member.member}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{member.member}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                {member.tasks.filter(t => t.done).length}/{member.tasks.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {member.tasks.map((task, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-secondary/50 rounded-lg">
                  <button
                    onClick={() => toggleTask(member.id, i)}
                    className="flex items-center gap-2 flex-1 text-left"
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors",
                      task.done ? "bg-success" : "border border-muted-foreground hover:border-primary"
                    )}>
                      {task.done && <CheckCircle2 className="w-3 h-3 text-success-foreground" />}
                    </div>
                    <span className={cn("text-sm transition-all", task.done && "line-through text-muted-foreground")}>
                      {task.name}
                    </span>
                  </button>

                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="p-1 hover:bg-secondary rounded transition-colors relative">
                        <MessageCircle className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        {task.comments.length > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                            {task.comments.length}
                          </span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Comments</h4>

                        {task.comments.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No comments yet</p>
                        ) : (
                          <div className="space-y-3 max-h-48 overflow-y-auto">
                            {task.comments.map((comment) => (
                              <div key={comment.id} className="bg-secondary/50 rounded-lg p-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium">{comment.author}</span>
                                  <span className="text-[10px] text-muted-foreground">{formatTime(comment.timestamp)}</span>
                                </div>
                                <p className="text-sm">{comment.text}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2 pt-2 border-t border-border">
                          <Input
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                addComment(member.id, i, newComment);
                              }
                            }}
                            className="text-sm h-8"
                          />
                          <Button
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => addComment(member.id, i, newComment)}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Role-Based Stats */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold mb-4">Role Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tasks.map((member) => {
            const memberCompleted = member.tasks.filter(t => t.done).length;
            const memberTotal = member.tasks.length;
            const memberProgress = memberTotal > 0 ? Math.round((memberCompleted / memberTotal) * 100) : 0;
            const totalComments = member.tasks.reduce((acc, t) => acc + t.comments.length, 0);

            return (
              <div key={member.id} className="bg-secondary/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    memberProgress === 100 ? "bg-success" : memberProgress >= 50 ? "bg-primary" : "bg-muted-foreground"
                  )} />
                  <span className="text-xs font-medium text-muted-foreground">{member.role}</span>
                </div>

                <div>
                  <p className="text-2xl font-bold">{memberProgress}%</p>
                  <p className="text-xs text-muted-foreground">completed</p>
                </div>

                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${memberProgress}%` }}
                    className={cn(
                      "h-full rounded-full",
                      memberProgress === 100 ? "bg-success" : "bg-primary"
                    )}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                  <span>{memberCompleted}/{memberTotal} tasks</span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    {totalComments}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


