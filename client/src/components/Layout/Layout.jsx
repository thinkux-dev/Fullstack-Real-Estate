import React, { useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from "react";
import UserDetailContext from "../../context/UserDetailContext";
import { useMutation } from "react-query";
import { createUser } from "../../utils/api";
import useFavourites from "../../hooks/UseFavourites";
import useBookings from "../../hooks/useBookings";

function Layout() {
    useFavourites()
    useBookings()

    const { isAuthenticated, user, getAccessTokenWithPopup } = useAuth0();
    const { setUserDetails } = useContext(UserDetailContext);

    const { mutate } = useMutation({
        mutationKey: [user?.email],
        mutationFn: (token) => createUser(user?.email, token),
    });

    useEffect(() => {
        const getTokenAndRegister = async () => {
            const res = await getAccessTokenWithPopup({
                authorizationParams: {
                    audience: "http://localhost:9000",
                    scope: "openid profile email",
                },
            });

            localStorage.setItem("access_token", res);
            setUserDetails((prev) => ({ ...prev, token: res }));
            mutate(res);
        };

        isAuthenticated && getTokenAndRegister();
    }, [isAuthenticated]);

    return (
        <>
            <div style={{ background: "var(--black)", overflow: "hidden" }}>
                <Header />
                <Outlet />{" "}
                {/*To fetch the rest of the website children. E.g, The hero, residencies etc... */}
            </div>
            <Footer />
        </>
    );
}

export default Layout;
