import { Route, BrowserRouter, Routes } from "react-router";

import Layout from "./layout";

import Auth from "@/pages/Auth";
import Browse from "@/pages/Browse";
import Watch from "@/pages/Watch";

function App() {
  const basename = "/";

  return (
    <Layout>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route element={<Auth />} path="/" />
          <Route element={<Browse />} path="/browse" />
          <Route element={<Watch />} path="/watch" />
        </Routes>
      </BrowserRouter>
    </Layout>
  );
}

export default App;
