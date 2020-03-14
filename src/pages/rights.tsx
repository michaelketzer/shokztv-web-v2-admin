import React, { ReactElement } from 'react';
import RoleList from '../components/pages/rights/RoleList';
import AddRole from '../components/pages/rights/AddRole';
import { Divider } from 'antd';
import PageFrame from '../components/PageFrame';

export default function Rights(): ReactElement {
  return <PageFrame title={'Rollen & Rechte'}>
    <RoleList />

    <Divider />
    
    <AddRole/>
  </PageFrame>;
}
