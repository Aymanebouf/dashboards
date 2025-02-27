
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
      "h-16 fixed top-0 border-b border-border bg-background z-20 transition-all duration-300 flex items-center",
      sidebarExpanded ? "left-64 right-0" : "left-16 right-0"
    )}>
      <div className="px-4 flex items-center justify-between w-full">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="mr-4"
          >
            {sidebarExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </Button>
          
          <div className="flex items-center">
            <LayoutDashboard className="mr-2 h-5 w-5 text-muted-foreground" />
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-64 pl-8 rounded-full bg-muted/50 border-none focus-visible:ring-1"
            />
          </div>

          <Button variant="outline" size="icon" className="rounded-full">
            <Bell size={18} />
          </Button>

          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatar.jpg" alt="@user" />
                  <AvatarFallback className="bg-primary/10 text-primary">U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@logitag.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BarChart2 className="mr-2 h-4 w-4" />
                <span>Analytics</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
