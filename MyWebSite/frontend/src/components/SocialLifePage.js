// frontend/src/components/SocialLifePage.js

import React, { useState, useEffect } from "react";
import "../assets/styles/SocialLifePage.css";
import SocialAccountCard from "./SocialAccountCard";
import { fetchUserSocialAccounts, fetchSocialMediaFeeds } from "../utils/socialMediaService";

const SocialLifePage = () => {
    const [connectedAccounts, setConnectedAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [feeds, setFeeds] = useState([]);

    // Fetch connected social media accounts
    useEffect(() => {
        const loadAccounts = async () => {
            const accounts = await fetchUserSocialAccounts();
            setConnectedAccounts(accounts);
            if (accounts.length > 0) setSelectedAccount(accounts[0]);
        };

        loadAccounts();
    }, []);

    // Fetch feeds when account changes
    useEffect(() => {
        const loadFeeds = async () => {
            if (selectedAccount) {
                const accountFeeds = await fetchSocialMediaFeeds(selectedAccount.platform);
                setFeeds(accountFeeds);
            }
        };

        loadFeeds();
    }, [selectedAccount]);

    return (
        <div className="social-life-page">
            <header className="social-header">
                <h1>My Social Life</h1>
                <p>Manage and view your connected social media accounts.</p>
            </header>

            {/* Accounts Section */}
            <section className="accounts-section">
                <h2>Connected Accounts</h2>
                <div className="accounts-container">
                    {connectedAccounts.length > 0 ? (
                        connectedAccounts.map((account) => (
                            <SocialAccountCard
                                key={account.platform}
                                account={account}
                                isSelected={account.platform === selectedAccount?.platform}
                                onSelect={() => setSelectedAccount(account)}
                            />
                        ))
                    ) : (
                        <p>No connected accounts. Connect your social media now!</p>
                    )}
                </div>
            </section>

            {/* Feeds Section */}
            <section className="feeds-section">
                <h2>{selectedAccount?.platform || "Select an Account"} Feeds</h2>
                <div className="feeds-container">
                    {feeds.length > 0 ? (
                        feeds.map((feed, index) => (
                            <div key={index} className="feed-card">
                                <h3>{feed.title}</h3>
                                <p>{feed.content}</p>
                                <span>Posted on {feed.date}</span>
                            </div>
                        ))
                    ) : (
                        <p>No feeds available for this account.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default SocialLifePage;