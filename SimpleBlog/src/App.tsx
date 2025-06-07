import './App.css';

import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

function App() {
	return (
		<>
			<LoginPage />
			<SignUpPage />
			<CreateBlog />
			<EditBlog />
		</>
	);
}

export default App;
