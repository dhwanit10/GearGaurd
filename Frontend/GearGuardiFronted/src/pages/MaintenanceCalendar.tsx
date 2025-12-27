import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MaintenanceRequest } from '@/types';
import { ChevronLeft, ChevronRight, Plus, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { get } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isToday,
  parseISO,
} from 'date-fns';

const MaintenanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getRequestsForDate = (date: Date) => {
    return maintenanceRequests.filter(req => {
      try {
        const reqDate = parseISO(req.CreatedAt || req.ScheduledDate || req.scheduledDate || '');
        return isSameDay(reqDate, date);
      } catch {
        return false;
      }
    });
  };

  const getStatusColor = (status: string = 'new') => {
    const statusLower = (status || '').toLowerCase();
    const colors: any = {
      'new': 'bg-info',
      'in_progress': 'bg-warning',
      'repaired': 'bg-success',
      'scrap': 'bg-muted',
    };
    return colors[statusLower] || colors.new;
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Maintenance Calendar</h1>
            <p className="text-muted-foreground mt-1">View and schedule maintenance activities</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Schedule Maintenance
          </Button>
        </div>

        {/* Calendar */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold">{format(currentDate, 'MMMM yyyy')}</h2>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Week Days Header */}
          <div className="grid grid-cols-7 border-b border-border">
            {weekDays.map(day => (
              <div key={day} className="py-3 text-center text-sm font-medium text-muted-foreground bg-muted/30">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => {
              const dayRequests = getRequestsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isDayToday = isToday(day);

              return (
                <div
                  key={index}
                  className={cn(
                    'min-h-[120px] border-b border-r border-border p-2 transition-colors cursor-pointer hover:bg-muted/20',
                    !isCurrentMonth && 'bg-muted/10 text-muted-foreground',
                    isDayToday && 'bg-primary/5'
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className={cn(
                    'text-sm font-medium mb-1',
                    isDayToday && 'w-7 h-7 bg-primary text-primary-foreground rounded-full flex items-center justify-center'
                  )}>
                    {format(day, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayRequests.slice(0, 2).map(req => (
                      <div
                        key={req.Id || req.id}
                        className={cn(
                          'text-xs p-1 rounded truncate text-card cursor-pointer',
                          getStatusColor(req.Status || req.status)
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(req);
                        }}
                      >
                        {req.Subject || req.subject}
                      </div>
                    ))}
                    {dayRequests.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayRequests.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-info" />
            <span className="text-sm text-muted-foreground">New</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-warning" />
            <span className="text-sm text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-success" />
            <span className="text-sm text-muted-foreground">Repaired</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-muted" />
            <span className="text-sm text-muted-foreground">Scrap</span>
          </div>
        </div>
      </div>

      {/* Request Detail Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedRequest?.Subject || selectedRequest?.subject}</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Equipment</p>
                  <p className="font-medium">{selectedRequest.Equipment?.Name || selectedRequest.equipmentName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{selectedRequest.Category?.Name || selectedRequest.category}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant="outline">{selectedRequest.Type || selectedRequest.type}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline">{selectedRequest.Status || selectedRequest.status}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Team</p>
                  <p className="font-medium">{selectedRequest.MaintenanceTeam?.TeamName || selectedRequest.assignedTeam || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Assigned To</p>
                  <p className="font-medium">{selectedRequest.MaintenancePerson?.User?.Name || selectedRequest.assignedTo || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <p className="font-medium">{selectedRequest.Creator?.Name || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Creator Email</p>
                  <p className="font-medium text-sm">{selectedRequest.Creator?.Email || '-'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-foreground">{selectedRequest.Description || selectedRequest.description || '-'}</p>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MaintenanceCalendar;
