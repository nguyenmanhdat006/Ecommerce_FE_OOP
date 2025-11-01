import React, { useCallback, useState, useEffect } from 'react'
import GoogleSignIn from '../../components/Buttons/GoogleSignIn'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError } from '../../store/authSlice';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [values, setValues] = useState({
    userName: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, isAuthenticated, accessToken, refreshToken } = useSelector(
    (state) => state.authSlice
  );

  // Handle successful login
  useEffect(() => {
    if (isAuthenticated) {
      console.log("✅ Login res:",isAuthenticated, accessToken, refreshToken);
      navigate('/');
      toast.success('Login successful!');
    }
  }, [isAuthenticated, accessToken, refreshToken, navigate]);

  // Clear error when user starts typing
  useEffect(() => {
    if (error && (values.userName || values.password)) {
      dispatch(clearAuthError());
    }
  }, [values.userName, values.password, error, dispatch]);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    dispatch(clearAuthError());
    
    try {
      await dispatch(login(values)).unwrap();
      toast.success('Login successful!');
    } catch (err) {
      // Error is handled by authSlice and will be in error state
      const errorMessage = err?.message || err?.error || 'Invalid Credentials!';
      toast.error(errorMessage);
    }
  }, [dispatch, values, navigate]);

  const handleOnChange = useCallback((e) => {
    e.persist();
    setValues(values => ({
      ...values,
      [e.target.name]: e.target?.value,
    }));
  }, []);

  return (
    <div className='px-8 w-full lg:w-[70%]'>

      <p className='text-3xl font-bold pb-4 pt-4'>Sign In</p>
      <GoogleSignIn/>
      <p className='text-gray-500 items-center text-center w-full py-2'>OR</p>
    
      <div className='pt-4'>
        <form onSubmit={onSubmit}>
          <input 
            type="email" 
            name='userName' 
            value={values?.userName} 
            onChange={handleOnChange} 
            placeholder='Email address' 
            className='h-[48px] w-full border p-2 border-gray-400' 
            required
            disabled={loading}
          />
          <input 
            type="password" 
            name='password' 
            value={values?.password} 
            onChange={handleOnChange} 
            placeholder='Password' 
            className='h-[48px] mt-8 w-full border p-2 border-gray-400' 
            required 
            autoComplete='new-password'
            disabled={loading}
          />
          <Link className='text-right w-full float-right underline pt-2 text-gray-500 hover:text-black'>Forgot Password?</Link>
          <button 
            type="submit"
            className='border w-full rounded-lg h-[48px] mb-4 bg-black text-white mt-4 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed' 
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
      {error && (
        <p className='text-lg text-red-700'>
          {typeof error === 'string' ? error : error?.message || 'Invalid Credentials!'}
        </p>
      )}
      <Link to={"/v1/register"} className='underline text-gray-500 hover:text-black'>Don't have an account? Sign up</Link>
    </div>
  )
}

export default Login