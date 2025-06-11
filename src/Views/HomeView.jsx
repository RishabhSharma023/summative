import "./HomeView.css";
import Header from "../Components/Header.jsx";
import Hero from "../Components/Hero.jsx";
import Feature from "../Components/Feature.jsx";
import Footer from "../Components/Footer.jsx";

function HomeView() {
  return (
    <div className="home-page">
      <Header/>
      <Hero/>
      <Feature/>
      <Footer/>
    </div>
  );
}

export default HomeView;