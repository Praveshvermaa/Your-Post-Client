// src/App.jsx

import { useToast } from "@/hooks/use-toast"; // Adjust the import path if needed
 // Adjust the import path if needed

import { ModeToggle } from "./components/mode-toggle";
import Navbar from "./components/Navbar";

function App() {
  const { toast } = useToast();

  return (
   <div><Navbar/></div>
  );
}

export default App;
