import React, { ReactElement, useEffect } from 'react'
import { Spin } from 'antd';
import 'antd/dist/antd.css';
import { useDispatch, useSelector } from 'react-redux';
import { loadCurrentUser } from '../store/Ui';
import { State } from '../store/Store';

export default function Index(): ReactElement {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: State) => state.ui.currentUser);
  useEffect(() => {
    dispatch(loadCurrentUser())
  }, []);

  useEffect(() => {
    if(currentUser.error && currentUser.error.code === 401) {
      //Start authorization process
      location.href='http://localhost/auth/twitch';
    }
  }, [currentUser]);

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
