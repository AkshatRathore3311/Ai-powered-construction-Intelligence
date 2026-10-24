import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';

import DashboardPage from './pages/Dashboard/DashboardPage';
import SafetyMonitoringPage from './pages/Safety/SafetyMonitoringPage';
import CrackDetectionPage from './pages/CrackDetection/CrackDetectionPage';
import ValuationPage from './pages/Valuation/ValuationPage';
import PlanningPage from './pages/Planning/PlanningPage';
import DailySiteWeatherPage from './pages/DailySiteWeather/DailySiteWeatherPage';
import AssistantPage from './pages/Assistant/AssistantPage';
import HistoryPage from './pages/History/HistoryPage';
import SettingsPage from './pages/Settings/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="safety" element={<SafetyMonitoringPage />} />
          <Route path="crack-detection" element={<CrackDetectionPage />} />
          <Route path="valuation" element={<ValuationPage />} />
          <Route path="planning" element={<PlanningPage />} />
          <Route path="daily-weather" element={<DailySiteWeatherPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
