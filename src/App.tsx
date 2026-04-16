import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TicketProvider } from "./context/ticket/TicketContext";
import NavBar from "./components/NavBar";
import Gallery from "./pages/Gallery";
import Jobs from "./pages/Jobs";
import { Toaster } from "./components/ui/sonner";
import Parameters from "./pages/Parameters";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TicketProvider>
          <div className="min-h-screen dark">
            <Toaster position="bottom-left" richColors />
            <NavBar />
            <Routes>
              <Route path="/" element={<Gallery />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/parameters" element={<Parameters />} />
            </Routes>
          </div>
        </TicketProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
