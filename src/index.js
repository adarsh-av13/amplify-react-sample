import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import EditUrlDetails from './pages/editUrlDetails';
import UrlDetails from './pages/urlDetails';
import UrlRedirect from './pages/urlRedirect';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import CreateUrl from './pages/createUrl';


ReactDOM.render(
  // <React.StrictMode>
    <Router>
      <Routes>
        {/* <Route path="/" element={ <Login /> } /> */}
        <Route path="/" element={ <App /> } />
        <Route path="/edit-url-details" element={ <EditUrlDetails /> } />
        <Route path="/create-url" element={ <CreateUrl /> } />
        <Route path="/url-details" element={ <UrlDetails /> } />
        <Route path="/:shorturl" element={ <UrlRedirect /> } />
      </Routes>
    </Router>,
  // </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
