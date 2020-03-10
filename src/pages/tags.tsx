import React, { ReactElement, useEffect } from 'react';
import PageMenu from './components/PageMenu';
import Head from 'next/head';
import Layout from 'antd/lib/layout';
import AddTag from './tags/AddTag';
import TagList from './tags/TagList';
import { Divider } from 'antd';
const { Header, Content } = Layout;

export default function Tags(): ReactElement {
    return <Layout className="layout" style={{ height: '100vh' }}>
        <Head>
            <title>Tags</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <Header  style={{ height: '46px' }}><PageMenu /></Header>
        <Content style={{ padding: '50px', overflowY: 'scroll' }}>
            <div>
                <AddTag />
                <Divider />
                <TagList />
            </div>
        </Content>
    </Layout>;
}
