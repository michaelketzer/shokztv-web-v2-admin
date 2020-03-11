import React, { ReactElement, useMemo } from 'react';
import PageMenu from './components/PageMenu';
import Head from 'next/head';
import Layout from 'antd/lib/layout';
import { useSelector } from 'react-redux';
import { currentUserSelector } from '../store/selectors/currentuser';
import { Result, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
const { Content, Header } = Layout;

export default function Dashboard(): ReactElement {
  const currentUser = useSelector(currentUserSelector);

  const hasRoles = useMemo(() => currentUser && currentUser.roles.length > 0, [currentUser]);
  return <Layout className="layout" style={{ height: '100vh' }}>
    <Head>
      <title>Dashboard</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <Header  style={{ height: '46px' }}><PageMenu /></Header>

    <Content style={{ padding: '50px', overflowY: 'scroll'}}>
      {!hasRoles &&  <Result
        icon={<SmileOutlined />}
        title="Yeah! Dein Boarding beginnt gerade. Wir müssen dir nur noch eine maßgeschneiderte Rolle zuweisen. Melde dich doch einfach im Discord, dass du es hierhin geschafft hast."
      />}
    </Content>
  </Layout>;
}
