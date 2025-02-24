import React, { useEffect, useState } from 'react';

const App = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/api/test')  // Flask API endpoint
            .then(res => res.json())
            .then(data => setMessage(data.message));
    }, []);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
};

export default App;
