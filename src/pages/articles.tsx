import React, { ReactElement, useEffect } from 'react';
import PageMenu from './components/PageMenu';
import Head from 'next/head';
import Layout from 'antd/lib/layout';
import Link from 'next/link';
import { Button, Divider } from 'antd';
import { useDispatch } from 'react-redux';
import { loadArticles } from '../store/Article';
import ArticleList from './articles/articleList';
const { Header, Content } = Layout;

export default function Articles(): ReactElement {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadArticles());
    }, []);
    
    return <Layout className="layout" style={{ height: '100vh' }}>
        <Head>
            <title>Articles</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <Header  style={{ height: '46px' }}><PageMenu /></Header>
        <Content style={{ padding: '50px', overflowY: 'scroll'}}>
            <div>
                <ArticleList />

                <Divider />

                <Link href={'/addArticle'}>
                    <Button type="primary">
                        Add Article
                    </Button>
                </Link>
            </div>
        </Content>
    </Layout>;
}
