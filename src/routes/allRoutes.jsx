import { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';

// Lazy load pages for better performance
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard.jsx'));
const DatabaseDetail = lazy(() => import('../pages/databases/DatabaseDetail.jsx'));
const RecordDetails = lazy(() => import('../pages/databases/RecordDetails.jsx'));
const CampaignList = lazy(() => import('../pages/campaigns/CampaignList.jsx'));
const CampaignDetail = lazy(() => import('../pages/campaigns/CampaignDetail.jsx'));
const SearchDetail = lazy(() => import('../pages/search/SearchDetail.jsx'));
const SearchList = lazy(() => import('../pages/search/SearchList.jsx'));
const Login = lazy(() => import('../pages/auth/Login.jsx'));
const SignUp = lazy(() => import('../pages/auth/SignUp.jsx'));
const NotFound = lazy(() => import('../pages/NotFound.jsx'));

export const routes = [
  {
    path: '/',
    element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
  },
  {
    path: '/leads',
    element: <ProtectedRoute><DatabaseDetail /></ProtectedRoute>,
  },
  {
    path: '/leads/:id',
    element: <ProtectedRoute><RecordDetails /></ProtectedRoute>,
  },
  {
    path: '/emails',
    element: <ProtectedRoute><DatabaseDetail /></ProtectedRoute>,
  },
  {
    path: '/emails/:id',
    element: <ProtectedRoute><RecordDetails /></ProtectedRoute>,
  },
  {
    path: '/sales_team',
    element: <ProtectedRoute><DatabaseDetail /></ProtectedRoute>,
  },
  {
    path: '/sales_team/:id',
    element: <ProtectedRoute><RecordDetails /></ProtectedRoute>,
  },
  {
    path: '/campaigns',
    element: <ProtectedRoute><CampaignList /></ProtectedRoute>,
  },
  {
    path: '/campaigns/:id',
    element: <ProtectedRoute><CampaignDetail /></ProtectedRoute>,
  },
  {
    path: '/searches',
    element: <ProtectedRoute><SearchList /></ProtectedRoute>,
  },
  {
    path: '/search/:id',
    element: <ProtectedRoute><SearchDetail /></ProtectedRoute>,
  },
  {
    path: '/auth',
    element: <Outlet />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <SignUp /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

