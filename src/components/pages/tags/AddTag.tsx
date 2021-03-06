import React, { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Button, Modal, Input } from 'antd';
import { createTag } from '../../../store/Tag';
import TextArea from 'antd/lib/input/TextArea';
import FileForm from '../../FileForm';

export default function AddTag(): ReactElement {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [tagName, setTagName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
      if(tagName.length) {
        setLoading(true);
        await dispatch(createTag(tagName, description, slug, image));
        setLoading(false);
        setShowModal(false);
        setTagName('');
        setDescription('');
        setSlug('')
        setImage(null);
      }
  }

  return <Row justify="start">
    <Button type="primary" onClick={() => setShowModal(true)}>
        Neuer Tag
    </Button>
    <Modal
        title="Neuer Tag"
        visible={showModal}
        onOk={onCreate}
        onCancel={() => setShowModal(false)}
        confirmLoading={loading}
    >
        <Input placeholder="Name" 
                value={tagName} 
                disabled={loading}
                onChange={(e) => setTagName(e.target.value)}
                onPressEnter={onCreate} />

        <div style={{margin: '10px 0'}} />

        <TextArea placeholder={'Beschreibung'} id="description" value={description} onChange={({target}) => setDescription(target.value)}/>

        <div style={{margin: '10px 0'}} />

        <Input placeholder="Slug" 
                value={slug} 
                disabled={loading}
                onChange={(e) => setSlug(e.target.value)} />

        <div style={{margin: '10px 0'}} />

        <FileForm file={image} setFile={setImage} label={'Bild'} />
    </Modal>
  </Row>;
}