// frontend/src/components/SocialAccountCard.js

import React from "react";
import "../assets/styles/SocialAccountCard.css";

const SocialAccountCard = ({ account, isSelected, onSelect }) => {
    return (
        <div
            className={`account-card ${isSelected ? "selected" : ""}`}
            onClick={onSelect}
        >
            <img
                src={`/assets/images/${account.platform.toLowerCase()}.png`}
                alt={account.platform}
                className="account-icon"
            />
            <div className="account-info">
                <h3>{account.platform}</h3>
                <p>{account.username}</p>
            </div>
        </div>
    );
};

export default SocialAccountCard;