import {
  HomePage,
  employeeManagementPage,
  CompanyProfilePage,
  EmployeePage,
  HolidayPage,
  newEmployeePage,
} from "./pages";
import { withNavigationWatcher } from "./contexts/navigation";

const routes = [
  {
    path: "/employeeManagement",
    element: employeeManagementPage,
  },
  {
    path: "/companyProfile",
    element: CompanyProfilePage,
  },
  {
    path: "/employee",
    element: EmployeePage,
  },
  {
    path: "/home",
    element: HomePage,
  },
  {
    path: "/newEmployee",
    element: newEmployeePage,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});
