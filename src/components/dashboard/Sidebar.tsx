
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BarChart2, 
  Tag, 
  Calendar, 
  MapPin, 
  Package, 
  Users, 
  Settings, 
  ClipboardList, 
  FileText, 
  Database,
  Wifi,
  Brain
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
  expanded?: boolean;
  onClick?: () => void;
  className?: string;
};

const NavItem: React.FC<NavItemProps> = ({ 
  icon, 
  label, 
  to, 
  isActive = false, 
  hasSubmenu = false,
  expanded = true,
  onClick,
  className = ""
}) => {
  const itemContent = (
    <div 
      className={cn(
        "flex items-center px-3 py-2 rounded-lg transition-all duration-200 group",
        isActive 
          ? "bg-logitag-primary text-white" 
          : "text-sidebar-foreground hover:bg-sidebar-accent",
        className
      )}
      onClick={onClick}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        {icon}
      </div>
      {expanded && (
        <span className="ml-3 text-sm font-medium">
          {label}
        </span>
      )}
      {hasSubmenu && expanded && (
        <span className="ml-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </div>
  );

  if (!expanded) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={to} className="block">
              {itemContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right" align="center" className="z-50">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link to={to} className="block">
      {itemContent}
    </Link>
  );
};

interface SidebarProps {
  expanded?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  expanded = true,
  onToggle
}) => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className={cn(
      "h-screen flex flex-col border-r border-border bg-sidebar fixed left-0 top-0 z-30 transition-all duration-300",
      expanded ? "w-64" : "w-16"
    )}>
      <div className="p-4 flex items-center">
        {expanded ? (
          <Logo className="mx-auto" />
        ) : (
          <Logo size="sm" className="mx-auto" />
        )}
      </div>
      
      <div className="mt-6 px-3 overflow-y-auto flex-grow">
        <NavItem 
          to="/" 
          icon={<LayoutDashboard size={18} />} 
          label="Dashboard" 
          isActive={path === '/'} 
          expanded={expanded}
        />
        <NavItem 
          to="/ai-predictions" 
          icon={<Brain size={18} />} 
          label="IA & Prédictions" 
          isActive={path === '/ai-predictions'} 
          expanded={expanded}
          className="bg-purple-50 text-purple-700 hover:bg-purple-100"
        />
        <NavItem 
          to="/resume" 
          icon={<ClipboardList size={18} />} 
          label="Résumé" 
          isActive={path === '/resume'} 
          expanded={expanded}
        />
        <NavItem 
          to="/infos-engins" 
          icon={<BarChart2 size={18} />} 
          label="Infos engins" 
          isActive={path === '/infos-engins'} 
          expanded={expanded}
        />
        <NavItem 
          to="/engins" 
          icon={<Package size={18} />} 
          label="Engins" 
          isActive={path === '/engins'} 
          expanded={expanded}
        />
        <NavItem 
          to="/tags" 
          icon={<Tag size={18} />} 
          label="Tags" 
          isActive={path === '/tags'} 
          expanded={expanded}
        />
        <NavItem 
          to="/calendrier" 
          icon={<Calendar size={18} />} 
          label="Calendrier" 
          isActive={path === '/calendrier'} 
          expanded={expanded}
        />
        <NavItem 
          to="/map" 
          icon={<MapPin size={18} />} 
          label="Map" 
          isActive={path === '/map'} 
          expanded={expanded}
        />
        <NavItem 
          to="/places" 
          icon={<MapPin size={18} />} 
          label="Places" 
          isActive={path === '/places'} 
          expanded={expanded}
          hasSubmenu={true}
        />
        <NavItem 
          to="/inventory" 
          icon={<Package size={18} />} 
          label="Inventory" 
          isActive={path === '/inventory'} 
          expanded={expanded}
        />
        <NavItem 
          to="/utilisateurs" 
          icon={<Users size={18} />} 
          label="Utilisateurs" 
          isActive={path === '/utilisateurs'} 
          expanded={expanded}
        />
        <NavItem 
          to="/parametres" 
          icon={<Settings size={18} />} 
          label="Paramètres" 
          isActive={path === '/parametres'} 
          expanded={expanded}
          hasSubmenu={true}
        />
        <NavItem 
          to="/rapports" 
          icon={<FileText size={18} />} 
          label="Rapports" 
          isActive={path === '/rapports'} 
          expanded={expanded}
        />
        <NavItem 
          to="/logs" 
          icon={<ClipboardList size={18} />} 
          label="LOGS" 
          isActive={path === '/logs'} 
          expanded={expanded}
        />
        <NavItem 
          to="/insertion-donnees" 
          icon={<Database size={18} />} 
          label="Insertion des données" 
          isActive={path === '/insertion-donnees'} 
          expanded={expanded}
        />
        
        <div className="pt-4 pb-2 px-3">
          <div className="h-px bg-border my-2"></div>
        </div>
        
        <NavItem 
          to="/gateway" 
          icon={<Wifi size={18} />} 
          label="GATEWAY" 
          isActive={path === '/gateway'} 
          expanded={expanded}
        />
        <NavItem 
          to="/rapports-presence" 
          icon={<FileText size={18} />} 
          label="Rapports de présence" 
          isActive={path === '/rapports-presence'} 
          expanded={expanded}
        />
      </div>
      
      <div className="p-3 border-t border-border text-xs text-muted-foreground py-2">
        {expanded && (
          <div className="flex justify-between items-center">
            <span>2023© omniyat | version 1.0.0</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
