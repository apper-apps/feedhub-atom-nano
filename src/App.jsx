import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import Dashboard from '@/components/pages/Dashboard';
import FeedSources from '@/components/pages/FeedSources';
import Articles from '@/components/pages/Articles';
import Filters from '@/components/pages/Filters';
import Users from '@/components/pages/Users';
import ApiWebhooks from '@/components/pages/ApiWebhooks';
import AiSummary from '@/components/pages/AiSummary';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-surface-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/feed-sources" element={<FeedSources />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/filters" element={<Filters />} />
            <Route path="/users" element={<Users />} />
            <Route path="/api" element={<ApiWebhooks />} />
            <Route path="/ai-summary" element={<AiSummary />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;