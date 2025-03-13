
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';
import Logo from '../Logo';

const NavItem = ({ 
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
      className={classNames(
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
          <i className="pi pi-chevron-right" style={{ fontSize: '0.75rem' }}></i>
        </span>
      )}
    </div>
  );

  if (!expanded) {
    return (
      <div className="sidebar-tooltip-wrapper">
        <Link to={to} className="block">
          {itemContent}
        </Link>
        <Tooltip target=".sidebar-tooltip-wrapper" content={label} position="right" />
      </div>
    );
  }

  return (
    <Link to={to} className="block">
      {itemContent}
    </Link>
  );
};

const Sidebar = ({ 
  expanded = true,
  onToggle
}) => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className={classNames(
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
          icon={<i className="pi pi-home" style={{ fontSize: '1.125rem' }}></i>} 
          label="Dashboard" 
          isActive={path === '/'} 
          expanded={expanded}
        />
        <NavItem 
          to="/ai-predictions" 
          icon={<i className="pi pi-cog" style={{ fontSize: '1.125rem' }}></i>} 
          label="IA & Prédictions" 
          isActive={path === '/ai-predictions'} 
          expanded={expanded}
          className="bg-purple-50 text-purple-700 hover:bg-purple-100"
        />
        <NavItem 
          to="/resume" 
          icon={<i className="pi pi-file" style={{ fontSize: '1.125rem' }}></i>} 
          label="Résumé" 
          isActive={path === '/resume'} 
          expanded={expanded}
        />
        <NavItem 
          to="/infos-engins" 
          icon={<i className="pi pi-chart-bar" style={{ fontSize: '1.125rem' }}></i>} 
          label="Infos engins" 
          isActive={path === '/infos-engins'} 
          expanded={expanded}
        />
        <NavItem 
          to="/engins" 
          icon={<i className="pi pi-truck" style={{ fontSize: '1.125rem' }}></i>} 
          label="Engins" 
          isActive={path === '/engins'} 
          expanded={expanded}
        />
        <NavItem 
          to="/tags" 
          icon={<i className="pi pi-tag" style={{ fontSize: '1.125rem' }}></i>} 
          label="Tags" 
          isActive={path === '/tags'} 
          expanded={expanded}
        />
        <NavItem 
          to="/calendrier" 
          icon={<i className="pi pi-calendar" style={{ fontSize: '1.125rem' }}></i>} 
          label="Calendrier" 
          isActive={path === '/calendrier'} 
          expanded={expanded}
        />
        <NavItem 
          to="/map" 
          icon={<i className="pi pi-map-marker" style={{ fontSize: '1.125rem' }}></i>} 
          label="Map" 
          isActive={path === '/map'} 
          expanded={expanded}
        />
        <NavItem 
          to="/places" 
          icon={<i className="pi pi-map-marker" style={{ fontSize: '1.125rem' }}></i>} 
          label="Places" 
          isActive={path === '/places'} 
          expanded={expanded}
          hasSubmenu={true}
        />
        <NavItem 
          to="/inventory" 
          icon={<i className="pi pi-box" style={{ fontSize: '1.125rem' }}></i>} 
          label="Inventory" 
          isActive={path === '/inventory'} 
          expanded={expanded}
        />
        <NavItem 
          to="/utilisateurs" 
          icon={<i className="pi pi-users" style={{ fontSize: '1.125rem' }}></i>} 
          label="Utilisateurs" 
          isActive={path === '/utilisateurs'} 
          expanded={expanded}
        />
        <NavItem 
          to="/parametres" 
          icon={<i className="pi pi-cog" style={{ fontSize: '1.125rem' }}></i>} 
          label="Paramètres" 
          isActive={path === '/parametres'} 
          expanded={expanded}
          hasSubmenu={true}
        />
        <NavItem 
          to="/rapports" 
          icon={<i className="pi pi-file-pdf" style={{ fontSize: '1.125rem' }}></i>} 
          label="Rapports" 
          isActive={path === '/rapports'} 
          expanded={expanded}
        />
        <NavItem 
          to="/logs" 
          icon={<i className="pi pi-list" style={{ fontSize: '1.125rem' }}></i>} 
          label="LOGS" 
          isActive={path === '/logs'} 
          expanded={expanded}
        />
        <NavItem 
          to="/insertion-donnees" 
          icon={<i className="pi pi-database" style={{ fontSize: '1.125rem' }}></i>} 
          label="Insertion des données" 
          isActive={path === '/insertion-donnees'} 
          expanded={expanded}
        />
        
        <div className="pt-4 pb-2 px-3">
          <div className="h-px bg-border my-2"></div>
        </div>
        
        <NavItem 
          to="/gateway" 
          icon={<i className="pi pi-wifi" style={{ fontSize: '1.125rem' }}></i>} 
          label="GATEWAY" 
          isActive={path === '/gateway'} 
          expanded={expanded}
        />
        <NavItem 
          to="/rapports-presence" 
          icon={<i className="pi pi-file-pdf" style={{ fontSize: '1.125rem' }}></i>} 
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
