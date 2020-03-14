import React, { ReactElement } from 'react';
import UserList from '../components/pages/user/UserList';
import PageFrame from '../components/PageFrame';

export default function User(): ReactElement {
    return <PageFrame title={'Benutzer'}>
        <UserList />
    </PageFrame>;
}
