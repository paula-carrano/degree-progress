import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./Components/Layout/Layout";
import { Home, Dashboard, ImportExcel } from "./Pages/index";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="import-excel" element={<ImportExcel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
