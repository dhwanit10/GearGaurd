import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MaintenanceRequest } from '@/types';
import { Eye, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MaintenanceTableProps {
  requests: any[];
  onViewRequest: (request: any) => void;
}

const MaintenanceTable = ({ requests, onViewRequest }: MaintenanceTableProps) => {
  const getPriorityBadge = (priority: string = 'medium') => {
    const styles: any = {
      critical: 'bg-critical text-critical-foreground',
      high: 'bg-warning text-warning-foreground',
      medium: 'bg-info text-info-foreground',
      low: 'bg-muted text-muted-foreground',
    };
    return <Badge className={cn('capitalize', styles[priority] || styles.medium)}>{priority}</Badge>;
  };

  const getStatusBadge = (status: string = 'new') => {
    const statusLower = (status || '').toLowerCase();
    const styles: any = {
      'new': 'bg-info/20 text-info border-info/30',
      'in_progress': 'bg-warning/20 text-warning border-warning/30',
      'repaired': 'bg-success/20 text-success border-success/30',
      'scrap': 'bg-muted/20 text-muted-foreground border-muted/30',
    };
    const labels: any = {
      'new': 'New',
      'in_progress': 'In Progress',
      'repaired': 'Repaired',
      'scrap': 'Scrap',
    };
    return <Badge variant="outline" className={cn(styles[statusLower] || styles.new)}>{labels[statusLower] || statusLower}</Badge>;
  };

  const getTypeBadge = (type: string = 'preventive') => {
    const typeLower = (type || '').toLowerCase();
    return (
      <Badge variant="outline" className={cn(
        typeLower === 'corrective' ? 'border-critical/50 text-critical' : 'border-primary/50 text-primary'
      )}>
        {typeLower === 'corrective' ? <AlertTriangle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
        {typeLower.charAt(0).toUpperCase() + typeLower.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="font-semibold">ID</TableHead>
            <TableHead className="font-semibold">Subject</TableHead>
            <TableHead className="font-semibold">Equipment</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Assigned To</TableHead>
            <TableHead className="font-semibold">Scheduled</TableHead>
            <TableHead className="font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.Id || request.id} className="hover:bg-muted/20 transition-colors">
              <TableCell className="font-mono text-sm">{request.Id || request.id}</TableCell>
              <TableCell className="font-medium">{request.Subject || request.subject}</TableCell>
              <TableCell>{request.Equipment?.Name || request.equipmentName}</TableCell>
              <TableCell>{getTypeBadge(request.Type || request.type)}</TableCell>
              <TableCell>{getStatusBadge(request.Status || request.status)}</TableCell>
              <TableCell>{request.MaintenancePerson?.User?.Name || request.assignedTo || '-'}</TableCell>
              <TableCell>{request.ScheduledDate ? new Date(request.ScheduledDate).toLocaleDateString() : '-'}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onViewRequest(request)}>
                  <Eye className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MaintenanceTable;
