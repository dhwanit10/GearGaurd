import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Team } from '@/types';
import { Plus, Search, Edit, Trash2, Users, User, Mail } from 'lucide-react';
import { get, post, del } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Teams = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<{ [key: number]: any[] }>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  // Fetch all teams
  useEffect(() => {
    const fetchAllTeams = async () => {
      try {
        setIsLoading(true);
        const data: any = await get('Team');
        setTeams(data || []);
      } catch (err: any) {
        toast({
          title: 'Failed to load teams',
          description: err?.message || 'Error loading teams',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllTeams();
  }, []);

  // Fetch team members and group by team
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const data: any = await get('TeamMember');
        // Group by team
        const grouped: { [key: number]: any[] } = {};
        data?.forEach((item: any) => {
          const teamId = item.Team.Id;
          if (!grouped[teamId]) {
            grouped[teamId] = [];
          }
          grouped[teamId].push(item.User);
        });
        setTeamMembers(grouped);
      } catch (err: any) {
        console.error('Failed to load team members', err);
      }
    };
    fetchTeamMembers();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim()) {
      toast({
        title: 'Error',
        description: 'Team name is required',
        variant: 'destructive',
      });
      return;
    }
    setIsCreating(true);
    try {
      const res: any = await post('Team', {
        TeamName: teamName,
        Description: teamDescription,
      });
      toast({
        title: 'Success',
        description: 'Team created successfully',
      });
      setTeamName('');
      setTeamDescription('');
      setIsAddOpen(false);
      // Refresh teams list
      const data: any = await get('Team');
      setTeams(data || []);
    } catch (err: any) {
      toast({
        title: 'Failed to create team',
        description: err?.body?.message || err?.message || 'Error creating team',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const filteredTeams = teams.filter(team =>
    (team.TeamName || team.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    try {
      await del(`Team/${id}`);
      toast({
        title: 'Success',
        description: 'Team deleted successfully',
      });
      // Refresh teams list
      const data: any = await get('Team');
      setTeams(data || []);
    } catch (err: any) {
      toast({
        title: 'Failed to delete team',
        description: err?.body?.message || err?.message || 'Error deleting team',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Maintenance Teams</h1>
            <p className="text-muted-foreground mt-1">Manage technicians and team assignments</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Team</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4" onSubmit={handleCreateTeam}>
                <div className="space-y-2">
                  <Label htmlFor="name">Team Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter team name"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter description"
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={isCreating}>Cancel</Button>
                  <Button type="submit" disabled={isCreating}>{isCreating ? 'Creating...' : 'Add Team'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <Card key={team.Id || team.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{team.TeamName || team.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">{(team.members || []).length} members</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(team.Id || team.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{team.Description || team.description}</p>
                <div className="space-y-3">
                  <p className="text-sm font-medium">Team Members</p>
                  {(teamMembers[team.Id] || []).length > 0 ? (
                    teamMembers[team.Id].map((member: any) => (
                      <div key={member.Id || member.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {getInitials(member.Name || member.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.Name || member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.Email || member.email}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No members in this team</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Teams;
