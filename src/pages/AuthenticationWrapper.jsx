import React from 'react'
import Navigation from '../components/Navigation/Navigation'
import { Outlet } from 'react-router-dom'
import BckgImage from '../assets/img/bg-1.png';
import { useSelector } from 'react-redux';
import Spinner from '../components/Spinner/Spinner';
import AuthLayout from '../layout/AuthLayout';

const AuthenticationWrapper = () => {

  const isLoading = useSelector((state)=> state?.commonState?.loading);
  return (
    <AuthLayout>
      <Outlet />
      {isLoading && <Spinner />}
    </AuthLayout>
  )
}

export default AuthenticationWrapper