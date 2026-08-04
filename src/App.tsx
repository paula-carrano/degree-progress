import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./Components/Layout/Layout";
import {
  Correlativas,
  Historial,
  Home,
  ImportExcel,
  Materias,
  Login,
  NotFound,
} from "./Pages/index";
import { ProtectedRoute } from "./Components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="materias" element={<Materias />} />
            <Route path="correlativas" element={<Correlativas />} />
            <Route path="historial" element={<Historial />} />
            <Route path="import-excel" element={<ImportExcel />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
