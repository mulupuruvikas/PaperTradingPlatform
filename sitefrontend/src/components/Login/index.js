import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from "jwt-decode";


const Login = () => {

    const navigate = useNavigate();

    function handleCallbackResponse(response) {
        var userObject = jwt_decode(response.credential);
        var emailAddress = userObject.email;
        let userId = 2;

        axios.get('http://localhost:8000/users/', {
            params: {
                email: emailAddress
            }
        })
            .then((res) => {
                const users = res.data;
                if (users.length > 0) {
                    userId = users[0].id;
                    navigate("/portfolio", { state: { id: userId } });
                } else {
                    axios.post('http://localhost:8000/users/', {
                        email: emailAddress,
                        portfolio: {
                            value: 200000,
                            cash: 200000,
                            p_L: 0,
                            stock_buying_power: 300000,
                            option_buying_power: 200000
                        }
                    })
                        .then((res) => {
                            axios.get('http://localhost:8000/users/', {
                                params: {
                                    email: emailAddress
                                }
                            })
                                .then((res) => {
                                    console.log("Users:", users);
                                    userId = users[0].id;
                                    console.log("Sending to homepage");
                                    navigate("/portfolio", { state: { id: userId } });
                                })
                            .catch((error) => {
                                console.error('Error fetching user id:', error);
                            });
                        })
                        .catch((error) => {
                            console.error('Error making create request:', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });

    }

    useEffect(() => {
        /*global google */
        google.accounts.id.initialize({
            client_id: "758107152580-fo4ln9omnabm2k9sn4n3947h5frbhcvs.apps.googleusercontent.com",
            callback: handleCallbackResponse
        })



        google.accounts.id.renderButton(
            document.getElementById("signInDiv"),
            { theme: "outline", size: "large"}
        )

    }, []);

    return (
        <div className="signinlayout">
            <div id="signInDiv"></div>
        </div>
    )
}

export default Login;