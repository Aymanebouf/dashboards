
import React from 'react';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useTheme } from '@/hooks/use-theme';

interface HeaderProps {
  sidebarExpanded: boolean;
  onSidebarToggle: () => void;
  title?: string;
}

const PrimeHeader: React.FC<HeaderProps> = ({ 
  sidebarExpanded, 
  onSidebarToggle, 
  title = 'Dashboard' 
}) => {
  const { theme, setTheme } = useTheme();
  const userMenuRef = React.useRef<Menu>(null);
  
  const userMenuItems = [
    {
      label: 'Profil',
      icon: 'pi pi-user'
    },
    {
      label: 'Paramètres',
      icon: 'pi pi-cog'
    },
    {
      label: 'Analytics',
      icon: 'pi pi-chart-bar'
    },
    {
      separator: true
    },
    {
      label: 'Log out',
      icon: 'pi pi-sign-out'
    }
  ];

  const startContent = (
    <div className="flex align-items-center">
      <Button
        icon={sidebarExpanded ? "pi pi-chevron-left" : "pi pi-chevron-right"}
        text
        rounded
        onClick={onSidebarToggle}
        className="mr-3"
      />
      <div className="flex align-items-center">
        <i className="pi pi-th-large mr-2 text-color-secondary"></i>
        <h1 className="text-xl font-semibold m-0">{title}</h1>
      </div>
    </div>
  );

  const endContent = (
    <div className="flex align-items-center gap-3">
      <span className="p-input-icon-left hidden md:inline-block">
        <i className="pi pi-search" />
        <InputText placeholder="Rechercher..." className="p-inputtext-sm" />
      </span>

      <Button icon="pi pi-bell" rounded text />
      
      <Button 
        icon={theme === 'dark' ? "pi pi-sun" : "pi pi-moon"} 
        rounded 
        text 
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      />

      <div>
        <Avatar 
          image="/avatar.jpg" 
          shape="circle" 
          className="cursor-pointer" 
          onClick={(e) => userMenuRef.current?.toggle(e)}
        />
        <Menu model={userMenuItems} popup ref={userMenuRef} />
      </div>
    </div>
  );

  return (
    <div className={`fixed top-0 border-bottom-1 bg-surface z-5 transition-all ${sidebarExpanded ? "left-17rem right-0" : "left-4rem right-0"}`}>
      <Toolbar
        start={startContent}
        end={endContent}
        className="border-none p-fluid"
      />
    </div>
  );
};

export default PrimeHeader;
