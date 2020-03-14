import React, { ReactElement } from 'react';
import { Form } from '@ant-design/compatible';
import { Input, Button } from 'antd';
import { News } from '../../../@types/Entities/News';
import TextArea from 'antd/lib/input/TextArea';

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

interface Props {
    data: Partial<News>;
    setData: (d: Partial<News>) => void;
    loading: boolean;
    save: () => void;
}
export default function NewsForm({data, setData, loading, save}: Props): ReactElement {
    return <Form {...formItemLayout}>
        <Form.Item label="Headline">
            <Input style={{ width: '100%' }} value={data.headline} onChange={(e) => setData({...data, headline: e.target.value})} />
        </Form.Item>
        <Form.Item label="Beschreibung">
            <TextArea style={{ width: '100%' }} value={data.description} onChange={(e) => setData({...data, description: e.target.value})} />
        </Form.Item>
        <Form.Item label="Source">
            <Input style={{ width: '100%' }} value={data.source} onChange={(e) => setData({...data, source: e.target.value})} />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit" onClick={save} loading={loading}>
                Speichern
            </Button>
        </Form.Item>
    </Form>;
}
