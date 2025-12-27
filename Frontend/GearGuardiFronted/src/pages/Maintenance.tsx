import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MaintenanceTable from '@/components/dashboard/MaintenanceTable';
import RequestDetailModal from '@/components/dashboard/RequestDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MaintenanceRequest } from '@/types';
import { Plus, Search, Filter } from 'lucide-react';
import { get, post } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Maintenance = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    Subject: '',
    EquipmentId: '',
    Type: 'Corrective',
    Description: '',
    CreatedBy: '',
    CategoryId: '',
  });
  const { toast } = useToast();

  // Fetch maintenance requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const data: any = await get('MaintenanceRequest');
        setMaintenanceRequests(data || []);
      } catch (err: any) {
        toast({
          title: 'Failed to load maintenance requests',
          description: err?.message || 'Error loading requests',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [equipData, catsData, usersData]: any = await Promise.all([
          get('Equipment'),
          get('Category'),
          get('User'),
        ]);
        setEquipment(equipData || []);
        setCategories(catsData || []);
        setUsers(usersData || []);
      } catch (err: any) {
        console.error('Failed to load dropdown data', err);
      }
    };
    fetchDropdownData();
  }, []);

  const handleViewRequest = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.Subject.trim() || !formData.EquipmentId || !formData.CreatedBy || !formData.CategoryId) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    setIsCreating(true);
    try {
      const res: any = await post('MaintenanceRequest', {
        Subject: formData.Subject,
        EquipmentId: parseInt(formData.EquipmentId),
        Type: formData.Type,
        Description: formData.Description,
        CreatedBy: parseInt(formData.CreatedBy),
        CategoryId: parseInt(formData.CategoryId),
      });
      toast({
        title: 'Success',
        description: 'Maintenance request created successfully',
      });
      setFormData({
        Subject: '',
        EquipmentId: '',
        Type: 'Corrective',
        Description: '',
        CreatedBy: '',
        CategoryId: '',
      });
      setIsCreateOpen(false);
      // Refresh requests list
      const data: any = await get('MaintenanceRequest');
      setMaintenanceRequests(data || []);
    } catch (err: any) {
      toast({
        title: 'Failed to create request',
        description: err?.body?.message || err?.message || 'Error creating request',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const filteredRequests = maintenanceRequests.filter(req => {
    const matchesSearch = (req.Subject || req.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (req.Equipment?.Name || req.equipmentName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (req.Status || '').toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'all' || (req.Type || '').toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Maintenance Requests</h1>
            <p className="text-muted-foreground mt-1">Manage all maintenance tickets</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Create New Maintenance Request</DialogTitle>
              </DialogHeader>
              <form className="space-y-4 mt-4" onSubmit={handleCreateRequest}>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Enter subject"
                    value={formData.Subject}
                    onChange={(e) => setFormData({ ...formData, Subject: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipment">Equipment</Label>
                    <Select value={formData.EquipmentId} onValueChange={(val) => setFormData({ ...formData, EquipmentId: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipment.map(eq => (
                          <SelectItem key={eq.Id || eq.id} value={String(eq.Id || eq.id)}>
                            {eq.Name || eq.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.Type} onValueChange={(val) => setFormData({ ...formData, Type: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Corrective">Corrective</SelectItem>
                        <SelectItem value="Preventive">Preventive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.CategoryId} onValueChange={(val) => setFormData({ ...formData, CategoryId: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.Id || cat.id} value={String(cat.Id || cat.id)}>
                            {cat.Name || cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="createdBy">Created By</Label>
                    <Select value={formData.CreatedBy} onValueChange={(val) => setFormData({ ...formData, CreatedBy: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.Id || user.id} value={String(user.Id || user.id)}>
                            {user.Name || user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter description"
                    value={formData.Description}
                    onChange={(e) => setFormData({ ...formData, Description: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} disabled={isCreating}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? 'Creating...' : 'Create Request'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="repaired">Repaired</SelectItem>
              <SelectItem value="scrap">Scrap</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="corrective">Corrective</SelectItem>
              <SelectItem value="preventive">Preventive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <MaintenanceTable requests={filteredRequests} onViewRequest={handleViewRequest} />
      </div>

      <RequestDetailModal
        request={selectedRequest}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default Maintenance;
