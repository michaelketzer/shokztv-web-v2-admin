import React, { ReactElement } from 'react';
import PageMenu from './components/PageMenu';
import Head from 'next/head';
import Layout from 'antd/lib/layout';
import { Divider } from 'antd';
import AddOrganizer from './organizer/AddOrganizer';
import OrganizerList from './organizer/OrganizerList';
const { Header, Content } = Layout;

export default function Organizer(): ReactElement {
  return <Layout className="layout" style={{ height: '100vh' }}>
    <Head>
      <title>Organizer</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <Header  style={{ height: '46px' }}><PageMenu /></Header>
    <Content style={{ padding: '50px', overflowY: 'scroll' }}>
        <div>
            <AddOrganizer />
            <Divider />
            <OrganizerList />

        </div>
    </Content>
  </Layout>;
}
