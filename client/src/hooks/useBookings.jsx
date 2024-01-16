import React, { useContext, useEffect, useRef } from 'react'
import UserDetailContext from '../context/UserDetailContext'
import { useQuery } from 'react-query';
import { useAuth0 } from '@auth0/auth0-react';
import { getAllBookings } from '../utils/api';

const useBookings = () => {
  const {userDetails, setUserDetails} = useContext(UserDetailContext);
  const querRef = useRef()
  const {user} = useAuth0()

  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: "allBookings",
    queryFn: () => getAllBookings(user?.email, userDetails?.token),
    onSuccess: (data) => setUserDetails((prev) => ({...prev, bookings: data})),
    enabled: user !== undefined,
    staleTime: 30000
  });

  querRef.current = refetch;

  useEffect(() => {
    querRef.current && querRef.current();
  }, [userDetails?.token]);

  return { data, isError, isLoading, refetch };
}

export default useBookings;