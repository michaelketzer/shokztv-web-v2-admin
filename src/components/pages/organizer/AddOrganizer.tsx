import React, { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Button, Modal, Input } from 'antd';
import FileForm from '../../FileForm';
import { createOrganizer } from '../../../store/Organizer';

export default function AddOrganizer(): ReactElement {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
      if(name.length) {
        setLoading(true);
        await dispatch(createOrganizer(name, icon, logo));
        setLoading(false);
        setShowModal(false);
        setName('');
        setIcon(null);
        setLogo(null);
      }
  }

  return <Row justify="start">
    <Button type="primary" onClick={() => setShowModal(true)}>
        Neuer Veranstalter
    </Button>
    <Modal
        title="Neuer Veranstalter"
        visible={showModal}
        onOk={onCreate}
        onCancel={() => setShowModal(false)}
        confirmLoading={loading}
    >
      <Input placeholder="Name" 
              value={name} 
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
              onPressEnter={onCreate} />

      <div style={{margin: '10px 0'}} />

      <FileForm file={icon} setFile={setIcon} label={'Icon'} />
      <FileForm file={logo} setFile={setLogo} label={'Logo'} />
    </Modal>
  </Row>;
}