import React, { ReactElement, useEffect } from 'react'
import { NextPageContext } from 'next';
import { Spin } from 'antd';
import 'antd/dist/antd.css';
import { useDispatch, useSelector } from 'react-redux';
import { authUser, loadCurrentUser } from '../store/Ui';
import { State } from '../store/Store';

interface Props {
    code: string;
}

const Auth = ({ code }: Props): ReactElement => {
  const dispatch = useDispatch();
  const jwt = useSelector((state: State) => state.ui.currentUser.jwt);

  useEffect(() => {
    dispatch(authUser(code));
  }, []);

  useEffect(() => {
    if(jwt) {
      dispatch(loadCurrentUser());
    }
  }, [jwt])
  
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


Auth.getInitialProps = (ctx: NextPageContext): Props =>  {
    return {
        code: ctx.query.code as string,
    };
};

export default Auth;