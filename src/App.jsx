import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import HomeView from "./Views/HomeView.jsx";
import RegisterView from "./Views/RegisterView.jsx";
import LoginView from "./Views/LoginView.jsx";
import MoviesView from "./Views/MoviesView.jsx";
import GenreView from "./Views/GenreView.jsx";
import DetailView from "./Views/DetailView.jsx";
import ErrorView from "./Views/ErrorView.jsx";
import CartView from "./Views/CartView.jsx";
import SearchView from "./Views/SearchView.jsx";
import SettingsView from "./Views/SettingsView.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/movies" element={<MoviesView />}>
          <Route path="genre/:genre_id" element={<GenreView />} />
          <Route path="/movies/details/:id" element={<DetailView />} />
          <Route path="search" element={<SearchView />} />
          <Route path="search/details/:id" element={<DetailView />} />
        </Route>
        <Route path="/cart" element={<CartView />} />
        <Route path="/settings" element={<SettingsView />} />
        <Route path="*" element={<ErrorView />} />
      </Routes>
    </Router>
  );
}

export default App;