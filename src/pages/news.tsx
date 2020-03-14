import React, { ReactElement, useState, useMemo, useEffect } from 'react';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Drawer, Popconfirm, Divider, Table } from 'antd';
import { News as NewsEntitiy } from '../@types/Entities/News';
import { useDispatch, useSelector } from 'react-redux';
import { patchNews, createNews, deleteNews, loadNews } from '../store/News';
import NewsForm from '../components/pages/news/NewsForm';
import { newsSelector } from '../store/selectors/news';
import ButtonGroup from 'antd/lib/button/button-group';
import PageFrame from '../components/PageFrame';

const columns = (onEdit: (news: NewsEntitiy) => void, onDelete: (id: number) => void) => [{
  title: 'Headline',
  dataIndex: 'headline',
  key: 'headline',
}, {
  title: 'Description',
  dataIndex: 'description',
  key: 'description',
}, {
  title: 'Source',
  dataIndex: 'source',
  key: 'source',
}, {
  title: '',
  key: 'actions',
  render: (text, record) => <ButtonGroup>
  <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
  <Popconfirm title="Sure to delete?" onConfirm={() => onDelete(record.id)} disabled={record.events > 0}>
    <Button type="danger" icon={<DeleteOutlined />} disabled={record.events > 0} />
  </Popconfirm>
</ButtonGroup>,
}];

export default function News(): ReactElement {
  const dispatch = useDispatch();
  const newsEntities = useSelector(newsSelector);
  const [showDrawer, setShowDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState<null | number>(null);
  const [data, setData] = useState<Partial<NewsEntitiy>>({});
  const news = useMemo(() => Object.values(newsEntities).sort(({id: a}, {id: b}) => b -a), [newsEntities]);

  useEffect(() => {
    dispatch(loadNews());
  }, []);

  const update = async () => {
    setLoading(true);
    if(id) {
      await dispatch(patchNews(id, data.headline, data.description, data.source));
    } else {
      await dispatch(createNews(data.headline, data.description, data.source));
    }
    setLoading(false);
    setShowDrawer(false);
  };

  const onEdit = (news: NewsEntitiy) => {
    setId(news.id);
    setData(news);
    setShowDrawer(true);
  };
  const onDelete = (id: number) => dispatch(deleteNews(id));

  return <PageFrame title={'News'}>
    <Button type="primary" onClick={() => setShowDrawer(true)}>
              Neue News
            </Button>

    <Divider />

    <Table dataSource={news} columns={columns(onEdit, onDelete)} rowKey={'id'}/>

    <Drawer
      title={(id ? 'News bearbeiten' : 'Neue News')}
      width={600}
      onClose={() => setShowDrawer(false)}
      visible={showDrawer}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <NewsForm data={data} setData={setData} loading={loading} save={update} />
    </Drawer>
  </PageFrame>;
}
