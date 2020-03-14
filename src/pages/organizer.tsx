import React, { ReactElement } from 'react';
import { Divider } from 'antd';
import AddOrganizer from '../components/pages/organizer/AddOrganizer';
import OrganizerList from '../components/pages/organizer/OrganizerList';
import PageFrame from '../components/PageFrame';

export default function Organizer(): ReactElement {
  return <PageFrame title={'Veranstalter'}>
    <AddOrganizer />
    <Divider />
    <OrganizerList />
  </PageFrame>;
}
