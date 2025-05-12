import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Send,
  History,
  Building2
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Segments',
    href: '/segments',
    icon: Users,
  },
  {
    title: 'Campaigns',
    href: '/campaigns',
    icon: Send,
  },
  {
    title: 'Campaign History',
    href: '/campaign-history',
    icon: History,
  },
];

const Sidebar = () => {
  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="flex h-screen w-64 flex-col border-r bg-card"
    >
      <div className="flex h-16 items-center border-b px-6 shrink-0">
        <div className="flex items-center gap-2 px-2">
          <Building2 className="h-6 w-6" />
          <h1 className="text-lg font-bold">Mini CRM</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium mb-1 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar; 