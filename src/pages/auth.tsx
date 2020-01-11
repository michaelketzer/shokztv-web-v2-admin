import React, { ReactElement, useEffect } from 'react'
import { NextPageContext } from 'next';
import { Spin } from 'antd';
import 'antd/dist/antd.css';
import { useDispatch, useSelector } from 'react-redux';
import { authUser } from '../store/Ui';
import { Dispatch } from '../store/middleware/NetworkMiddlewareTypes';
import Router from 'next/router';
import { currentUserSelector } from '../store/selectors/currentuser';

interface Props {
    code: string;
}

const Auth = ({ code }: Props): ReactElement => {
  const dispatch = useDispatch<Dispatch>();
  const currentUser = useSelector(currentUserSelector);

  useEffect(() => {
    dispatch(authUser(code));
  }, []);

  useEffect(() => {
    if(currentUser) {
      Router.push('/dashboard');
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

Auth.getInitialProps = (ctx: NextPageContext): Props =>  {
    return {
        code: ctx.query.code as string,
    };
};

export default Auth;