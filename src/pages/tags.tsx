import React, { ReactElement, useEffect } from 'react';
import PageMenu from './components/PageMenu';
import Head from 'next/head';
import Layout from 'antd/lib/layout';
import { useDispatch } from 'react-redux';
import { loadTags } from '../store/Tag';
import AddTag from './tags/AddTag';
const { Header, Content } = Layout;

export default function Tags(): ReactElement {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadTags())
    }, []);
    return <Layout className="layout" style={{ height: '100vh' }}>
        <Head>
            <title>Tags</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <Header  style={{ height: '46px' }}><PageMenu /></Header>
        <Content style={{ padding: '50px' }}>
            <div>
                <AddTag />
            </div>
        </Content>
    </Layout>;
}
