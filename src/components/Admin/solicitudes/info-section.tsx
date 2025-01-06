import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoSectionProps {
  title: string;
  icon: LucideIcon;
  bgColor?: string;
  iconColor?: string;
  children: ReactNode;
}

const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  icon: Icon,
  bgColor = "bg-white",
  iconColor = "text-gray-600",
  children
}) => {
  return (
    <div className="border-t">
      <div className={`${bgColor} p-4`}>
        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          {title}
        </h3>
        <div className="mt-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export default InfoSection;