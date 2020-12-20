import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build_client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} />
        </div>
    );
};

/*
is called when
refreshing page -> ssr
url typing -> ssr
come from another domain -> ssr
navigating in app -> csr
*/
AppComponent.getInitialProps = async (appContext) => {
    const { data } = await buildClient(appContext.ctx).get("/api/users/current-user");
    
    let pageProps = {};
    if (appContext.Component.getInitialProps)
        pageProps = await appContext.Component.getInitialProps(appContext.ctx); // for to call getInitialProps multiple times for pages
    
    return {
        pageProps,
        ...data
    }
};

export default AppComponent;
