import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ExternalLink,
  Wifi,
  Building,
  Trophy,
  Star,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useLoading } from "@/contexts/LoadingContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const API_BASE_URL = "http://localhost:8000";

const hackathons = [
  {
    id: 1,
    name: "AI Innovation Challenge 2026",
    platform: "Devpost",
    deadline: "Feb 15, 2026",
    description: "Build the next generation of AI-powered solutions that transform industries and improve lives.",
    mode: "Online",
    participants: 1250,
    prize: "$50,000",
    tags: ["AI/ML", "Healthcare", "Beginner Friendly"],
    featured: true,
    daysLeft: 13,
  },
  {
    id: 2,
    name: "Web3 Hackathon",
    platform: "ETHGlobal",
    deadline: "Feb 20, 2026",
    description: "Create decentralized applications that push the boundaries of blockchain technology.",
    mode: "Hybrid",
    participants: 890,
    prize: "$100,000",
    tags: ["Blockchain", "DeFi", "NFTs"],
    featured: true,
    daysLeft: 18,
  },
  {
    id: 3,
    name: "Climate Tech Sprint",
    platform: "MLH",
    deadline: "Feb 28, 2026",
    description: "Develop sustainable solutions to combat climate change using cutting-edge technology.",
    mode: "In-Person",
    location: "San Francisco, CA",
    participants: 450,
    prize: "$25,000",
    tags: ["Sustainability", "IoT", "Data Science"],
    featured: false,
    daysLeft: 26,
  },
  {
    id: 4,
    name: "FinTech Revolution",
    platform: "Devfolio",
    deadline: "Mar 5, 2026",
    description: "Reimagine financial services with innovative technology solutions.",
    mode: "Online",
    participants: 678,
    prize: "$30,000",
    tags: ["FinTech", "Payments", "Security"],
    featured: false,
    daysLeft: 31,
  },
  {
    id: 5,
    name: "Healthcare Innovation Lab",
    platform: "Hackathon.com",
    deadline: "Mar 10, 2026",
    description: "Transform healthcare delivery through technology and innovation.",
    mode: "Hybrid",
    participants: 320,
    prize: "$40,000",
    tags: ["Healthcare", "AI/ML", "Accessibility"],
    featured: false,
    daysLeft: 36,
  },
  {
    id: 6,
    name: "Gaming & Metaverse Jam",
    platform: "itch.io",
    deadline: "Mar 15, 2026",
    description: "Build immersive gaming experiences and virtual worlds.",
    mode: "Online",
    participants: 1100,
    prize: "$20,000",
    tags: ["Gaming", "VR/AR", "3D"],
    featured: false,
    daysLeft: 41,
  },
];

const platformColors: Record<string, string> = {
  Devpost: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ETHGlobal: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  MLH: "bg-red-500/10 text-red-400 border-red-500/20",
  Devfolio: "bg-green-500/10 text-green-400 border-green-500/20",
  "Hackathon.com": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "itch.io": "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

export default function Explore() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { show, hide } = useLoading();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [creatingProject, setCreatingProject] = useState<number | null>(null);

  const handleStartProject = async (hackathon: typeof hackathons[0]) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "User ID not found. Please sign in again.",
        variant: "destructive",
      });
      return;
    }

    setCreatingProject(hackathon.id);
    show(`Creating project for ${hackathon.name} — this may take a few moments.`);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/project/create`, {
        user_id: userId,
        project_name: hackathon.name,
        hackathon_id: hackathon.id,
        hackathon_name: hackathon.name,
        
        description: hackathon.description
      });

      const projectId = response.data.id || response.data.project_id || response.data;

      toast({
        title: "Project Created!",
        description: `Successfully created project for ${hackathon.name}`,
      });

      // Navigate to workspace with the new project ID
      navigate("/workspace", {
        state: {
          selectedProjectId: projectId,
          newProject: {
            id: projectId,
            hackathonId: hackathon.id,
            hackathonName: hackathon.name,
            deadline: hackathon.deadline,
            daysLeft: hackathon.daysLeft,
            projectName: hackathon.name,
          },
        },
      });
    } catch (error: any) {
      console.error("Error creating project:", error);
      setCreatingProject(null);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
    finally {
      hide();
      setCreatingProject(null);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-2"
          >
            Discover <span className="text-gradient">Hackathons</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Find the perfect hackathon to showcase your skills and build something amazing
          </motion.p>
        </div>

        {/* Search & Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-8"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hackathons... (e.g., 'AI healthcare hackathon for beginners')"
              className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            />
          </div>

          {/* Filter Toggle & Sort */}
          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
            </Button>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select defaultValue="relevant">
                <SelectTrigger className="w-40 bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevant">Most Relevant</SelectItem>
                  <SelectItem value="deadline">Nearest Deadline</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="prize">Highest Prize</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-card border border-border rounded-xl"
            >
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Platform</label>
                <Select>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="All Platforms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Platforms</SelectItem>
                    <SelectItem value="devpost">Devpost</SelectItem>
                    <SelectItem value="ethglobal">ETHGlobal</SelectItem>
                    <SelectItem value="mlh">MLH</SelectItem>
                    <SelectItem value="devfolio">Devfolio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Mode</label>
                <Select>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="All Modes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Eligibility</label>
                <Select>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner Friendly</SelectItem>
                    <SelectItem value="student">Students Only</SelectItem>
                    <SelectItem value="nocode">No-Code</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Timeline</label>
                <Select>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Any Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Time</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Hackathon Grid */}
        <div className="grid gap-4">
          {hackathons.map((hackathon, index) => (
            <motion.div
              key={hackathon.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={cn(
                "group relative bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all",
                hackathon.featured && "gradient-border"
              )}
            >
              {hackathon.featured && (
                <div className="absolute -top-2 right-4">
                  <Badge className="bg-primary text-primary-foreground gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </Badge>
                </div>
              )}

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                      {hackathon.name}
                    </h3>
                    <Badge variant="outline" className={platformColors[hackathon.platform]}>
                      {hackathon.platform}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {hackathon.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {hackathon.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap md:flex-col gap-4 md:gap-2 text-sm text-muted-foreground md:text-right md:min-w-[180px]">
                  <div className="flex items-center gap-2 md:justify-end">
                    {hackathon.mode === "Online" ? (
                      <Wifi className="w-4 h-4" />
                    ) : hackathon.mode === "In-Person" ? (
                      <Building className="w-4 h-4" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                    <span>{hackathon.mode}</span>
                    {hackathon.location && <span className="text-xs">({hackathon.location})</span>}
                  </div>
                  <div className="flex items-center gap-2 md:justify-end">
                    <Users className="w-4 h-4" />
                    <span>{hackathon.participants.toLocaleString()} participants</span>
                  </div>
                  <div className="flex items-center gap-2 md:justify-end">
                    <Trophy className="w-4 h-4 text-warning" />
                    <span className="text-warning font-medium">{hackathon.prize}</span>
                  </div>
                  <div className="flex items-center gap-2 md:justify-end">
                    <Clock className="w-4 h-4" />
                    <span className={cn(hackathon.daysLeft <= 7 && "text-destructive")}>
                      {hackathon.daysLeft} days left
                    </span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex gap-2 md:ml-4">
                  <Button variant="outline" className="gap-2">
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button 
                    className="gap-2"
                    disabled={creatingProject === hackathon.id}
                    onClick={(e) => {
                      
                      e.stopPropagation();
                      handleStartProject(hackathon);
                    }}
                  >
                    {creatingProject === hackathon.id ? "Creating..." : "Start Project"}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg">
            Load More Hackathons
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
