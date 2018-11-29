import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
    return (
    <h2>Hi there! Please <Link to='/signin'>Login</Link> or <Link to='/signup'>Register</Link></h2>
    )
}

export default Welcome;
