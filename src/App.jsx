

import { useToast } from "@/hooks/use-toast"; 
 

import { ModeToggle } from "./components/mode-toggle";
import Navbar from "./components/Navbar";

function App() {
  const { toast } = useToast();

  return (
   <div><Navbar/></div>
  );
}

export default App;
