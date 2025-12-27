import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EquipmentCategory } from '@/types';
import { Plus, Search, Edit, Trash2, FolderOpen } from 'lucide-react';
import { get, post, del } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const { toast } = useToast();

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data: any = await get('Category');
        setCategories(data || []);
      } catch (err: any) {
        toast({
          title: 'Failed to load categories',
          description: err?.message || 'Error loading categories',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch teams for dropdown
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const data: any = await get('Team');
        setTeams(data || []);
      } catch (err: any) {
        console.error('Failed to load teams', err);
      }
    };
    fetchTeams();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast({
        title: 'Error',
        description: 'Category name is required',
        variant: 'destructive',
      });
      return;
    }
    if (!selectedTeamId) {
      toast({
        title: 'Error',
        description: 'Please select a team',
        variant: 'destructive',
      });
      return;
    }
    setIsCreating(true);
    try {
      const res: any = await post('Category', {
        Name: categoryName,
        Description: categoryDescription,
        TeamId: parseInt(selectedTeamId),
      });
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
      setCategoryName('');
      setCategoryDescription('');
      setSelectedTeamId('');
      setIsAddOpen(false);
      // Refresh categories list
      const data: any = await get('Category');
      setCategories(data || []);
    } catch (err: any) {
      toast({
        title: 'Failed to create category',
        description: err?.body?.message || err?.message || 'Error creating category',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await del(`Category/${id}`);
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
      // Refresh categories list
      const data: any = await get('Category');
      setCategories(data || []);
    } catch (err: any) {
      toast({
        title: 'Failed to delete category',
        description: err?.body?.message || err?.message || 'Error deleting category',
        variant: 'destructive',
      });
    }
  };

  const filteredCategories = categories.filter(cat =>
    (cat.Name || cat.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Equipment Categories</h1>
            <p className="text-muted-foreground mt-1">Define categories and responsible teams</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4" onSubmit={handleCreateCategory}>
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter description"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team">Responsible Team</Label>
                  <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map(team => (
                        <SelectItem key={team.Id || team.id} value={String(team.Id || team.id)}>
                          {team.TeamName || team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={isCreating}>Cancel</Button>
                  <Button type="submit" disabled={isCreating}>{isCreating ? 'Creating...' : 'Add Category'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold w-12"></TableHead>
                <TableHead className="font-semibold">Category Name</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Responsible Team</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((cat) => (
                <TableRow key={cat.Id || cat.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FolderOpen className="w-5 h-5 text-primary" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{cat.Name || cat.name}</TableCell>
                  <TableCell className="text-muted-foreground">{cat.Description || cat.description}</TableCell>
                  <TableCell>{cat.Team?.TeamName || cat.Team?.name || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(cat.Id || cat.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Categories;
