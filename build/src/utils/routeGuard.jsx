import React, { PropTypes } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { showNotif } from '../features/notifTrialSlice'

const ProtectedRoute = ({redirectPath = '/auth/login', children}) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const token = user?.token
  const dispatch = useDispatch()
  
  moment.locale('id')

  if (token == undefined || token == '' || token == null) {
    return <Navigate to={redirectPath} replace />;
  }

  // cek jika lisence trial lebih dari 30 hari
  let endDate = moment(user.tanggal)
  let startDate = moment()
  let _30hari = moment(endDate).add(30, 'days')

  let diff = moment.duration(endDate.diff(startDate)).asDays()
  let rentangHari = Math.abs(Math.round(diff))
  if(rentangHari > 30) {
    // dispatch(showNotif())
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
