
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BarChart2, Bell, ChevronLeft, ChevronRight, LayoutDashboard, Menu, Moon, Search, Settings, Sun, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/use-theme';

interface HeaderProps {
  sidebarExpanded: boolean;
  onSidebarToggle: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  sidebarExpanded, 
  onSidebarToggle, 
  title = 'Dashboard' 
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className={cn(
      "h-16 fixed top-0 border-b border-border/40 bg-background/80 backdrop-blur-md z-20 transition-all duration-300 flex items-center",
      sidebarExpanded ? "left-64 right-0" : "left-16 right-0"
    )}>
      <div className="px-4 flex items-center justify-between w-full">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="mr-4 text-muted-foreground hover:text-foreground hover:bg-primary/5"
          >
            {sidebarExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </Button>
          
          <div className="flex items-center">
            <LayoutDashboard className="mr-2 h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-72 pl-10 rounded-full bg-background border-border/40 focus-visible:ring-primary/20"
            />
          </div>

          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/5">
            <Bell size={18} />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full text-muted-foreground hover:text-foreground hover:bg-primary/5" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 ring-2 ring-background">
                  <AvatarImage src="/avatar.jpg" alt="@user" />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-1 p-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@logitag.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem className="rounded-md cursor-pointer p-2 flex gap-2">
                <User className="h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-md cursor-pointer p-2 flex gap-2">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-md cursor-pointer p-2 flex gap-2">
                <BarChart2 className="h-4 w-4" />
                <span>Analytics</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem className="rounded-md cursor-pointer p-2 text-destructive">
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
