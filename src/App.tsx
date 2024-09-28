import React from "react";

import "./App.css";

import { IntlProvider } from "react-intl";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { Router, Routes, Route } from "react-router-dom";
import LoginView from "./components/Auth/LoginView";
import SignupView from "./components/Auth/SignupView";
import RequireAuth from "./components/Auth/RequireAuth";
import DashboardView from "./components/Dashboard/DashboardView";
import EventsRouter from "./components/Events/EventsRouter";
import OrdersRouter from "./components/Orders/OrdersRouter";
import SettingsRouter from "./components/Settings/SettingsRouter";
import ProductsRouter from "./pages/Products/ProductsRouter";
import VouchersRouter from "./pages/Vouchers/VouchersRouter";

import store from "./store/store";
import history from "./history";

import { messages, lang } from "./locale";
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";

const CustomRouter = ({ basename, children, history }: any) => {
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      basename={basename}
      children={children}
      location={state.location}
      navigationType={state.action}
      navigator={history}
    />
  );
};

function App() {
  return (
    <Provider store={store}>
      <IntlProvider
        locale={lang}
        defaultLocale={"de"}
        messages={messages[lang]}
      >
        <CustomRouter history={history}>
          <Routes>
            <Route path="/login" element={<LoginView />} />
            <Route path="/signup" element={<SignupView />} />
            <Route path="/" element={
              <RequireAuth>
                <DashboardView />
              </RequireAuth>
            }
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <DashboardView />
                </RequireAuth>
              }
            />
            <Route
              path="/events/*"
              element={
                <RequireAuth>
                  <EventsRouter />
                </RequireAuth>
              }
            />
            <Route
              path="/orders/*"
              element={
                <RequireAuth>
                  <OrdersRouter />
                </RequireAuth>
              }
            />
            <Route
              path="/products/*"
              element={
                <RequireAuth>
                  <ProductsRouter />
                </RequireAuth>
              }
            />
            <Route
              path="/vouchers/*"
              element={
                <RequireAuth>
                  <VouchersRouter />
                </RequireAuth>
              }
            />
            <Route
              path="/settings/*"
              element={
                <RequireAuth>
                  <SettingsRouter />
                </RequireAuth>
              }
            />
          </Routes>
        </CustomRouter>
        <Toaster position="top-right" />
        <ToastContainer position="top-right" />
      </IntlProvider>
    </Provider>
  );
}

export default App;
