import React, { ReactElement } from 'react';
import PageFrame from '../../components/PageFrame';
import AddEventForm from '../../components/pages/events/AddEventForm';

export default function newEvent(): ReactElement {
    return <PageFrame title={'Neuer Artikel'}>
        <AddEventForm />
    </PageFrame>;
}
