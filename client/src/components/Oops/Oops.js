import React, { useEffect } from 'react';
import PropTypes from "prop-types";
import { Flex, CircularProgress } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

//components
import PageContainer from "../Layout/PageContainer/PageContainer";
import PageContent from "../Layout/PageContent/PageContent";
import Nav from "../Layout/Nav/Nav";
import Footer from "../Layout/Footer/Footer";

const Oops = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      // Redirect to the login component after 3 seconds
      navigate("/login");
    }, 3000);

    // Clear the timer when the component unmounts or the redirect happens
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <PageContainer>
      <PageContent title="This page doesn't exist or you can't access it - redirecting.">
        <Flex height="80vh" alignItems="center" justifyContent="center">
          <CircularProgress size="100px" isIndeterminate color="blue.300" />
        </Flex>
      </PageContent>
      <Footer />
    </PageContainer>
  );
};

Oops.propTypes = {};

Oops.defaultProps = {};

export default Oops;
