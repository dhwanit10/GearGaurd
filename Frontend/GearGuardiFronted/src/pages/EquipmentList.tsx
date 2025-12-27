import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Equipment } from '@/types';
import { Plus, Search, Eye, Trash2, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { get, post, del } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const EquipmentList = () => {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<any | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    Name: '',
    SerialNo: '',
    Department: '',
    CategoryId: '',
    Location: '',
    MaintenanceTeamId: '',
    Status: 'operational',
    PurchaseDate: new Date().toISOString().split('T')[0],
    WarrantyEnd: new Date().toISOString().split('T')[0],
    OwnedBy: '',
  });
  const { toast } = useToast();

  // Fetch equipment
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setIsLoading(true);
        const data: any = await get('Equipment');
        setEquipment(data || []);
      } catch (err: any) {
        toast({
          title: 'Failed to load equipment',
          description: err?.message || 'Error loading equipment',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchEquipment();
  }, []);

  // Fetch categories, teams, and users
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [catsData, teamsData, usersData]: any = await Promise.all([
          get('Category'),
          get('Team'),
          get('User'),
        ]);
        setCategories(catsData || []);
        setTeams(teamsData || []);
        setUsers(usersData || []);
      } catch (err: any) {
        console.error('Failed to load dropdown data', err);
      }
    };
    fetchDropdownData();
  }, []);

  const handleCreateEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Name.trim() || !formData.CategoryId || !formData.MaintenanceTeamId || !formData.OwnedBy) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    setIsCreating(true);
    try {
      const res: any = await post('Equipment', {
        Name: formData.Name,
        SerialNo: formData.SerialNo,
        Department: formData.Department,
        CategoryId: parseInt(formData.CategoryId),
        Location: formData.Location,
        MaintenanceTeamId: parseInt(formData.MaintenanceTeamId),
        Status: formData.Status,
        PurchaseDate: new Date(formData.PurchaseDate).toISOString(),
        WarrantyEnd: new Date(formData.WarrantyEnd).toISOString(),
        OwnedBy: parseInt(formData.OwnedBy),
      });
      toast({
        title: 'Success',
        description: 'Equipment added successfully',
      });
      setFormData({
        Name: '',
        SerialNo: '',
        Department: '',
        CategoryId: '',
        Location: '',
        MaintenanceTeamId: '',
        Status: 'operational',
        PurchaseDate: new Date().toISOString().split('T')[0],
        WarrantyEnd: new Date().toISOString().split('T')[0],
        OwnedBy: '',
      });
      setIsAddOpen(false);
      // Refresh equipment list
      const data: any = await get('Equipment');
      setEquipment(data || []);
    } catch (err: any) {
      toast({
        title: 'Failed to add equipment',
        description: err?.body?.message || err?.message || 'Error adding equipment',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteEquipment = async (id: number) => {
    try {
      await del(`Equipment/${id}`);
      toast({
        title: 'Success',
        description: 'Equipment deleted successfully',
      });
      const data: any = await get('Equipment');
      setEquipment(data || []);
    } catch (err: any) {
      toast({
        title: 'Failed to delete equipment',
        description: err?.body?.message || err?.message || 'Error deleting equipment',
        variant: 'destructive',
      });
    }
  };

  const filteredEquipment = equipment.filter(eq =>
    (eq.Name || eq.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (eq.SerialNo || eq.serialNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string = 'operational') => {
    const statusLower = (status || '').toLowerCase();
    const styles: any = {
      'operational': 'bg-success/20 text-success border-success/30',
      'maintenance': 'bg-warning/20 text-warning border-warning/30',
      'breakdown': 'bg-destructive/20 text-destructive border-destructive/30',
      'scrap': 'bg-muted/20 text-muted-foreground border-muted/30',
    };
    const labels: any = {
      'operational': 'Operational',
      'maintenance': 'Maintenance',
      'breakdown': 'Breakdown',
      'scrap': 'Scrap',
    };
    return <Badge variant="outline" className={cn(styles[statusLower] || styles.operational)}>{labels[statusLower] || statusLower}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Equipment</h1>
            <p className="text-muted-foreground mt-1">Manage company assets and equipment</p>
          </div>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4" onSubmit={handleCreateEquipment}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Equipment Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter name"
                      value={formData.Name}
                      onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serial">Serial Number</Label>
                    <Input
                      id="serial"
                      placeholder="Enter serial number"
                      value={formData.SerialNo}
                      onChange={(e) => setFormData({ ...formData, SerialNo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.CategoryId} onValueChange={(val) => setFormData({ ...formData, CategoryId: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.Id || cat.id} value={String(cat.Id || cat.id)}>{cat.Name || cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      placeholder="Enter department"
                      value={formData.Department}
                      onChange={(e) => setFormData({ ...formData, Department: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="Enter location"
                      value={formData.Location}
                      onChange={(e) => setFormData({ ...formData, Location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="team">Maintenance Team</Label>
                    <Select value={formData.MaintenanceTeamId} onValueChange={(val) => setFormData({ ...formData, MaintenanceTeamId: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map(team => (
                          <SelectItem key={team.Id || team.id} value={String(team.Id || team.id)}>{team.TeamName || team.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.Status} onValueChange={(val) => setFormData({ ...formData, Status: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="breakdown">Breakdown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner">Owner</Label>
                    <Select value={formData.OwnedBy} onValueChange={(val) => setFormData({ ...formData, OwnedBy: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select owner" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.Id || user.id} value={String(user.Id || user.id)}>{user.Name || user.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={formData.PurchaseDate}
                      onChange={(e) => setFormData({ ...formData, PurchaseDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warranty">Warranty Expiry</Label>
                    <Input
                      id="warranty"
                      type="date"
                      value={formData.WarrantyEnd}
                      onChange={(e) => setFormData({ ...formData, WarrantyEnd: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={isCreating}>Cancel</Button>
                  <Button type="submit" disabled={isCreating}>{isCreating ? 'Adding...' : 'Add Equipment'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
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
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Serial Number</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Department</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipment.map((eq) => (
                <TableRow key={eq.Id || eq.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium">{eq.Name || eq.name}</TableCell>
                  <TableCell className="font-mono text-sm">{eq.SerialNo || eq.serialNumber}</TableCell>
                  <TableCell>{eq.Category?.Name || eq.Category?.name || eq.category}</TableCell>
                  <TableCell>{eq.Department || eq.department}</TableCell>
                  <TableCell>{eq.Location || eq.location}</TableCell>
                  <TableCell>{getStatusBadge(eq.Status || eq.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedEquipment(eq); setIsViewOpen(true); }}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteEquipment(eq.Id || eq.id)}>
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

      {/* View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              {selectedEquipment?.Name || selectedEquipment?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedEquipment && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Serial Number</p>
                <p className="font-mono">{selectedEquipment.SerialNo || selectedEquipment.serialNumber}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Category</p>
                <p>{selectedEquipment.Category?.Name || selectedEquipment.Category?.name || selectedEquipment.category}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Department</p>
                <p>{selectedEquipment.Department || selectedEquipment.department}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Location</p>
                <p>{selectedEquipment.Location || selectedEquipment.location}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Maintenance Team</p>
                <p>{selectedEquipment.MaintenanceTeam?.TeamName || selectedEquipment.maintenanceTeam}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Owner</p>
                <p>{selectedEquipment.Owner?.Name || selectedEquipment.OwnedBy?.Name || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                {getStatusBadge(selectedEquipment.Status || selectedEquipment.status)}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Purchase Date</p>
                <p>{selectedEquipment.PurchaseDate ? new Date(selectedEquipment.PurchaseDate).toLocaleDateString() : '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Warranty Expiry</p>
                <p>{selectedEquipment.WarrantyEnd ? new Date(selectedEquipment.WarrantyEnd).toLocaleDateString() : '-'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EquipmentList;
