import './App.css'
import {Outlet} from "react-router-dom";
import Header from "./components/Header/Header.tsx";
import Footer from "./components/Footer/Footer.tsx";
import AppSidebar from "./components/Sidebar/AppSidebar.tsx";

function App() {
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
