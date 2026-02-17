import { Routes, Route } from "react-router-dom";
import Page from "./page/Home";
import PaymentPage from "./page/Payment";
import AdminPage from "./page/Admin";

// Import your page components here
// import Home from "./pages/Home";
// import About from "./pages/About";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Page />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/admin" element={<AdminPage />} />
      {/* Add more routes here */}
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  );
};
