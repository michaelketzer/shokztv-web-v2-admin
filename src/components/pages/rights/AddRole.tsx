import React, { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Button, Modal, Input } from 'antd';
import { addRole } from '../../../store/Role';

export default function AddRole(): ReactElement {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
      if(roleName.length) {
        setLoading(true);
        await dispatch(addRole(roleName));
        setLoading(false);
        setShowModal(false);
        setRoleName('');
      }
  }

  return <Row justify="start">
    <Button type="primary" onClick={() => setShowModal(true)}>
          Neue Rolle
        </Button>
        <Modal
          title="Neue Rolle"
          visible={showModal}
          onOk={onCreate}
          onCancel={() => setShowModal(false)}
          confirmLoading={loading}
        >
            <Input placeholder="Name" 
                   value={roleName} 
                   disabled={loading}
                   onChange={(e) => setRoleName(e.target.value)}
                   onPressEnter={onCreate} />
        </Modal>
  </Row>;
}