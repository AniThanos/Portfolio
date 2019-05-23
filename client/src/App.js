import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Landing from './components/layouts/Landing';
import Navbar from './components/layouts/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

const App = () => (

  <Router>
    <Fragment>
      <Navbar />
      <Switch>
        <Route exact path='/' component={Landing} />
      </Switch>
      <section className='container'>
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
        </Switch>
      </section>
    </Fragment>
  </Router>

)

export default App;
