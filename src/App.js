import React from 'react'
import {Route, Switch} from "react-router-dom";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import {ROUTES_WITH_LAYOUT} from "./utils/routes";
import AuthRoute from "./router/AuthRoute";
import LoginRedirect from "./pages/LoginRedirect";
import Cookies from 'js-cookie';

const App = () => {
  // me temporary, for testing only
  Cookies.set('se-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjEsImlhdCI6MTY5MDAyNTc2OSwiZXhwIjoxNjkyNjE3NzY5fQ.KSMGsFFaBfXbeLP2XhyhTLOPWEPYBBU_Jllcq7fk878');
  // Cookies.set('se-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTksImlhdCI6MTY4OTMyODMzNSwiZXhwIjoxNjkxOTIwMzM1fQ.6nFT0bOm6LtX3_xigwNQXDuiY_qu0EP_-rVg-F73eBA')
  return (
      <Switch>
          <Route exact path="/connect/:providerName" component={LoginRedirect} />

          {
              ROUTES_WITH_LAYOUT.map(({layout: Layout, routes, basePath, exact}, index) =>
              {

                return (
                    <Route key={index} path={basePath} exact={exact}>
                      <Layout>
                        <Switch>
                          {routes.map(({path, component, protectedRoute, exact: exactRoute}, index) => {
                              return (
                                  protectedRoute?
                                  <AuthRoute key={`route-${index}-pro`} path={path} exact={exactRoute} component={component}/>
                                      :
                                  <Route key={`route-${index}`} path={path} exact={exactRoute} component={component}/>
                              )
                            }
                          )}
                        </Switch>
                      </Layout>
                    </Route>
                  )
              }
              )
          }</Switch>
  );
}

export default App;
