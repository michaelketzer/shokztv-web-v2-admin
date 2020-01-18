import React, { ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Row, Button, Modal, Input, Upload, Icon } from 'antd';
import { createTag } from '../../store/Tag';

function readFile(file: File): File {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return file;
} 

export default function AddTag(): ReactElement {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [tagName, setTagName] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
      if(tagName.length) {
        setLoading(true);
        await dispatch(createTag(tagName, image));
        setLoading(false);
        setShowModal(false);
        setTagName('');
        setImage(null);
      }
  }

  return <Row type="flex" justify="start">
    <Button type="primary" onClick={() => setShowModal(true)}>
        Add Tag
    </Button>
    <Modal
        title="Neuer Tag"
        visible={showModal}
        onOk={onCreate}
        onCancel={() => setShowModal(false)}
        confirmLoading={loading}
    >
        <Input placeholder="Tag Name" 
                value={tagName} 
                disabled={loading}
                onChange={(e) => setTagName(e.target.value)}
                onPressEnter={onCreate} />

        <div style={{margin: '10px 0'}} />

        <Input
            accept="image/*"
            id="image"
            type="file"
            onChange={({target}) => setImage(target.files[0])}
        />

    </Modal>
  </Row>;
}