import React, { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Button, Modal, Input } from 'antd';
import { createVideo } from '../../store/Video';
import TagsForm from '../components/TagsForm';

export default function AddVideo(): ReactElement {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const onCreate = async () => {
      if(source.length) {
        setLoading(true);
        await dispatch(createVideo(title, source, tags));
        setLoading(false);
        setShowModal(false);
        setTitle('');
        setSource('');
        setTags([]);
      }
  }

  return <Row justify="start">
    <Button type="primary" onClick={() => setShowModal(true)}>
        Neues Video
    </Button>
    <Modal
        title="Neues Video"
        visible={showModal}
        onOk={onCreate}
        onCancel={() => setShowModal(false)}
        confirmLoading={loading}
    >
        <Input placeholder="Titel" 
                value={title} 
                disabled={loading}
                onChange={(e) => setTitle(e.target.value)}
                onPressEnter={onCreate} />

        <div style={{margin: '10px 0'}} />

        <Input placeholder="VOD" 
                value={source} 
                disabled={loading}
                onChange={(e) => setSource(e.target.value)}
                onPressEnter={onCreate} />

        <div style={{margin: '10px 0'}} />

        <TagsForm tags={tags} setTags={setTags} />
    </Modal>
  </Row>;
}