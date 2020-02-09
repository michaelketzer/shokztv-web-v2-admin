import React, { ReactElement, useState } from 'react';
import { Form, Input, Button } from 'antd';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import 'react-quill/dist/quill.snow.css';
import { createArticle } from '../../store/Article';
import Router from 'next/router';
import TagsForm from '../components/TagsForm';
import { useDispatch } from 'react-redux';

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
            <ReactQuill style={{background: '#FFF'}} modules={{
                toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                    ['link', 'image'],
                ],
            }} formats={[
                'header',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent',
                'link', 'image'
              ]} theme={'snow'} value={body} onChange={(value) => setBody(value)} />
        </Form.Item>

        <Form.Item label="Cover">
            <Input
                accept="image/*"
                id="image"
                type="file"
                onChange={({target}) => setImage(target.files[0])}
            />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" onClick={create} loading={loading}>
                Create
            </Button>
        </Form.Item>
        
        <style jsx global>{`
            .ql-toolbar.ql-snow {
                padding: 0px!important;
            }
            .ql-snow .ql-picker.ql-header .ql-picker-label::before {
                position: absolute;
            }
        `}</style>
    </Form>;
}
