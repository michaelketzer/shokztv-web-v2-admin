import React, { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadRoles } from '../../store/Role';
import { loadRights } from '../../store/Right';
import { roleSelector } from '../../store/selectors/role';
import { Card, Col, Row } from 'antd';
import RoleCardContent from './RoleCardContent';

export default function RoleList(): ReactElement {
  const dispatch = useDispatch();
  const roles = useSelector(roleSelector);

  useEffect(() => {
    dispatch(loadRoles());
    dispatch(loadRights());
  }, []);
  
  return <Row type="flex" justify="start" gutter={[16, 16]}>
    {Object.values(roles).map((role) => <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={4} key={role.id}>
      <Card title={role.name}>
        <RoleCardContent role={role} />
      </Card>
    </Col>)}
  </Row>;
}