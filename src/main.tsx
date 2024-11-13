import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { App as AntApp } from 'antd';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
          },
        }}
      >
          <AntApp>
              <AuthProvider>
                  <App />
              </AuthProvider>
          </AntApp>
      </ConfigProvider>
    </BrowserRouter>
  </React.StrictMode>
);
