import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Send, 
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Smile,
  ArrowLeft
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const conversations = [
  {
    id: 1,
    name: "Sarah Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    lastMessage: "That sounds great! Let's discuss the architecture tomorrow.",
    timestamp: "2:30 PM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "AI Innovation Team",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=team1",
    lastMessage: "Marcus: I've finished the frontend mockups",
    timestamp: "1:15 PM",
    unread: 0,
    online: false,
    isGroup: true,
    members: 4,
  },
  {
    id: 3,
    name: "Marcus Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marcus",
    lastMessage: "Can you review my PR when you get a chance?",
    timestamp: "Yesterday",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    name: "Emily Zhang",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    lastMessage: "Thanks for the help!",
    timestamp: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 5,
    name: "Climate Tech Team",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=team2",
    lastMessage: "Lisa: Meeting at 3 PM today",
    timestamp: "Monday",
    unread: 0,
    online: false,
    isGroup: true,
    members: 3,
  },
];

const messages = [
  {
    id: 1,
    sender: "Sarah Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    content: "Hey! I saw your profile and I think we'd make a great team for the AI Innovation Challenge!",
    timestamp: "2:00 PM",
    isMe: false,
  },
  {
    id: 2,
    sender: "Me",
    content: "Hi Sarah! I checked out your projects too - your ML experience would be perfect for the competition. What role are you thinking of taking?",
    timestamp: "2:05 PM",
    isMe: true,
  },
  {
    id: 3,
    sender: "Sarah Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    content: "I was thinking I could handle the ML model development and backend API. I saw you're strong with React - maybe you could lead the frontend?",
    timestamp: "2:10 PM",
    isMe: false,
  },
  {
    id: 4,
    sender: "Me",
    content: "That works perfectly for me! I can also help with the Node.js backend if needed. Do you have any project ideas in mind?",
    timestamp: "2:15 PM",
    isMe: true,
  },
  {
    id: 5,
    sender: "Sarah Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    content: "I've been thinking about an AI-powered mental health companion app. We could use NLP to analyze user sentiment and provide personalized support.",
    timestamp: "2:20 PM",
    isMe: false,
  },
  {
    id: 6,
    sender: "Me",
    content: "That sounds amazing! Very relevant and impactful. We could use OpenAI's API for the NLP part and build a clean, calming UI.",
    timestamp: "2:25 PM",
    isMe: true,
  },
  {
    id: 7,
    sender: "Sarah Kim",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    content: "That sounds great! Let's discuss the architecture tomorrow.",
    timestamp: "2:30 PM",
    isMe: false,
  },
];

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  return (
    <MainLayout>
      <div className="container mx-auto px-0 md:px-6 py-0 md:py-8 h-[calc(100vh-4rem)]">
        <div className="bg-card border border-border rounded-none md:rounded-xl h-full flex overflow-hidden">
          {/* Conversations List */}
          <div className={cn(
            "w-full md:w-80 lg:w-96 border-r border-border flex flex-col",
            showMobileChat && "hidden md:flex"
          )}>
            {/* Header */}
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold mb-4">Messages</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            {/* Conversation List */}
            <ScrollArea className="flex-1">
              {conversations.map((convo) => (
                <div
                  key={convo.id}
                  onClick={() => {
                    setSelectedChat(convo);
                    setShowMobileChat(true);
                  }}
                  className={cn(
                    "flex items-center gap-3 p-4 cursor-pointer hover:bg-secondary/50 transition-colors border-b border-border/50",
                    selectedChat.id === convo.id && "bg-secondary/50"
                  )}
                >
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={convo.avatar} />
                      <AvatarFallback>{convo.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    {convo.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-success border-2 border-card" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">{convo.name}</h3>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {convo.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {convo.lastMessage}
                      </p>
                      {convo.unread > 0 && (
                        <span className="ml-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center shrink-0">
                          {convo.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Chat Window */}
          <div className={cn(
            "flex-1 flex flex-col",
            !showMobileChat && "hidden md:flex"
          )}>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setShowMobileChat(false)}
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedChat.avatar} />
                    <AvatarFallback>{selectedChat.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  {selectedChat.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-success border-2 border-card" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{selectedChat.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedChat.online ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3",
                      msg.isMe && "flex-row-reverse"
                    )}
                  >
                    {!msg.isMe && (
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarImage src={msg.avatar} />
                        <AvatarFallback>{msg.sender.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn(
                      "max-w-[70%]",
                      msg.isMe && "text-right"
                    )}>
                      <div className={cn(
                        "inline-block rounded-2xl px-4 py-2.5",
                        msg.isMe 
                          ? "bg-primary text-primary-foreground rounded-br-sm" 
                          : "bg-secondary rounded-bl-sm"
                      )}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {msg.timestamp}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-secondary/50 border border-border rounded-full px-4 py-2.5 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Smile className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </div>
                <Button size="icon" className="rounded-full" disabled={!messageInput.trim()}>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
