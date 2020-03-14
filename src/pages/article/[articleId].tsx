import React, { ReactElement, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loadArticles } from '../../store/Article';
import { articlesSelector } from '../../store/selectors/article';
import EditArticleForm from '../../components/pages/article/EditArticleForm';
import { useRouter } from 'next/router';
import PageFrame from '../../components/PageFrame';

export default function EditArticle(): ReactElement {
    const router = useRouter();
    const articleId = +router.query.articleId;

    const dispatch = useDispatch();
    const articles = useSelector(articlesSelector);
    useEffect(() => {
        dispatch(loadArticles());
    }, []);

    if(Object.keys(articles).length > 0 && articles[articleId]) {
        return <PageFrame>
            <EditArticleForm article={articles[articleId]} />
        </PageFrame>;
    }

    return <></>;
}