import { useState, useEffect } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use_request";
import Router from "next/router"

const OrderShow = ({ order, currentUser }) => {
    const { doRequest, errors } = useRequest({
        url: "/api/payments",
        method: "post",
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => Router.push("/")
    });

    const [timeLeft, setTimeLeft] = useState(0);
    
    useEffect(() => {
        const calculateTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000));
        };

        calculateTimeLeft();
        const intervalId = setInterval(calculateTimeLeft, 1000);

        return () => {
            clearInterval(intervalId);
        }
    }, []);

    if (timeLeft <= 0)
        return <div>Order is cancelled.</div>

    return (
        <div>
            You have {timeLeft} seconds left.
            <StripeCheckout
                token={({ id }) => doRequest({ token: id })}
                stripeKey="pk_test_51I3K7FJMa4HaOuuhQQXtdUYAxcsUpvjbLlfXnGQzeA7VMtNb0l47aABvfrNAH9LADJ3ZGKzzXZjXHliISlS8dYRA004lROc7mN"
                amount={order.ticket.price * 100}
                email={currentUser.email}
                 />
        </div>
    )
};

OrderShow.getInitialProps = async (context, client) => {
    const { orderId } = context.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
};

export default OrderShow;