import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant: 'critical' | 'info' | 'success';
  subtitle?: string;
}

const StatCard = ({ title, value, icon: Icon, variant, subtitle }: StatCardProps) => {
  const variantStyles = {
    critical: 'bg-critical/10 border-critical/30 text-critical',
    info: 'bg-info/10 border-info/30 text-info',
    success: 'bg-success/10 border-success/30 text-success',
  };

  const iconBgStyles = {
    critical: 'bg-critical',
    info: 'bg-info',
    success: 'bg-success',
  };

  return (
    <div className={cn('rounded-xl border-2 p-6', variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-4xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-sm mt-1 opacity-70">{subtitle}</p>}
        </div>
        <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', iconBgStyles[variant])}>
          <Icon className="w-6 h-6 text-card" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
