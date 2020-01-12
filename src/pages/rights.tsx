import React, { ReactElement } from 'react';
import PageMenu from './components/PageMenu';
import Head from 'next/head';
import RoleList from './rights/RoleList';
import Layout from 'antd/lib/layout';
import AddRole from './rights/AddRole';
import { Divider } from 'antd';
const { Header, Content } = Layout;

export default function Rights(): ReactElement {
  return <Layout className="layout" style={{ height: '100vh' }}>
    <Head>
      <title>Rollen & Rechte</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <Header  style={{ height: '46px' }}><PageMenu /></Header>
    <Content style={{ padding: '50px' }}>
      <div>
        <RoleList />

        <Divider />
        
        <AddRole/>
      </div>
    </Content>
  </Layout>;
}
