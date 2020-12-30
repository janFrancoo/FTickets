import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build_client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return (
        <div>
            <Header currentUser={currentUser} />
            <div className="container">
                <Component currentUser={currentUser} {...pageProps} />
            </div>
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
    const client = buildClient(appContext.ctx);
    const { data } = await client.get("/api/users/current-user");
    
    let pageProps = {};
    if (appContext.Component.getInitialProps)
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser); 
        // for to call getInitialProps multiple times for pages
    
    return {
        pageProps,
        ...data
    }
};

export default AppComponent;
