import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { NewTripPage } from './pages/NewTripPage';
import { TripDetailPage } from './pages/TripDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="new-trip" element={<NewTripPage />} />
          <Route path="trip/:tripId" element={<TripDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
