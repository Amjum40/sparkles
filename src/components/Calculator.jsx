import React, { useState } from 'react';
import './Calculator.css';

const Calculator = ({ onUnlock, user }) => {
    const [display, setDisplay] = useState('');
    const [error, setError] = useState('');

    const handlePress = (val) => {
        if (val === '=') {
            try {
                const enteredCode = display + '=';

                // If user is logged in, check their specific code
                if (user) {
                    if (user.secret_code === enteredCode) {
                        onUnlock(enteredCode);
                        setDisplay('');
                        setError('');
                    } else {
                        setError('Wrong code!');
                        setDisplay('');
                        setTimeout(() => setError(''), 2000);
                    }
                } else {
                    // No user logged in, use default code or just unlock
                    if (enteredCode === '1234=') {
                        onUnlock(enteredCode);
                        setDisplay('');
                        setError('');
                    } else {
                        // Try to evaluate as math
                        setDisplay(eval(display).toString());
                    }
                }
            } catch (e) {
                setDisplay('Error');
                setTimeout(() => setDisplay(''), 1000);
            }
        } else if (val === 'C') {
            setDisplay('');
            setError('');
        } else {
            setDisplay(display + val);
        }
    };

    const buttons = [
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        'C', '0', '=', '+'
    ];

    return (
        <div className="calculator-container">
            <div className="calculator-display">{display || (error ? error : '0')}</div>
            <div className="calculator-grid">
                {buttons.map((btn) => (
                    <button key={btn} onClick={() => handlePress(btn)} className="calc-btn">
                        {btn}
                    </button>
                ))}
            </div>
            {user && (
                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '0.85rem', color: '#888' }}>
                    Welcome back, {user.username}! Enter your secret code.
                </p>
            )}
        </div>
    );
};

export default Calculator;
