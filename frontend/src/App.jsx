import React from "react";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/LoadingSpinner";
import Layout from "./components/Layout";
import AppRoutes from "./routes/AppRoutes";
import { useInitialLoad } from "./store/useInitialLoad";

const App = () => {
  const { checkingAuth } = useInitialLoad();

  if (checkingAuth) return <LoadingSpinner />;

  return (
    <Layout>
      <AppRoutes />
      <Toaster
        toastOptions={{ style: { background: "#febe03", color: "#4d3900" } }}
      />
    </Layout>
  );
};

export default App;