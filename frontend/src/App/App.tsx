import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { store } from '../store';
import { router } from '../router';

export const App = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1677ff',
            },
          }}
        >
          <RouterProvider router={router} />
        </ConfigProvider>
      </Provider>
    </StrictMode>
  );
};