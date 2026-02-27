import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import WizardPage from './pages/WizardPage';

function App() {
  return (
    <BrowserRouter basename="/risk">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<WizardPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
