import React, { useEffect, useState } from 'react';
import { cookieConsentService } from '../../services/cookieConsentService';
import { analyticsService } from '../../services/analyticsService';
import './styles.css';

const CookieConsent: React.FC = () => {
    const [show, setShow] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    
    useEffect(() => {
        const consent = cookieConsentService.getConsent();
        if (consent.timestamp === 0) {
            setShow(true);
        }
    }, []);

    const handleAcceptAll = () => {
        const consent = {
            analytics: true,
            marketing: true,
            necessary: true
        };
        cookieConsentService.setConsent(consent);
        analyticsService.initializeAnalytics();
        setShow(false);
    };

    const handleAcceptNecessary = () => {
        const consent = {
            analytics: false,
            marketing: false,
            necessary: true
        };
        cookieConsentService.setConsent(consent);
        setShow(false);
    };

    const handleCustomize = () => {
        setShowDetails(!showDetails);
    };

    if (!show) return null;

    return (
        <div className="cookie-consent">
            <div className="cookie-content">
                <div className="cookie-header">
                    <h3>🍪 Cookie Settings</h3>
                    <button 
                        onClick={() => setShow(false)} 
                        className="close-button"
                    >
                        ✕
                    </button>
                </div>
                
                <div className="cookie-text">
                    <p>
                        We use cookies to enhance your browsing experience and analyze website traffic. 
                        Below you can choose which types of cookies you allow us to use.
                    </p>
                    
                    <button 
                        onClick={handleCustomize}
                        className="details-button"
                    >
                        {showDetails ? 'Hide Details' : 'Show Details'} ▼
                    </button>

                    {showDetails && (
                        <div className="cookie-details">
                            <div className="cookie-type">
                                <h4>Necessary Cookies</h4>
                                <p>These cookies are essential for the website to function properly and cannot be disabled.</p>
                            </div>
                            
                            <div className="cookie-type">
                                <h4>Analytics Cookies</h4>
                                <p>Help us understand how visitors interact with our website.</p>
                                <ul>
                                    <li>Page views and navigation</li>
                                    <li>Time spent on pages</li>
                                    <li>Scroll depth tracking</li>
                                    <li>Form interactions</li>
                                </ul>
                            </div>
                            
                            <div className="cookie-type">
                                <h4>Marketing Cookies</h4>
                                <p>Used to deliver personalized advertisements and measure their effectiveness.</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="cookie-buttons">
                    <button 
                        onClick={handleAcceptNecessary}
                        className="button secondary"
                    >
                        Necessary Only
                    </button>
                    <button 
                        onClick={handleAcceptAll}
                        className="button primary"
                    >
                        Accept All
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
