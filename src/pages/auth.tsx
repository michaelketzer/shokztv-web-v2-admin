import React, { ReactElement, useEffect } from 'react'
import { NextPageContext } from 'next';
import { Spin } from 'antd';
import 'antd/dist/antd.css';
import { useDispatch } from 'react-redux';
import { authUser } from '../store/Ui';

interface Props {
    code: string;
}

const Auth = ({ code }: Props): ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authUser(code));
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


Auth.getInitialProps = (ctx: NextPageContext): Props =>  {
    return {
        code: ctx.query.code as string,
    };
};

export default Auth;