import { ReactElement } from "react";
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { List, Avatar } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { articlesSelector } from "../../store/selectors/article";
import { Article, publishArticle, unpublishArticle } from "../../store/Article";
import { AuthorEntities } from "../../store/Author";
import { authorEntitiesSelector } from "../../store/selectors/author";
import dayjs from 'dayjs';
import Link from 'next/link';
import Paragraph from "antd/lib/typography/Paragraph";


const IconText = ({ type, text }) => (
    <span>
      <LegacyIcon type={type} style={{ marginRight: 8 }} />
      {text}
    </span>
  );


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

    return <List
        itemLayout="vertical"
        size="large"
        pagination={{
            pageSize: 3,
        }}
        dataSource={articles}
        renderItem={item => {
            const author = authorEntities[item.author];

            return <List.Item 
                key={item.id}
                extra={<img width={512} alt="logo" src={`${process.env.API_URL}${item.cover}`}/>}
                actions={[
                    <Link href={`/editArticle/${item.id}`}><div><IconText type="edit" text="Edit" key="edit" /></div></Link>,
                    <div onClick={() => togglePublishStatus(item.id, item.status)}><IconText type="global" text={item.status !== 'published' ? 'Publish' : 'Unpublish'} key="list-vertical-like-o" /></div>,
                ]}
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