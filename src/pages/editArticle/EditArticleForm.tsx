import React, { ReactElement, useState, useMemo, useEffect } from 'react';
import { Form, Input, Icon, Tag, AutoComplete, Button } from 'antd';
const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;
import 'react-quill/dist/quill.snow.css';
import { useSelector, useDispatch } from 'react-redux';
import { tagsSelector } from '../../store/selectors/tag';
import { Article, patchArticle } from '../../store/Article';
import { loadTags } from '../../store/Tag';
import Router from 'next/router';
import TagsForm from '../components/TagsForm';

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

export default function EditArticleForm({article}: {article: Article}): ReactElement {
    const tagEntities = useSelector(tagsSelector);
    const dispatch = useDispatch();
    const [title, setTitle] = useState(article.title);
    const [body, setBody] = useState(article.body);
    const [tags, setTags] = useState<string[]>(article.tags.map((id) => tagEntities[id].name));
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(loadTags());
    }, []);

    const save = async () => {
        setLoading(true);
        await dispatch(patchArticle(article.id, title, tags, body));
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

        <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" onClick={save} loading={loading}>
                Save
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
