import { Link, Route, Routes } from "react-router-dom";
import { AuthWrapper, AuthData } from "../../provider/authProvider";
import { nav } from "./navigation";
import { AuthProviderType } from "../../@types/authTypes";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";

export const RenderInfo = () => {
  const { user } = AuthData() as AuthProviderType;
  return (
    <div>
      GAAA
      {user.name}
      {user.role}
    </div>
  );
};

export const RenderRoutes = () => {
  const { user } = AuthData() as AuthProviderType;

  return (
    <Routes>
      {nav.map((r, i) => {
        if (r.isPrivate && user.isAuthenticated) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else if (!r.isPrivate) {
          return <Route key={i} path={r.path} element={r.element} />;
        } else return false;
      })}
    </Routes>
  );
};

export const RenderMenu = () => {
  const { user, logout } = AuthData() as AuthProviderType;

  const MenuItem = ({ value, path, name }) => {
    return (
      <Tab key={value} value={value} className="menuItem">
        <Link to={path}>{name}</Link>
      </Tab>
    );
  };
  return (
    <div>
      <div className="menu">
        {nav.map((r, i) => {
          if (user.isAuthenticated && r.isMenu) {
            return (
              <MenuItem
                value={r.name.toLowerCase()}
                path={r.path}
                name={r.name}
              />
            );
          } else return false;
        })}
      </div>
      {user.isAuthenticated ? (
        <div className="flex">
          <button onClick={logout}> logout</button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
