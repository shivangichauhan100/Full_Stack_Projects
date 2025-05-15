import { useState } from "react";
import "./App.css";
import Navbar from "./Pages/Navbar";
import Manager from "./Pages/Manager";
import Footer from "./Pages/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Manager />
      </main>
      <Footer />
    </div>
  );
}

export default App;
