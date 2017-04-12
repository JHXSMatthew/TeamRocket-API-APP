import React from 'react';
import { Router, Route, IndexRoute, hashHistory } from 'react-router';

// Containers
import Full from './containers/Full/'
import Simple from './containers/Simple/'

// OUR VIEWS
import Home from './views/Statistics/Home'
import Release from './views/Statistics/Release/'
import DataAnalyzer from './views/Statistics/DataAnalyzer'
import DeveloperAPI from './views/Statistics/Doc/DeveloperAPI'
  import ParameterConstraints from './views/Statistics/Doc/DeveloperAPI/ParameterConstraints'
  import Retail from './views/Statistics/Doc/DeveloperAPI/Retail'
  import MerchandiseExports from './views/Statistics/Doc/DeveloperAPI/MerchandiseExports'
  import Errors from './views/Statistics/Doc/DeveloperAPI/Errors'
import Documentation from './views/Statistics/Doc/Documentation' //for getting started
import DataAnalyzerDoc from './views/Statistics/Doc/DataAnalyzerDoc'
import About from './views/Others/About/'


export default (
  <Router history={hashHistory}>
    <Route path="/" name="Home" component={Full}>
      <IndexRoute component={Home}/>
      <Route path="home" name="Home" component={Home}/>
      <Route path="release" name="Release" component={Release}/>
      <Route path="dataAnalyzer" name="Data Analyzer" component={DataAnalyzer}/>
      <Route path="documentation/" name="Documentation" >
        <Route path="gettingStarted" name="GettingStarted" component={Documentation}/>
        <Route path="DataAnalyzerDoc" name="DataAnalyzerDoc" component={DataAnalyzerDoc}/>
        <Route path="developerAPI" name="Developer API" component={DeveloperAPI}/>
          <Route path="ParameterConstraints" name="Parameter Constraints" component={ParameterConstraints}/>
          <Route path="Retail" name="Retail" component={Retail}/>
          <Route path="MerchandiseExports" name="Merchanise Exports" component={MerchandiseExports}/>
          <Route path="Errors" name="Errors" component={Errors}/>
      </Route>
      <Route path="about" name="About" component={About}/>
    </Route>
  </Router>
);
