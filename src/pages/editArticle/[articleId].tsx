import React, { ReactElement, useEffect } from 'react';
import PageMenu from '../components/PageMenu';
import Head from 'next/head';
import Layout from 'antd/lib/layout';
import { useSelector, useDispatch } from 'react-redux';
import { loadArticles } from '../../store/Article';
import { articlesSelector } from '../../store/selectors/article';
import EditArticleForm from './EditArticleForm';
import { useRouter } from 'next/router';
const { Header, Content } = Layout;

export default function EditArticle(): ReactElement {
    const router = useRouter();
    const articleId = +router.query.articleId;

    const dispatch = useDispatch();
    const articles = useSelector(articlesSelector);
    useEffect(() => {
        dispatch(loadArticles());
    }, []);

    if(Object.keys(articles).length > 0 && articles[articleId]) {
        return <Layout className="layout" style={{ height: '100vh' }}>
            <Head>
                <title>{articles[articleId].title}</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>

            <Header  style={{ height: '46px' }}><PageMenu /></Header>
            <Content style={{ padding: '50px', overflowY: 'scroll'}}>
                <div>
                    <EditArticleForm article={articles[articleId]} />
                </div>
            </Content>
        </Layout>;
    }

    return <></>;
}