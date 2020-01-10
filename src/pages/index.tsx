import React, { ReactElement, useEffect } from 'react'
import { Spin } from 'antd';
import 'antd/dist/antd.css';
import { useDispatch } from 'react-redux';
import { loadCurrentUser } from '../store/Ui';
import { Dispatch } from '../store/middleware/NetworkMiddlewareTypes';

export default function Index(): ReactElement {
  const dispatch = useDispatch<Dispatch>();
  const loadUser = async () => {
    const response = await dispatch<Response>(loadCurrentUser());
    if(response.status === 401) {
      location.href = 'http://localhost/auth/twitch';
    }
  }
  useEffect(() => {
    loadUser();
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
