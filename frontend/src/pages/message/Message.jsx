import React, { useState } from "react";
import { FaSearch, FaEnvelopeOpenText } from "react-icons/fa";
import Sidebar from "../sidebar/Sidebar";
import Widgets from "../widgets/Widgets";
import { useUserAuth } from "../../context/Userauthcontext";
import { useTranslation } from "react-i18next";
import "./Message.css";

function Message() {
  const { t } = useTranslation(); // Use useTranslation hook
  const { user } = useUserAuth();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "John Doe",
      text: "Hey, how are you?",
      timestamp: "2h ago",
    },
    {
      id: 2,
      sender: "Jane Smith",
      text: "Check out this cool link!",
      timestamp: "1d ago",
    },
  ]);

  return (
    <div className="message">
      <Sidebar user={user} />
      <div className="message__main">
        <div className="message__header">
          <h2>{t("messages.title")}</h2>
          <div className="message__search">
            <FaSearch className="message__searchIcon" />
            <input type="text" placeholder={t("messages.search_placeholder")} />
          </div>
        </div>
        <div className="message__list">
          {messages.map((message) => (
            <div key={message.id} className="message__item">
              <FaEnvelopeOpenText className="message__icon" />
              <div className="message__details">
                <h3>{message.sender}</h3>
                <p>{message.text}</p>
                <span>{message.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Widgets />
    </div>
  );
}

export default Message;
