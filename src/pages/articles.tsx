import React, { ReactElement, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Divider, Drawer } from 'antd';
import { useDispatch } from 'react-redux';
import { loadArticles } from '../store/Article';
import ArticleList from '../components/pages/articles/articleList';
import AddArticleForm from '../components/pages/addArticle/AddArticleForm';
import PageFrame from '../components/PageFrame';

export default function Articles(): ReactElement {
    const [showAddForm, setShowAddForm] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadArticles());
    }, []);
    
    return <PageFrame title={'Artikel'}>

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
            <Link href={'/article/newArticle'}>
                <Button type="primary">
                    Als Seite öffnen
                </Button>
            </Link>
            <AddArticleForm />
        </Drawer>
        <Divider />
        <ArticleList />
    </PageFrame>;
}
