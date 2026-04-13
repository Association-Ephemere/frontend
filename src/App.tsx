import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import NavBar from './components/NavBar'
import Gallery from './pages/Gallery'
import Jobs from './pages/Jobs'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-stone-50 text-stone-900">
          <NavBar />
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/jobs" element={<Jobs />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}