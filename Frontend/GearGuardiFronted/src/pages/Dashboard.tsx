import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import MaintenanceTable from '@/components/dashboard/MaintenanceTable';
import RequestDetailModal from '@/components/dashboard/RequestDetailModal';

import { MaintenanceRequest } from '@/types';
import { AlertTriangle, Users, Inbox } from 'lucide-react';
import { get } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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

  const criticalEquipment = maintenanceRequests.filter(req => (req.Equipment?.Status || '').toLowerCase() === 'breakdown').length;
  const openRequests = maintenanceRequests.filter(req => {
    const status = (req.Status || '').toLowerCase();
    return status === 'new' || status === 'in_progress';
  }).length;
  const technicianLoad = maintenanceRequests.filter(req => (req.Status || '').toLowerCase() === 'in_progress').length;

  const handleViewRequest = (request: MaintenanceRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of maintenance operations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Critical Equipment"
            value={criticalEquipment}
            icon={AlertTriangle}
            variant="critical"
            subtitle="Require immediate attention"
          />
          <StatCard
            title="Technician Load"
            value={technicianLoad}
            icon={Users}
            variant="info"
            subtitle="Active assignments"
          />
          <StatCard
            title="Open Requests"
            value={openRequests}
            icon={Inbox}
            variant="success"
            subtitle="Pending resolution"
          />
        </div>

        {/* Recent Requests Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent Maintenance Requests</h2>
          </div>
          <MaintenanceTable requests={maintenanceRequests} onViewRequest={handleViewRequest} />
        </div>
      </div>

      <RequestDetailModal
        request={selectedRequest}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
