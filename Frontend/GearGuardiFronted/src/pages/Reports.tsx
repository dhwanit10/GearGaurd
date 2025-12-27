import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { get } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [requestsData, equipmentData]: any = await Promise.all([
          get('MaintenanceRequest'),
          get('Equipment'),
        ]);
        setMaintenanceRequests(requestsData || []);
        setEquipment(equipmentData || []);
      } catch (err: any) {
        toast({
          title: 'Failed to load reports data',
          description: err?.message || 'Error loading reports',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const statusData = [
    { name: 'New', value: maintenanceRequests.filter(r => (r.Status || r.status || '').toLowerCase() === 'new').length, color: 'hsl(217, 91%, 60%)' },
    { name: 'In Progress', value: maintenanceRequests.filter(r => (r.Status || r.status || '').toLowerCase() === 'in_progress').length, color: 'hsl(38, 92%, 50%)' },
    { name: 'Repaired', value: maintenanceRequests.filter(r => (r.Status || r.status || '').toLowerCase() === 'repaired').length, color: 'hsl(142, 76%, 36%)' },
    { name: 'Scrap', value: maintenanceRequests.filter(r => (r.Status || r.status || '').toLowerCase() === 'scrap').length, color: 'hsl(0, 0%, 45%)' },
  ];

  const typeData = [
    { name: 'Corrective', value: maintenanceRequests.filter(r => (r.Type || r.type || '').toLowerCase() === 'corrective').length },
    { name: 'Preventive', value: maintenanceRequests.filter(r => (r.Type || r.type || '').toLowerCase() === 'preventive').length },
  ];

  const equipmentStatusData = [
    { name: 'Operational', value: equipment.filter(e => (e.Status || e.status || '').toLowerCase() === 'operational').length, color: 'hsl(142, 76%, 36%)' },
    { name: 'Maintenance', value: equipment.filter(e => (e.Status || e.status || '').toLowerCase() === 'maintenance').length, color: 'hsl(38, 92%, 50%)' },
    { name: 'Breakdown', value: equipment.filter(e => (e.Status || e.status || '').toLowerCase() === 'breakdown').length, color: 'hsl(0, 84%, 60%)' },
    { name: 'Scrap', value: equipment.filter(e => (e.Status || e.status || '').toLowerCase() === 'scrap').length, color: 'hsl(0, 0%, 45%)' },
  ];

  const categoryData = equipment.reduce((acc, eq) => {
    const catName = eq.Category?.Name || eq.category || 'Unknown';
    const existing = acc.find((item: any) => item.name === catName);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ name: catName, count: 1 });
    }
    return acc;
  }, [] as { name: string; count: number }[]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Analytics and insights for maintenance operations</p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Request Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Request Type Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Request Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={typeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-muted-foreground" />
                    <YAxis className="text-muted-foreground" />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(161, 93%, 30%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Equipment Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={equipmentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {equipmentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Equipment by Category Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Equipment by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" className="text-muted-foreground" />
                    <YAxis dataKey="name" type="category" className="text-muted-foreground" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
