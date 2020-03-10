import React, { ReactElement, useEffect, useState } from 'react';
import PageMenu from './components/PageMenu';
import Head from 'next/head';
import Layout from 'antd/lib/layout';
import Link from 'next/link';
import { Button, Divider, Drawer } from 'antd';
import { useDispatch } from 'react-redux';
import { loadArticles } from '../store/Article';
import ArticleList from './articles/articleList';
import AddArticleForm from './addArticle/AddArticleForm';
const { Header, Content } = Layout;

export default function Articles(): ReactElement {
    const [showAddForm, setShowAddForm] = useState(false);
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
                <Button type="primary" onClick={() => setShowAddForm(true)}>
                    Neuer Artikel
                </Button>
                <Drawer
                    title="Create new article"
                    width={1024}
                    onClose={() => setShowAddForm(false)}
                    visible={showAddForm}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Link href={'/addArticle'}>
                        <Button type="primary">
                            Als Seite öffnen
                        </Button>
                    </Link>
                    <AddArticleForm />
                </Drawer>
                <Divider />
                <ArticleList />
            </div>
        </Content>
    </Layout>;
}
