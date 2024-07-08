import { Navigate, useLocation } from 'react-router-dom';
import {
  selectIsAutorization,
  selectIsInit
} from '../../services/slices/stellar-burgerSlice';
import { useAppSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthorization = useAppSelector(selectIsAutorization);
  const isInit = useAppSelector(selectIsInit);

  if (!isInit) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthorization) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && isAuthorization) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
