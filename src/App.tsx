import React, { Component, ErrorInfo, ReactNode, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SiteFrame } from './components/site-frame';
import { HomePage } from './HomePage';
import { SearchExperience } from './components/search-experience';
import { ProfileExperience } from './components/profile-experience';
import { DashboardView } from './components/app-shell';
import { MonitorExperience } from './components/monitor-experience';
import { PromisesExperience } from './components/promises-experience';
import { ContactExperience } from './components/contact-experience';
import { PetitionsExperience } from './components/petitions-experience';
import { CoverageExperience } from './components/coverage-experience';
import { AuthExperience } from './components/auth-experience';

// Elections Components
import { ElectionsLandingPage } from './components/elections-landing';
import { ElectionsMyDashboard } from './components/elections-my-dashboard';
import { ElectionsMyBallotPage } from './components/elections-my-ballot';
import { RacePageExperience } from './components/race-experience';
import { CandidatePageExperience } from './components/candidate-experience';
import { CandidatePipelinePage } from './components/candidate-pipeline-page';
import { CandidatesMapPage } from './components/candidates-map';
import { ElectionsMapPage } from './components/elections-map';
import { HermesElectionsAdminPage } from './components/elections-admin';
import { CompletenessAdmin } from './components/completeness-admin';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    fetch('/api/log-error', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ error: error.message, stack: error.stack, info: errorInfo.componentStack })
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center font-sans">
          <h1 className="text-xl font-bold text-red-600">Application Notice</h1>
          <p className="text-sm text-slate-600 mt-2">A temporary rendering issue occurred. Reloading page...</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs">
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <SiteFrame>
          <Suspense fallback={<div className="p-10 text-center font-sans font-bold text-slate-600">Loading CivicsLenZ...</div>}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchExperience />} />
              <Route path="/officials" element={<SearchExperience />} />
              <Route path="/officials/:slug" element={<ProfileExperience />} />
              <Route path="/dashboard" element={<DashboardView />} />
              <Route path="/monitor" element={<MonitorExperience section="AI Monitor" />} />
              <Route path="/alerts" element={<MonitorExperience section="Alerts" />} />
              <Route path="/watchlist" element={<MonitorExperience section="My Officials" />} />
              <Route path="/promises" element={<PromisesExperience />} />
              <Route path="/contact-official" element={<ContactExperience />} />
              <Route path="/petitions" element={<PetitionsExperience />} />
              <Route path="/coverage" element={<CoverageExperience />} />
              <Route path="/sign-in" element={<AuthExperience mode="sign-in" />} />
              <Route path="/sign-up" element={<AuthExperience mode="sign-up" />} />

              {/* Elections & Ballot System Routes */}
              <Route path="/elections" element={<ElectionsLandingPage />} />
              <Route path="/elections/candidates" element={<CandidatePipelinePage />} />
              <Route path="/candidates" element={<CandidatePipelinePage />} />
              <Route path="/elections/my" element={<ElectionsMyDashboard />} />
              <Route path="/elections/my-ballot" element={<ElectionsMyBallotPage />} />
              <Route path="/elections/race/:raceId" element={<RacePageExperience />} />
              <Route path="/elections/candidate/:candidateSlug" element={<CandidatePageExperience />} />
              <Route path="/elections/map" element={<CandidatesMapPage />} />
              <Route path="/candidates/map" element={<CandidatesMapPage />} />
              <Route path="/officials/map" element={<SearchExperience />} />
              <Route path="/admin/elections" element={<HermesElectionsAdminPage />} />
              <Route path="/admin/completeness" element={<CompletenessAdmin />} />

              <Route path="*" element={<div style={{padding: '100px 20px', textAlign: 'center'}}><h2>Work in Progress</h2><p>This page is currently under maintenance.</p></div>} />
            </Routes>
          </Suspense>
        </SiteFrame>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
