import React, { ReactElement, useState } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button } from 'antd';
import { createArticle } from '../../store/Article';
import Router from 'next/router';
import TagsForm from '../components/TagsForm';
import { useDispatch } from 'react-redux';
import FileForm from '../components/FileForm';
import TextEditor from '../components/TextEditor';

const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
};

const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 4,
      },
      sm: {
        span: 24,
        offset: 4,
      },
    },
};

export default function AddArticleForm(): ReactElement {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const create = async () => {
        setLoading(true);
        await dispatch(createArticle(title, tags, body, image));
        setLoading(false);
        Router.push('/articles');
    };

    return <Form {...formItemLayout}>
        <Form.Item label="Title">
           <Input style={{ width: '100%' }} value={title} onChange={(e) => setTitle(e.target.value)} />
        </Form.Item>
        
        <TagsForm tags={tags} setTags={setTags} />

        <Form.Item label="Body">
            <TextEditor text={body} setText={setBody} />
        </Form.Item>

        <Form.Item label="Cover Image">
            <FileForm file={image} setFile={setImage} label={'Cover'} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" onClick={create} loading={loading}>
                Create
            </Button>
        </Form.Item>
    </Form>;
}
