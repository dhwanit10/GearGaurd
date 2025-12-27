import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MaintenanceRequest } from '@/types';
import { Clock, AlertTriangle, Wrench, Calendar, User, Building2, Package, Mail, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RequestDetailModalProps {
  request: any | null;
  open: boolean;
  onClose: () => void;
}

const RequestDetailModal = ({ request, open, onClose }: RequestDetailModalProps) => {
  if (!request) return null;

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
    return <Badge variant="outline" className={cn('text-base px-3 py-1', styles[statusLower] || styles.new)}>{labels[statusLower] || statusLower}</Badge>;
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-xl flex-1">{request.Subject || request.subject}</DialogTitle>
            {getStatusBadge(request.Status || request.status)}
          </div>
          <p className="text-sm text-muted-foreground font-mono">{request.Id || request.id}</p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Type Badge */}
          <div>
            {getTypeBadge(request.Type || request.type)}
          </div>

          {/* Main Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            {/* Subject */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="w-4 h-4" />
                Subject
              </div>
              <p className="font-medium">{request.Subject || request.subject}</p>
            </div>

            {/* Equipment */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4" />
                Equipment
              </div>
              <p className="font-medium">{request.Equipment?.Name || request.equipmentName}</p>
            </div>

            {/* Category */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="w-4 h-4" />
                Category
              </div>
              <p className="font-medium">{request.Category?.Name || request.category}</p>
            </div>

            {/* Status */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
                Status
              </div>
              {getStatusBadge(request.Status || request.status)}
            </div>

            {/* Maintenance Team */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wrench className="w-4 h-4" />
                Maintenance Team
              </div>
              <p className="font-medium">{request.MaintenanceTeam?.TeamName || request.maintenanceTeam || '-'}</p>
            </div>

            {/* Assigned Technician */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                Assigned To
              </div>
              <p className="font-medium">{request.MaintenancePerson?.User?.Name || request.assignedTo || '-'}</p>
            </div>

            {/* Creator */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                Created By
              </div>
              <p className="font-medium">{request.Creator?.Name || '-'}</p>
            </div>

            {/* Creator Email */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                Creator Email
              </div>
              <p className="font-medium text-sm">{request.Creator?.Email || '-'}</p>
            </div>

            {/* Equipment Details */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="w-4 h-4" />
                Serial No
              </div>
              <p className="font-medium">{request.Equipment?.SerialNo || '-'}</p>
            </div>

            {/* Equipment Department */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="w-4 h-4" />
                Department
              </div>
              <p className="font-medium">{request.Equipment?.Department || '-'}</p>
            </div>

            {/* Equipment Location */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Location
              </div>
              <p className="font-medium">{request.Equipment?.Location || '-'}</p>
            </div>

            {/* Equipment Status */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="w-4 h-4" />
                Equipment Status
              </div>
              <Badge variant="outline">{request.Equipment?.Status || '-'}</Badge>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="text-foreground whitespace-pre-wrap">{request.Description || request.description || '-'}</p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailModal;
