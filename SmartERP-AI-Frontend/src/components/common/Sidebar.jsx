import { NavLink } from "react-router-dom";
import { sidebarMenus } from "../../config/sidebarMenus";

const Sidebar = ({ userRole }) => {
  // Get menus according to role
  const menus = sidebarMenus[userRole] || [];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-white">
      
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">
          ERP
        </h1>
      </div>

      {/* Sidebar Menu */}
      <nav className="p-4">
        <ul className="space-y-2">

          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <li key={menu.path}>

                <NavLink
                  to={menu.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon size={20} />

                  <span>
                    {menu.label}
                  </span>

                </NavLink>

              </li>
            );
          })}

        </ul>
      </nav>

    </aside>
  );
};

export default Sidebar;