import LoadingScreen from "@/components/Loading";
import ROUTERS_PATHS from "@/constants/router-paths";
import MainAdminLayout from "@/layouts/MainAdminLayout";
import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

export interface IRoutesState {
  path?: string;
  layout?: any;
  component?: any;
  routes?: IRoutesState[];
}

export const renderRoutes = (routes: IRoutesState[]) => (
  <Suspense fallback={<LoadingScreen />}>
    <Routes>
      {routes.map((route, i) => {
        const Layout = route?.layout || React.Fragment;
        const Component = route.component;
        return (
          <Route
            key={i}
            path={route.path}
            element={
              <Layout>
                <Component />
              </Layout>
            }
          />
        );
      })}
    </Routes>
  </Suspense>
);

const routes: IRoutesState[] = [
  {
    layout: MainAdminLayout,
    path: ROUTERS_PATHS.ADMIN_AD,
    component: lazy(() => import("@/pages/AdminAds")),
  },
  {
    layout: MainAdminLayout,
    path: ROUTERS_PATHS.ADMIN_FORM_FACE,
    component: lazy(() => import("@/pages/AdminFormFace")),
  },
  {
    path: "*",
    component: () => <Navigate to={ROUTERS_PATHS.HOME} replace />,
  },
];

export default routes;
