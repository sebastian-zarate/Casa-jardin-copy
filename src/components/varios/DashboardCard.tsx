import { LucideIcon } from 'lucide-react';
import { Card } from './ui/card';
import { cn } from '@/lib/util';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  gradient: string;
  className?: string;
}

export function DashboardCard({
  title,
  description,
  icon: Icon,
  onClick,
  gradient,
  className,
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        'group relative overflow-hidden cursor-pointer transition-all duration-300',
        'border-none shadow-lg hover:shadow-xl',
        gradient,
        className
      )}
      onClick={onClick}
    >
      <div className="relative p-6">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Icon className="h-24 w-24 text-white transform -rotate-12" />
        </div>
        <div className="space-y-4">
          <div className="inline-block rounded-lg bg-white/20 p-3">
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-white">{title}</h3>
            <p className="text-sm text-white/80">{description}</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
    </Card>
  );
}