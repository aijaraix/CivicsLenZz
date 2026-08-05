import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
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
import { trackedOfficials } from './lib/civic-database';




import React, { Component, ErrorInfo, ReactNode } from "react";
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
    // Send it to a local endpoint so we can see it in terminal!
    fetch('/api/log-error', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ error: error.message, stack: error.stack, info: errorInfo.componentStack })
    });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Check the terminal.</h1>;
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary><BrowserRouter>
      <SiteFrame>
        <Suspense fallback={<div style={{padding: 40}}>Loading...</div>}>
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
            <Route path="*" element={<div style={{padding: '100px 20px', textAlign: 'center'}}><h2>Work in Progress</h2><p>This page is currently under maintenance.</p></div>} />
          </Routes>
        </Suspense>
      </SiteFrame>
    </BrowserRouter></ErrorBoundary>
  );
}
