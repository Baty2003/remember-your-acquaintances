import { StrictMode } from "react";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import enUS from "antd/locale/en_US";
import { RouterProvider } from "react-router-dom";
import { store } from "../store";
import { router } from "../router";
import { LocaleProvider, useLocale } from "../contexts";

const AppContent = () => {
  const { locale } = useLocale();
  const antdLocale = locale === "ru" ? ruRU : enUS;

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={{
        token: {
          colorPrimary: "#1677ff",
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export const App = () => {
  return (
    <StrictMode>
      <Provider store={store}>
        <LocaleProvider>
          <AppContent />
        </LocaleProvider>
      </Provider>
    </StrictMode>
  );
};
