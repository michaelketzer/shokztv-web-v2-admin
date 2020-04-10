import { ReactElement, ReactNode } from "react";
import { Layout } from "antd";
import Head from "next/head";
import PageMenu from "./PageMenu";

export default function PageFrame({children, title = ''}: {children: ReactNode; title?: string}): ReactElement {
    return <Layout className="layout" style={{ height: '100vh' }}>
        <Head>
            <meta charSet="UTF-8"/>
            <title>shokzTV - Admin {title.length > 0 && ` - ${title}`}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>

        <Layout.Header  style={{ height: '46px' }}><PageMenu /></Layout.Header>
        <Layout.Content style={{ padding: '50px', overflowY: 'scroll' }}>
            <div>
                {children}
            </div>
        </Layout.Content>
    </Layout>;
}