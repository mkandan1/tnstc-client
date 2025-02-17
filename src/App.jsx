import React, { Suspense, lazy, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/Layouts/Sidebar';
import { Header } from './components/Layouts/Header';
import { Loading } from './components/common/Loading';
import Maintenance from './pages/Maintanence';
import { useMaintenance } from './context/useMaintenance';
import { authendicateAndFetchUser } from './services/user.service';
import { useDispatch } from 'react-redux';

const EditRoute = lazy(() => import('./pages/routes/EditRoute'));
const Buses = lazy(() => import('./pages/buses/Buses'));
const CreateBus = lazy(() => import('./pages/buses/CreateBus'));
const EditBus = lazy(() => import('./pages/buses/EditBus'));
const CreateSchedule = lazy(() => import('./pages/scheduleBus/createSchedule'));
const EditSchedule = lazy(() => import('./pages/scheduleBus/EditSchedule'));
const ScheduledBuses = lazy(() => import('./pages/scheduleBus/scheduledBuses'));
const Login = lazy(() => import('./pages/auth/Login'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/user/AllUsers'));
const CreateUser = lazy(() => import('./pages/user/CreateUsers'));
const EditUser = lazy(() => import('./pages/user/EditUser'));
const RoutesPage = lazy(() => import('./pages/routes/Routes'));
const Stops = lazy(() => import('./pages/stops/Stops'));
const CreateBusStop = lazy(() => import('./pages/stops/CreateBusStop'));
const ViewBusStop = lazy(() => import('./pages/stops/ViewBusStop'));
const CreateRoute = lazy(() => import('./pages/routes/CreateRoute'));
const MyProfile = lazy(() => import('./pages/account/MyProfile'));
const Settings = lazy(() => import('./pages/account/Settings'));

function App() {
  const { maintenance, statusChecked } = useMaintenance();
  const dispatch = useDispatch()

  useEffect(() => {
    if (statusChecked && !maintenance) {
      authendicateAndFetchUser(dispatch);
    }
  }, [statusChecked, maintenance]);

  if (!statusChecked) {
    return;
  }
  if (maintenance) {
    return <Maintenance />;
  }
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <Suspense fallback={<Loading />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <Suspense fallback={<Loading />}>
              <ForgotPassword />
            </Suspense>
          }
        />
        <Route path="/*" element={<MainContent />} />
      </Routes>
    </Router>
  );
}

const MainContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/forgot-password';

  return (
    <>
      {!isAuthPage && (
        <div className="flex">
          <Sidebar />
          <div className="flex-1 md:pl-72">
            <Header />
            <div className="bg-blueGray-100 min-h-[92.5vh]">
              <Toaster position="top-right" />
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/manager/home" element={<Dashboard />} />
                  <Route path="/manager/users" element={<Users />} />
                  <Route path="/manager/users/new" element={<CreateUser />} />
                  <Route path="/manager/stops" element={<Stops />} />
                  <Route path="/manager/buses" element={<Buses />} />
                  <Route path="/manager/buses/new" element={<CreateBus />} />
                  <Route path="/manager/buses/:id" element={<EditBus />} />
                  <Route path="/manager/stops/new" element={<CreateBusStop />} />
                  <Route path="/manager/stops/:id" element={<ViewBusStop />} />
                  <Route path="/manager/routes" element={<RoutesPage />} />
                  <Route path="/manager/routes/new" element={<CreateRoute />} />
                  <Route path="/manager/routes/:id" element={<EditRoute />} />
                  <Route path="/manager/schedules" element={<ScheduledBuses />} />
                  <Route path="/manager/schedules/new" element={<CreateSchedule />} />
                  <Route path="/manager/schedules/:id" element={<EditSchedule />} />
                  <Route path="/manager/users/:id" element={<EditUser />} />
                  <Route path="/manager/account/profile" element={<MyProfile />} />
                  <Route path="/manager/account/settings" element={<Settings />} />
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                  <Route path="/admin/account/profile" element={<MyProfile />} />
                  <Route path="/admin/account/settings" element={<Settings />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
