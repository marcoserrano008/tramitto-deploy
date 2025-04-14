import './App.css'
import {Outlet} from "react-router-dom";
import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import AppSidebar from "./components/Sidebar/AppSidebar.tsx";
import {useAuth} from "./context/AuthContext.tsx";

function App() {

  const { loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  return (
    <>
      <header className="header-container">
        <Header/>
      </header>

      <main className="main-container">
        <section className="sidebar-container">
          <AppSidebar/>
        </section>

        <section className="outlet-container">

          <Outlet/>
        </section>
      </main>

      <footer className="footer-container">
        <Footer/>
      </footer>
    </>
  )
}

export default App
