import React from "react";
import {createStore, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import App from "next/app";
import withRedux from "next-redux-wrapper";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";
import {storeReducer} from '../store/Store';
import networkMiddleware from '../store/middleware/NetworkMiddleware';
import 'antd/dist/antd.css';

const makeStore = () => {
    const composeEnhancers = composeWithDevTools({name: 'shokz.tv admin'});
    return createStore(storeReducer, composeEnhancers(applyMiddleware(thunk, networkMiddleware)));
};

class MyApp extends App {

    static async getInitialProps({Component, ctx}) {
        const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};
        return {pageProps};
    }

    render() {
        const {Component, pageProps, store} = this.props;
        return (
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        );
    }

}

export default withRedux(makeStore)(MyApp);