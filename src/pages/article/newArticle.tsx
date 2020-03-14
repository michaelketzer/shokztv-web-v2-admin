import React, { ReactElement } from 'react';
import AddArticleForm from '../../components/pages/addArticle/AddArticleForm';
import PageFrame from '../../components/PageFrame';

export default function newArticle(): ReactElement {
    return <PageFrame title={'Neuer Artikel'}>
        <AddArticleForm />
    </PageFrame>;
}
