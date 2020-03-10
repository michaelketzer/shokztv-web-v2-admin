import React, { ReactElement } from 'react';
import PageMenu from './components/PageMenu';
import Head from 'next/head';
import Layout from 'antd/lib/layout';
import VideoList from './videos/VideoList';
import { Divider } from 'antd';
import AddVideo from './videos/AddVideo';
const { Header, Content } = Layout;

export default function Videos(): ReactElement {
    return <Layout className="layout" style={{ height: '100vh' }}>
        <Head>
            <title>Videos</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <Header  style={{ height: '46px' }}><PageMenu /></Header>
        <Content style={{ padding: '50px', overflowY: 'scroll' }}>
            <div>
                <AddVideo />
                <Divider />
                <VideoList />
            </div>
        </Content>
    </Layout>;
}
