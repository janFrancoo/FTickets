import buildClient from "../api/build_client";

const IndexPage = ({ currentUser }) => {
    return currentUser ? <h1>Welcome!</h1> : <h1>Please, sign in</h1>
};

IndexPage.getInitialProps = async (context) => {
    const { data } = await buildClient(context).get("/api/users/current-user");
    return data;    
};

export default IndexPage;
