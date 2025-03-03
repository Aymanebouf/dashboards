
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PanelMenu } from 'primereact/panelmenu';
import { Tooltip } from 'primereact/tooltip';
import Logo from '../Logo';

interface SidebarProps {
  expanded?: boolean;
  onToggle?: () => void;
}

const PrimeSidebar: React.FC<SidebarProps> = ({ 
  expanded = true,
  onToggle
}) => {
  const location = useLocation();
  const path = location.pathname;

  const getActiveClass = (route: string) => {
    return path === route ? "bg-primary text-white" : "";
  };

  const menuItems = [
    {
      label: expanded ? 'Dashboard' : '',
      icon: 'pi pi-th-large',
      className: `p-ripple ${getActiveClass('/')}`,
      template: (item: any, options: any) => {
        return (
          <Link to="/" className={`p-menuitem-link ${options.className}`}>
            <span className={options.iconClassName}></span>
            {expanded && <span className={options.labelClassName}>{item.label}</span>}
          </Link>
        );
      }
    },
    {
      label: expanded ? 'IA & Prédictions' : '',
      icon: 'pi pi-bolt',
      className: `p-ripple ${getActiveClass('/ai-predictions')}`,
      template: (item: any, options: any) => {
        return (
          <Link to="/ai-predictions" className={`p-menuitem-link ${options.className}`}>
            <span className={options.iconClassName}></span>
            {expanded && <span className={options.labelClassName}>{item.label}</span>}
          </Link>
        );
      }
    },
    {
      label: expanded ? 'Résumé' : '',
      icon: 'pi pi-list',
      className: `p-ripple ${getActiveClass('/resume')}`,
      template: (item: any, options: any) => {
        return (
          <Link to="/resume" className={`p-menuitem-link ${options.className}`}>
            <span className={options.iconClassName}></span>
            {expanded && <span className={options.labelClassName}>{item.label}</span>}
          </Link>
        );
      }
    },
    {
      label: expanded ? 'Infos engins' : '',
      icon: 'pi pi-chart-bar',
      className: `p-ripple ${getActiveClass('/infos-engins')}`,
      template: (item: any, options: any) => {
        return (
          <Link to="/infos-engins" className={`p-menuitem-link ${options.className}`}>
            <span className={options.iconClassName}></span>
            {expanded && <span className={options.labelClassName}>{item.label}</span>}
          </Link>
        );
      }
    },
    {
      label: expanded ? 'Engins' : '',
      icon: 'pi pi-box',
      className: `p-ripple ${getActiveClass('/engins')}`,
      template: (item: any, options: any) => {
        return (
          <Link to="/engins" className={`p-menuitem-link ${options.className}`}>
            <span className={options.iconClassName}></span>
            {expanded && <span className={options.labelClassName}>{item.label}</span>}
          </Link>
        );
      }
    },
    {
      label: expanded ? 'Tags' : '',
      icon: 'pi pi-tag',
      className: `p-ripple ${getActiveClass('/tags')}`,
      template: (item: any, options: any) => {
        return (
          <Link to="/tags" className={`p-menuitem-link ${options.className}`}>
            <span className={options.iconClassName}></span>
            {expanded && <span className={options.labelClassName}>{item.label}</span>}
          </Link>
        );
      }
    },
    {
      label: expanded ? 'Calendrier' : '',
      icon: 'pi pi-calendar',
      className: `p-ripple ${getActiveClass('/calendrier')}`,
      template: (item: any, options: any) => {
        return (
          <Link to="/calendrier" className={`p-menuitem-link ${options.className}`}>
            <span className={options.iconClassName}></span>
            {expanded && <span className={options.labelClassName}>{item.label}</span>}
          </Link>
        );
      }
    },
    {
      label: expanded ? 'Map' : '',
      icon: 'pi pi-map-marker',
      className: `p-ripple ${getActiveClass('/map')}`,
      template: (item: any, options: any) => {
        return (
          <Link to="/map" className={`p-menuitem-link ${options.className}`}>
            <span className={options.iconClassName}></span>
            {expanded && <span className={options.labelClassName}>{item.label}</span>}
          </Link>
        );
      }
    },
    {
      label: expanded ? 'Places' : '',
      icon: 'pi pi-map-marker',
      className: `p-ripple ${getActiveClass('/places')}`,
      template: (item: any, options: any) => {
        return (
          <Link to="/places" className={`p-menuitem-link ${options.className}`}>
            <span className={options.iconClassName}></span>
            {expanded && <span className={options.labelClassName}>{item.label}</span>}
            {expanded && <i className="pi pi-chevron-right ml-auto"></i>}
          </Link>
        );
      }
    },
    {
      label: expanded ? 'Inventory' : '',
      icon: 'pi pi-box',
      className: `p-ripple ${getActiveClass('/inventory')}`,
      template: (item: any, options: any) => {
        return (
          <Link to="/inventory" className={`p-menuitem-link ${options.className}`}>
            <span className={options.iconClassName}></span>
            {expanded && <span className={options.labelClassName}>{item.label}</span>}
          </Link>
        );
      }
    },
    {
      label: expanded ? 'Utilisateurs' : '',
      icon: 'pi pi-users',
      className: `p-ripple ${getActiveClass('/utilisateurs')}`,
      template: (item: any, options: any) => {
        return (
          <Link to="/utilisateurs" className={`p-menuitem-link ${options.className}`}>
            <span className={options.iconClassName}></span>
            {expanded && <span className={options.labelClassName}>{item.label}</span>}
          </Link>
        );
      }
    },
    {
      label: expanded ? 'Paramètres' : '',
      icon: 'pi pi-cog',
      className: `p-ripple ${getActiveClass('/parametres')}`,
      template: (item: any, options: any) => {
        return (
          <Link to="/parametres" className={`p-menuitem-link ${options.className}`}>
            <span className={options.iconClassName}></span>
            {expanded && <span className={options.labelClassName}>{item.label}</span>}
            {expanded && <i className="pi pi-chevron-right ml-auto"></i>}
          </Link>
        );
      }
    },
    {
      label: expanded ? 'Rapports' : '',
      icon: 'pi pi-file',
      className: `p-ripple ${getActiveClass('/rapports')}`,
      template: (item: any, options: any) => {
        return (
          <Link to="/rapports" className={`p-menuitem-link ${options.className}`}>
            <span className={options.iconClassName}></span>
            {expanded && <span className={options.labelClassName}>{item.label}</span>}
          </Link>
        );
      }
    }
  ];

  return (
    <div className={`h-screen flex flex-column border-right-1 fixed left-0 top-0 z-5 transition-all ${expanded ? "w-17rem" : "w-4rem"}`}>
      <div className="p-3 flex align-items-center justify-content-center">
        {expanded ? (
          <Logo className="mx-auto" />
        ) : (
          <Logo size="sm" className="mx-auto" />
        )}
      </div>
      
      <div className="mt-4 overflow-y-auto flex-grow-1 px-2">
        {!expanded && (
          <>
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <Tooltip target={`.nav-icon-${index}`} position="right" />
                <div 
                  className={`nav-icon-${index} flex align-items-center justify-content-center p-2 mb-2 border-round cursor-pointer ${item.className}`} 
                  data-pr-tooltip={item.label}
                >
                  <i className={`${item.icon} text-xl`}></i>
                </div>
              </React.Fragment>
            ))}
          </>
        )}
        {expanded && <PanelMenu model={menuItems} className="border-none" multiple={false} />}
      </div>
      
      <div className="p-2 border-top-1 text-xs text-color-secondary py-2 text-center">
        {expanded && (
          <div>
            <span>2023© omniyat | version 1.0.0</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrimeSidebar;
