import './App.css'
import {Route, Switch, Redirect} from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import JobItemDetails from './components/JobItemDetails'
import Jobs from './components/Jobs'
import ProtectedRoute from './components/ProtectedRoute'
import NotFound from './components/NotFound'

const App = () => (
  <div>
    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/jobs" component={Jobs} />
      <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
      <Route exact path="/not-found" component={NotFound} />
      <Redirect to="not-found" />
    </Switch>
  </div>
)

export default App
