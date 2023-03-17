import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { ChartPage } from "./pages/ChartPage";
import { PortfolioPage } from "./pages/PortfolioPage";

function App() {
  return (
    <RecoilRoot>
      <React.StrictMode>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PortfolioPage />} />
            <Route path="chart" element={<ChartPage />} />
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Routes>
        </BrowserRouter>
      </React.StrictMode>
    </RecoilRoot>
  );
}

export default App;
