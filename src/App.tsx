import { KanbanProvider } from './contexts/KanbanContext';
import KanbanBoard from './components/KanbanBoard';
import './App.css';
import Header from './components/layouts/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Calendar from './components/Calendar';
import Analytics from './components/Analytics';

function App() {
  return (
    <BrowserRouter>
      <KanbanProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Header />
          <Routes>
            <Route path="/" element={<KanbanBoard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/dashboard" element={<Analytics />} />
          </Routes>
        </div>
      </KanbanProvider>
    </BrowserRouter>
  );
}

export default App;