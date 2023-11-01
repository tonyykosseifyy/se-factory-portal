import React from 'react'
import { Route, Switch } from "react-router-dom";
import { ROUTES_WITH_LAYOUT } from "./utils/routes";
import AuthRoute from "./router/AuthRoute";
import LoginRedirect from "./pages/LoginRedirect";
import Cookies from 'js-cookie';

const App = () => {

  Cookies.set('se-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNjk4MDQ3Mjg3LCJleHAiOjE3MDA2MzkyODd9.mRB3t-ycbGqwf4Hv1O5rH85wp04ih-7pkFKSNnjq95o');
  
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
