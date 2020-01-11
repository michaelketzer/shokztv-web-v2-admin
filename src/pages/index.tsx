import React, { ReactElement, useEffect } from 'react'
import { Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { loadCurrentUser } from '../store/Ui';
import { Dispatch } from '../store/middleware/NetworkMiddlewareTypes';
import Router from 'next/router';
import { currentUserSelector } from '../store/selectors/currentuser';

export default function Index(): ReactElement {
  const dispatch = useDispatch<Dispatch>();
  const currentUser = useSelector(currentUserSelector);

  useEffect(() => {
    if(currentUser) {
      Router.push('/dashboard');
    }
  }, [currentUser]);
  

  useEffect(() => {
    dispatch(loadCurrentUser());
  }, []);

  return <div className={'loadingPage'}>
    <Spin size={'large'} />

    <style jsx>{`
      .loadingPage {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `}</style>
  </div>;
}
