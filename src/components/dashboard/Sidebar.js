
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { classNames } from 'primereact/utils';
import { Tooltip } from 'primereact/tooltip';
import { PanelMenu } from 'primereact/panelmenu';
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
        "flex align-items-center px-3 py-2 border-round-lg transition-all duration-200",
        isActive 
          ? "bg-primary text-white" 
          : "text-color hover:surface-ground",
        className
      )}
      onClick={onClick}
    >
      <div className="w-2rem h-2rem flex align-items-center justify-content-center">
        <i className={icon}></i>
      </div>
      {expanded && (
        <span className="ml-3 text-sm font-medium">
          {label}
        </span>
      )}
      {hasSubmenu && expanded && (
        <span className="ml-auto">
          <i className="pi pi-chevron-right"></i>
        </span>
      )}
    </div>
  );

  if (!expanded) {
    return (
      <>
        <Tooltip target={`.nav-link-${label.replace(/\s+/g, '-').toLowerCase()}`} position="right" />
        <Link to={to} className={`nav-link-${label.replace(/\s+/g, '-').toLowerCase()} block`} data-pr-tooltip={label}>
          {itemContent}
        </Link>
      </>
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

  const menuItems = [
    {
      icon: "pi pi-th-large",
      label: "Dashboard",
      to: "/",
      isActive: path === '/'
    },
    {
      icon: "pi pi-bolt",
      label: "IA & Prédictions",
      to: "/ai-predictions",
      isActive: path === '/ai-predictions',
      className: "bg-purple-50 text-purple-700 hover:bg-purple-100"
    },
    {
      icon: "pi pi-list",
      label: "Résumé",
      to: "/resume",
      isActive: path === '/resume'
    },
    {
      icon: "pi pi-chart-bar",
      label: "Infos engins",
      to: "/infos-engins",
      isActive: path === '/infos-engins'
    },
    {
      icon: "pi pi-box",
      label: "Engins",
      to: "/engins",
      isActive: path === '/engins'
    },
    {
      icon: "pi pi-tag",
      label: "Tags",
      to: "/tags",
      isActive: path === '/tags'
    },
    {
      icon: "pi pi-calendar",
      label: "Calendrier",
      to: "/calendrier",
      isActive: path === '/calendrier'
    },
    {
      icon: "pi pi-map-marker",
      label: "Map",
      to: "/map",
      isActive: path === '/map'
    },
    {
      icon: "pi pi-map-marker",
      label: "Places",
      to: "/places",
      isActive: path === '/places',
      hasSubmenu: true
    },
    {
      icon: "pi pi-box",
      label: "Inventory",
      to: "/inventory",
      isActive: path === '/inventory'
    },
    {
      icon: "pi pi-users",
      label: "Utilisateurs",
      to: "/utilisateurs",
      isActive: path === '/utilisateurs'
    },
    {
      icon: "pi pi-cog",
      label: "Paramètres",
      to: "/parametres",
      isActive: path === '/parametres',
      hasSubmenu: true
    },
    {
      icon: "pi pi-file",
      label: "Rapports",
      to: "/rapports",
      isActive: path === '/rapports'
    },
    {
      icon: "pi pi-list",
      label: "LOGS",
      to: "/logs",
      isActive: path === '/logs'
    },
    {
      icon: "pi pi-database",
      label: "Insertion des données",
      to: "/insertion-donnees",
      isActive: path === '/insertion-donnees'
    },
    {
      icon: "pi pi-wifi",
      label: "GATEWAY",
      to: "/gateway",
      isActive: path === '/gateway'
    },
    {
      icon: "pi pi-file",
      label: "Rapports de présence",
      to: "/rapports-presence",
      isActive: path === '/rapports-presence'
    }
  ];

  return (
    <div className={classNames(
      "h-screen flex flex-column border-right-1 bg-surface fixed left-0 top-0 z-5 transition-all duration-300",
      expanded ? "w-64" : "w-16"
    )}>
      <div className="p-3 flex align-items-center justify-content-center">
        {expanded ? (
          <Logo className="mx-auto" />
        ) : (
          <Logo size="sm" className="mx-auto" />
        )}
      </div>
      
      <div className="mt-3 px-2 overflow-y-auto flex-grow-1">
        {expanded ? (
          menuItems.map((item, index) => (
            <NavItem 
              key={index}
              to={item.to} 
              icon={item.icon} 
              label={item.label} 
              isActive={item.isActive} 
              expanded={expanded}
              hasSubmenu={item.hasSubmenu}
              className={item.className}
            />
          ))
        ) : (
          menuItems.map((item, index) => (
            <NavItem 
              key={index}
              to={item.to} 
              icon={item.icon} 
              label={item.label} 
              isActive={item.isActive} 
              expanded={expanded}
              hasSubmenu={item.hasSubmenu}
              className={item.className}
            />
          ))
        )}
      </div>
      
      <div className="p-3 border-top-1 text-xs text-color-secondary py-2">
        {expanded && (
          <div className="flex justify-content-between align-items-center">
            <span>2023© omniyat | version 1.0.0</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
