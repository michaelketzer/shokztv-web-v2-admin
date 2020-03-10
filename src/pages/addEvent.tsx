import React, { ReactElement, useEffect } from 'react';
import PageMenu from './components/PageMenu';
import Head from 'next/head';
import Layout from 'antd/lib/layout';
import AddEventForm from './events/AddEventForm';
const { Header, Content } = Layout;

export default function AddEvent(): ReactElement {
    return <Layout className="layout" style={{ height: '100vh' }}>
        <Head>
            <title>Neues Event</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <Header  style={{ height: '46px' }}><PageMenu /></Header>
        <Content style={{ padding: '50px', overflowY: 'scroll' }}>
            <div>
                <AddEventForm />
            </div>
        </Content>
    </Layout>;
}
