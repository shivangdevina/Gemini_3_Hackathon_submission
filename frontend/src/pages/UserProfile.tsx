import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  MapPin,
  Calendar,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  MessageCircle,
  Trophy,
  Code,
  Star,
  Briefcase
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock user data
const userData = {
  id: 1,
  name: "Alex Chen",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  role: "Full Stack Developer",
  bio: "Passionate about building AI-powered applications. Love hackathons! I've been coding for 5 years and have participated in over 15 hackathons. Currently exploring the intersection of AI and web development.",
  skills: ["React", "Node.js", "Python", "TensorFlow", "TypeScript", "PostgreSQL", "Docker", "AWS"],
  experience: "Intermediate",
  hackathonsWon: 5,
  hackathonsParticipated: 15,
  projects: 12,
  location: "San Francisco, CA",
  available: true,
  joinedDate: "Jan 2024",
  socials: {
    github: "alexchen",
    linkedin: "alexchen",
    twitter: "alexchen_dev",
  },
  publicProjects: [
    {
      id: 1,
      name: "AI Study Buddy",
      description: "An AI-powered study companion that helps students learn more effectively.",
      tags: ["React", "OpenAI", "Node.js"],
      hackathon: "AI Innovation 2025",
      won: true,
    },
    {
      id: 2,
      name: "EcoTrack",
      description: "A sustainability tracking app for individuals and businesses.",
      tags: ["React Native", "Firebase"],
      hackathon: "Climate Tech 2025",
      won: false,
    },
    {
      id: 3,
      name: "HealthSync",
      description: "Real-time health data synchronization platform.",
      tags: ["Python", "FastAPI", "PostgreSQL"],
      hackathon: "Healthcare Hack 2025",
      won: true,
    },
  ],
  achievements: [
    { name: "First Hackathon Win", icon: "🏆", date: "Mar 2024" },
    { name: "5 Hackathons Won", icon: "🎯", date: "Dec 2025" },
    { name: "Top Contributor", icon: "⭐", date: "Jan 2026" },
    { name: "Community Helper", icon: "🤝", date: "Feb 2026" },
  ],
  hackathonHistory: [
    { name: "AI Innovation Challenge 2025", result: "1st Place", date: "Dec 2025" },
    { name: "Healthcare Hack 2025", result: "1st Place", date: "Oct 2025" },
    { name: "Climate Tech Sprint", result: "3rd Place", date: "Aug 2025" },
    { name: "Web3 Hackathon", result: "Participated", date: "Jun 2025" },
    { name: "FinTech Revolution", result: "2nd Place", date: "Apr 2025" },
  ],
};

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar & Status */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <Avatar className="w-28 h-28 border-4 border-border">
                  <AvatarImage src={userData.avatar} />
                  <AvatarFallback className="text-2xl">{userData.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-card",
                  userData.available ? "bg-success" : "bg-muted-foreground"
                )} />
              </div>
              <Badge className={cn(
                "mt-3",
                userData.available 
                  ? "bg-success/10 text-success border-success/20" 
                  : "bg-muted/50 text-muted-foreground border-muted"
              )}>
                {userData.available ? "Available" : "Busy"}
              </Badge>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                  <p className="text-muted-foreground">{userData.role}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {userData.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {userData.joinedDate}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button onClick={() => navigate('/messages')} className="gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </Button>
                </div>
              </div>

              {/* Bio */}
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {userData.bio}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {userData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Socials */}
              <div className="flex gap-3 mt-4">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Github className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Linkedin className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4 md:min-w-[140px]">
              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold text-warning">
                  <Trophy className="w-5 h-5" />
                  {userData.hackathonsWon}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Wins</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  <Briefcase className="w-5 h-5 text-primary" />
                  {userData.hackathonsParticipated}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Hackathons</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-4 text-center md:col-span-1 col-span-2">
                <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                  <Code className="w-5 h-5 text-success" />
                  {userData.projects}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Projects</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-card border border-border">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="hackathons">Hackathon History</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userData.publicProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold">{project.name}</h3>
                      {project.won && (
                        <Badge className="bg-warning/10 text-warning border-warning/20 gap-1">
                          <Trophy className="w-3 h-3" />
                          Winner
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Built at {project.hackathon}
                    </p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hackathons" className="mt-6">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {userData.hackathonHistory.map((hackathon, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-4",
                      index !== userData.hackathonHistory.length - 1 && "border-b border-border"
                    )}
                  >
                    <div>
                      <h4 className="font-medium">{hackathon.name}</h4>
                      <p className="text-sm text-muted-foreground">{hackathon.date}</p>
                    </div>
                    <Badge className={cn(
                      hackathon.result.includes("1st") && "bg-warning/10 text-warning border-warning/20",
                      hackathon.result.includes("2nd") && "bg-gray-400/10 text-gray-400 border-gray-400/20",
                      hackathon.result.includes("3rd") && "bg-amber-600/10 text-amber-600 border-amber-600/20",
                      hackathon.result === "Participated" && "bg-secondary text-secondary-foreground"
                    )}>
                      {hackathon.result}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {userData.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors"
                  >
                    <div className="text-4xl mb-3">{achievement.icon}</div>
                    <h4 className="font-medium text-sm">{achievement.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </MainLayout>
  );
}
