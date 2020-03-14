import { ReactElement } from "react";
import { List, Avatar, Popconfirm } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { articlesSelector } from "../../../store/selectors/article";
import { Article, publishArticle, unpublishArticle } from "../../../store/Article";
import { AuthorEntities } from "../../../store/Author";
import { authorEntitiesSelector } from "../../../store/selectors/author";
import dayjs from 'dayjs';
import Link from 'next/link';
import Paragraph from "antd/lib/typography/Paragraph";
import { EditFilled, GlobalOutlined, DeleteOutlined } from "@ant-design/icons";
import useRights from "../../../store/rights";

export default function ArticleList(): ReactElement {
    const articles: Article[] = Object.values(useSelector(articlesSelector)).sort(({created: a}, {created: b}) => b - a);
    const authorEntities: AuthorEntities = useSelector(authorEntitiesSelector);
    const dispatch = useDispatch();

    const togglePublishStatus = (articleId: number, status: string): void => {
        if(status !== 'published') {
            dispatch(publishArticle(articleId));
        } else {
            dispatch(unpublishArticle(articleId));
        }
    };

    const onDelete = (articleId: number): void => {
        console.log('Delete', articleId);
    }

    const rightsCheck = useRights();


    return <List
        itemLayout="vertical"
        size="large"
        pagination={{
            position: 'both',
            pageSize: 3,
        }}
        dataSource={articles}
        renderItem={item => {
            const author = authorEntities[item.author];
            const actions = [];
            rightsCheck(['ARTICLE_EDIT']) && (item.status !== 'published' || rightsCheck(['ADMIN_ACCESS'])) && actions.push(<Link href={`/article/${item.id}`}><div><EditFilled />&nbsp;Editieren</div></Link>);
            if(item.status !== 'published') {
                rightsCheck(['ARTICLE_PUBLISH']) && actions.push(<div onClick={() => togglePublishStatus(item.id, item.status)}><GlobalOutlined />&nbsp;{'Veröffentlichen'}</div>);
            } else {
                rightsCheck(['ARTICLE_UNPUBLISH']) && actions.push(<div onClick={() => togglePublishStatus(item.id, item.status)}><GlobalOutlined />&nbsp;{'Veröffentlichung zurückziehen'}</div>);
            }
            rightsCheck(['ARTICLE_DELETE']) &&  actions.push(<Popconfirm title="Sure to delete?" onConfirm={() => onDelete(item.id)}><DeleteOutlined />&nbsp;Löschen</Popconfirm>);

            return <List.Item 
                key={item.id}
                extra={<img width={512} alt="logo" src={`${process.env.API_URL}${item.cover}`}/>}
                actions={actions}
            >
                <List.Item.Meta
                    avatar={<Avatar src={`${process.env.API_URL}${author.avatar}`} size={'large'} />}
                    title={item.title}
                    description={`${author.name} - ${dayjs.unix(item.created).format('DD.MM.YYYY HH:mm')}`}
                />
                <Paragraph ellipsis={{ rows: 10, expandable: false }} >
                    <div dangerouslySetInnerHTML={{__html: item.body}} />
                </Paragraph>

                <style jsx global>{`
                    .ant-list-item-main {
                        overflow: hidden;
                    }
                `}</style>
            </List.Item>;
        }}
  />;
}