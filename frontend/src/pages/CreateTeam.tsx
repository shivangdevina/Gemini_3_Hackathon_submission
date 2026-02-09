import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import {
  Search,
  Filter,
  ChevronDown,
  Trophy,
  Code,
  Briefcase,
  MapPin,
  MessageCircle
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const users = [
  {
    id: 1,
    name: "Alex Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    role: "Full Stack Developer",
    skills: ["React", "Node.js", "Python", "TensorFlow"],
    experience: "Intermediate",
    hackathonsWon: 5,
    projects: 12,
    location: "San Francisco, CA",
    available: true,
    bio: "Passionate about building AI-powered applications. Love hackathons!",
  },
  {
    id: 2,
    name: "Sarah Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    role: "ML Engineer",
    skills: ["PyTorch", "Scikit-learn", "FastAPI", "Docker"],
    experience: "Advanced",
    hackathonsWon: 8,
    projects: 20,
    location: "Seattle, WA",
    available: true,
    bio: "Machine learning enthusiast specializing in NLP and computer vision.",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
    role: "Frontend Developer",
    skills: ["React", "TypeScript", "Tailwind", "Figma"],
    experience: "Intermediate",
    hackathonsWon: 3,
    projects: 8,
    location: "Austin, TX",
    available: true,
    bio: "UI/UX focused developer with a keen eye for design and animations.",
  },
  {
    id: 4,
    name: "Emily Zhang",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    role: "Backend Developer",
    skills: ["Go", "PostgreSQL", "Redis", "Kubernetes"],
    experience: "Advanced",
    hackathonsWon: 6,
    projects: 15,
    location: "New York, NY",
    available: false,
    bio: "Building scalable systems at scale. Open source contributor.",
  },
  {
    id: 5,
    name: "David Park",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    role: "Product Designer",
    skills: ["Figma", "Framer", "Prototyping", "User Research"],
    experience: "Intermediate",
    hackathonsWon: 4,
    projects: 10,
    location: "Los Angeles, CA",
    available: true,
    bio: "Turning complex problems into simple, beautiful solutions.",
  },
  {
    id: 6,
    name: "Lisa Wang",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    role: "Data Scientist",
    skills: ["Python", "R", "SQL", "Tableau"],
    experience: "Beginner",
    hackathonsWon: 1,
    projects: 5,
    location: "Boston, MA",
    available: true,
    bio: "Data-driven problem solver. First hackathon experience was amazing!",
  },
];

const mockUsers = [
  {
    id: 101,
    name: "James Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=james",
    role: "Full Stack Developer",
    skills: ["React", "Web Developer", "Node.js", "AI Integration", "LLM", "API Integration"],
    experience: "Advanced",
    hackathonsWon: 7,
    projects: 25,
    location: "New York, NY",
    available: true,
    bio: "Full stack wizard with a passion for integrating AI into scalable web applications.",
  },
  {
    id: 102,
    name: "Sophia Martinez",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sophia",
    role: "AI Engineer",
    skills: ["React", "Web Developer", "Node.js", "AI Integration", "LLM", "API Integration"],
    experience: "Intermediate",
    hackathonsWon: 4,
    projects: 18,
    location: "Austin, TX",
    available: true,
    bio: "Specializing in LLM fine-tuning and building robust AI-driven backend systems.",
  },
  {
    id: 103,
    name: "Daniel Lee",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=daniel",
    role: "Frontend Architect",
    skills: ["React", "Web Developer", "Node.js", "AI Integration", "LLM", "API Integration"],
    experience: "Advanced",
    hackathonsWon: 6,
    projects: 30,
    location: "San Francisco, CA",
    available: false,
    bio: "Architecting seamless frontend experiences powered by modern AI technologies.",
  },
  {
    id: 104,
    name: "Olivia Brown",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=olivia",
    role: "Backend Specialist",
    skills: ["React", "Web Developer", "Node.js", "AI Integration", "LLM", "API Integration"],
    experience: "Intermediate",
    hackathonsWon: 3,
    projects: 12,
    location: "Seattle, WA",
    available: true,
    bio: "Building secure and scalable backends for next-gen AI applications.",
  },
  {
    id: 105,
    name: "Ethan Davis",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ethan",
    role: "Full Stack Developer",
    skills: ["React", "Web Developer", "Node.js", "AI Integration", "LLM", "API Integration"],
    experience: "Beginner",
    hackathonsWon: 2,
    projects: 8,
    location: "Chicago, IL",
    available: true,
    bio: "Eager to learn and build full-stack AI solutions. Quick learner and team player.",
  },
  {
    id: 106,
    name: "Ava Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ava",
    role: "AI Researcher",
    skills: ["React", "Web Developer", "Node.js", "AI Integration", "LLM", "API Integration"],
    experience: "Advanced",
    hackathonsWon: 9,
    projects: 22,
    location: "Boston, MA",
    available: true,
    bio: "Pushing the boundaries of AI integration in web development.",
  },
  {
    id: 107,
    name: "Noah Taylor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noah",
    role: "Software Engineer",
    skills: ["React", "Web Developer", "Node.js", "AI Integration", "LLM", "API Integration"],
    experience: "Intermediate",
    hackathonsWon: 5,
    projects: 15,
    location: "Denver, CO",
    available: false,
    bio: "Versatile engineer with a knack for solving complex problems with AI.",
  },
  {
    id: 108,
    name: "Isabella Anderson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=isabella",
    role: "Product Developer",
    skills: ["React", "Web Developer", "Node.js", "AI Integration", "LLM", "API Integration"],
    experience: "Advanced",
    hackathonsWon: 6,
    projects: 28,
    location: "Los Angeles, CA",
    available: true,
    bio: "Creating user-centric products that leverage the power of advanced AI models.",
  },
  {
    id: 109,
    name: "Lucas Thomas",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lucas",
    role: "DevOps Engineer",
    skills: ["React", "Web Developer", "Node.js", "AI Integration", "LLM", "API Integration"],
    experience: "Intermediate",
    hackathonsWon: 3,
    projects: 14,
    location: "Miami, FL",
    available: true,
    bio: "Streamlining deployment pipelines for AI-integrated applications.",
  },
  {
    id: 110,
    name: "Mia White",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mia",
    role: "Full Stack Developer",
    skills: ["React", "Web Developer", "Node.js", "AI Integration", "LLM", "API Integration"],
    experience: "Beginner",
    hackathonsWon: 1,
    projects: 5,
    location: "Atlanta, GA",
    available: true,
    bio: "Passionate about full-stack development and exploring the world of AI.",
  }
];

const experienceColors: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-400 border-green-500/20",
  Intermediate: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Advanced: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function CreateTeam() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Debounce search query with loading state
  useEffect(() => {
    if (searchQuery !== debouncedQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setDebouncedQuery(searchQuery);
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, debouncedQuery]);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!debouncedQuery.trim()) return users;

    // Always return full mockUsers list irrespective of search query
    return mockUsers;
  }, [debouncedQuery]);

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold mb-2"
            >
              Find Your <span className="text-gradient">Dream Team</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground"
            >
              Discover talented teammates with the skills you need to win
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/messages')}
              className="relative"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
          </motion.div>
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
            {isSearching ? (
              <Loader2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-spin" />
            ) : (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            )}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teammates... (e.g., 'Frontend developer with React experience')"
              className="w-full bg-card border border-border rounded-xl pl-12 pr-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                ×
              </button>
            )}
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
                <SelectTrigger className="w-44 bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevant">Most Relevant</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="hackathons">Hackathons Won</SelectItem>
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
                <label className="text-xs text-muted-foreground mb-2 block">Technology Stack</label>
                <Select>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Any Technology" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Technology</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="nodejs">Node.js</SelectItem>
                    <SelectItem value="ml">Machine Learning</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Experience Level</label>
                <Select>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Min Projects</label>
                <Select>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                    <SelectItem value="10">10+</SelectItem>
                    <SelectItem value="20">20+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Availability</label>
                <Select>
                  <SelectTrigger className="bg-secondary/50">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any</SelectItem>
                    <SelectItem value="available">Currently Available</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Count */}
        {debouncedQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 text-sm text-muted-foreground"
          >
            Found <span className="text-foreground font-medium">{filteredUsers.length}</span> {filteredUsers.length === 1 ? 'teammate' : 'teammates'} matching "{debouncedQuery}"
          </motion.div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-muted" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-24 mb-2" />
                    <div className="h-3 bg-muted rounded w-32" />
                  </div>
                </div>
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-3/4 mb-4" />
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-muted rounded w-16" />
                  <div className="h-6 bg-muted rounded w-16" />
                  <div className="h-6 bg-muted rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isSearching && filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No teammates found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </motion.div>
        )}

        {/* User Grid */}
        {!isSearching && filteredUsers.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => navigate(`/profile/${user.id}`)}
                className="group bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-all cursor-pointer"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <Avatar className="w-14 h-14 border-2 border-border">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card",
                      user.available ? "bg-success" : "bg-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold group-hover:text-primary transition-colors truncate">
                      {user.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">{user.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={experienceColors[user.experience]}>
                        {user.experience}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {user.bio}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {user.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {user.skills.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{user.skills.length - 4}
                    </Badge>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-warning" />
                    <span>{user.hackathonsWon} wins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Code className="w-4 h-4" />
                    <span>{user.projects} projects</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate max-w-[80px]">{user.location.split(',')[0]}</span>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  className="w-full mt-4 gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/messages');
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Message
                </Button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Load More */}
        {!isSearching && filteredUsers.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Teammates
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
