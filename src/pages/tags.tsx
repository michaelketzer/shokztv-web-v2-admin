import React, { ReactElement } from 'react';
import AddTag from '../components/pages/tags/AddTag';
import TagList from '../components/pages/tags/TagList';
import { Divider } from 'antd';
import PageFrame from '../components/PageFrame';

export default function Tags(): ReactElement {
    return <PageFrame title={'Tags'}>
        <AddTag />
        <Divider />
        <TagList />
    </PageFrame>;
}
