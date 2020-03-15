import React, { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Button, Modal, Input } from 'antd';
import { createStreamer } from '../../../store/Streamer';

export default function AddStreamer(): ReactElement {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
      if(name.length) {
        setLoading(true);
        await dispatch(createStreamer(name));
        setLoading(false);
        setShowModal(false);
        setName('');
      }
  }

  return <Row justify="start">
    <Button type="primary" onClick={() => setShowModal(true)}>
        Neuer Streamer
    </Button>
    <Modal
        title="Neuer Streamer"
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
    </Modal>
  </Row>;
}