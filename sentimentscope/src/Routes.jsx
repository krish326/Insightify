import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProductAnalysisDashboard from "pages/product-analysis-dashboard";
import AnalysisResultsDetailView from "pages/analysis-results-detail-view";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<ProductAnalysisDashboard />} />
          <Route path="/product-analysis-dashboard" element={<ProductAnalysisDashboard />} />
          <Route path="/analysis-results-detail-view" element={<AnalysisResultsDetailView />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;