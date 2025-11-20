import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider, Spin, App as AntdApp, theme } from 'antd';
import { routes } from './routes/allRoutes.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ToastBinder } from './components/Toast.js';
import './App.css';

// Render routes recursively
const renderRoutes = (routes) => {
  return routes.map((route) => (
    <Route
      key={route.path}
      path={route.path}
      element={
        <Suspense fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh'
          }}>
            <Spin size="large" />
          </div>
        }>
          {route.element}
        </Suspense>
      }
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
};

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0066cc',
          colorSuccess: '#10b981',
          colorWarning: '#f59e0b',
          colorError: '#ef4444',
          colorInfo: '#3b82f6',
          borderRadius: 6,
          colorBgContainer: '#ffffff',
          colorBorder: '#e2e8f0',
        },
      }}
    >
      <AntdApp>
        <ToastBinder />
        <AuthProvider>
          <Router>
            <Routes>
              {renderRoutes(routes)}
            </Routes>
          </Router>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
