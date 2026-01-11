import { useState } from "react";
import { motion } from "motion/react";
import { Users, UserPlus, Mail, Crown, Shield, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  color: string;
  members: TeamMember[];
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member" | "viewer";
  avatar: string;
}

const teams: Team[] = [
  {
    id: "1",
    name: "Product & Design",
    description: "Product managers, designers, and UX researchers",
    memberCount: 12,
    color: "from-[#2D4B9E] to-[#5B75D8]",
    members: [
      {
        id: "1",
        name: "Sarah Chen",
        email: "sarah.chen@company.com",
        role: "admin",
        avatar: "SC",
      },
      {
        id: "2",
        name: "Marcus Rodriguez",
        email: "marcus.r@company.com",
        role: "member",
        avatar: "MR",
      },
      {
        id: "3",
        name: "Emily Thompson",
        email: "emily.t@company.com",
        role: "member",
        avatar: "ET",
      },
    ],
  },
  {
    id: "2",
    name: "Engineering",
    description: "Frontend, backend, and infrastructure engineers",
    memberCount: 24,
    color: "from-[#5B75D8] to-[#8B5CF6]",
    members: [
      {
        id: "4",
        name: "Alex Kim",
        email: "alex.kim@company.com",
        role: "admin",
        avatar: "AK",
      },
      {
        id: "5",
        name: "Jordan Lee",
        email: "jordan.lee@company.com",
        role: "member",
        avatar: "JL",
      },
    ],
  },
  {
    id: "3",
    name: "Data & Analytics",
    description: "Data scientists, analysts, and business intelligence",
    memberCount: 8,
    color: "from-[#8B5CF6] to-[#A78BFA]",
    members: [
      {
        id: "6",
        name: "Priya Patel",
        email: "priya.p@company.com",
        role: "admin",
        avatar: "PP",
      },
    ],
  },
];

export function TeamsPage() {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return Crown;
      case "member":
        return Shield;
      default:
        return User;
    }
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      admin: "bg-[#FEF3C7] text-[#92400E]",
      member: "bg-[#DBEAFE] text-[#1E40AF]",
      viewer: "bg-[#E5E7EB] text-[#374151]",
    };
    return colors[role as keyof typeof colors] || colors.viewer;
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-7xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-[#1A1D2E] mb-2">Teams</h1>
              <p className="text-[#6B7280]">
                Manage team access and collaboration across your workspace
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Teams List */}
            <div className="lg:col-span-1 space-y-4">
              {teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  onClick={() => setSelectedTeam(team)}
                  className={`bg-white rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all ${
                    selectedTeam?.id === team.id
                      ? "ring-2 ring-[#2D4B9E]"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${team.color} flex items-center justify-center`}
                    >
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1A1D2E]">
                        {team.name}
                      </h3>
                      <p className="text-sm text-[#6B7280]">
                        {team.memberCount} members
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-[#6B7280] line-clamp-2">
                    {team.description}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Team Details */}
            <div className="lg:col-span-2">
              {selectedTeam ? (
                <motion.div
                  key={selectedTeam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-[#1A1D2E] mb-1">
                        {selectedTeam.name}
                      </h2>
                      <p className="text-[#6B7280]">{selectedTeam.description}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-[#2D4B9E] hover:bg-[#253D82] text-white">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Invite Member
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Invite team member</DialogTitle>
                          <DialogDescription>
                            Send an invitation to join {selectedTeam.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="colleague@company.com"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              className="bg-[#F8F9FA]"
                            />
                          </div>
                          <Button className="w-full bg-[#2D4B9E] hover:bg-[#253D82] text-white">
                            <Mail className="w-4 h-4 mr-2" />
                            Send Invitation
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium text-[#1A1D2E] mb-3">Members</h3>
                    {selectedTeam.members.map((member, index) => {
                      const RoleIcon = getRoleIcon(member.role);
                      return (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                          }}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#F8F9FA] transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D4B9E] to-[#5B75D8] flex items-center justify-center text-white font-medium">
                            {member.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#1A1D2E]">
                              {member.name}
                            </p>
                            <p className="text-sm text-[#6B7280]">
                              {member.email}
                            </p>
                          </div>
                          <div
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getRoleBadge(
                              member.role
                            )}`}
                          >
                            <RoleIcon className="w-3 h-3" />
                            {member.role}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white rounded-xl p-12 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#F8F9FA] flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-[#6B7280]" />
                  </div>
                  <h3 className="font-medium text-[#1A1D2E] mb-2">
                    Select a team
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    Choose a team from the list to view members and manage access
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
