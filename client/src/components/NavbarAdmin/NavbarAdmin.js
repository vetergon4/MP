import React from 'react';
import PropTypes from 'prop-types';
import { Flex, Box } from '@chakra-ui/react';

//use return to show Navbar on top, using flexbox to align items
const NavbarAdmin = () => {
    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="0.5rem"
            bg="blue.500"
            color="white"
            position="fixed"
            width="100%"
            zIndex="1"
        >
            <Box>
                <a href="/">
                    <img
                        src="https://i.imgur.com/1Vn2J9R.png"
                        alt="logo"
                        width="150"
                    />
                </a>
            </Box>
            <Box>
                <a href="/adminDashboard">
                    <button
                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                    >
                        Dashboard
                    </button>
                </a>
                <a href="/adminLogin">
                    <button
                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                    >
                        Logout
                    </button>
                </a>
            </Box>
        </Flex>
    );
};

NavbarAdmin.propTypes = {};

NavbarAdmin.defaultProps = {};

export default NavbarAdmin;
