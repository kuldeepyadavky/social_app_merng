import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import MenuBar from './components/MenuBar';
import { Container } from 'semantic-ui-react';

function App() {
	return (
		<Router>
			<Container>
				<MenuBar />
				<Switch>
					<Route exact path='/' component={Home} />
					<Route exact path='/login' component={Login} />
					<Route exact path='/register' component={Register} />
				</Switch>
			</Container>
		</Router>
	);
}

export default App;
