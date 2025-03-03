import React from "react";
import { FaSearch } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import "./Widgets.css";

function Widgets() {
  const { t } = useTranslation(); // Use useTranslation hook

  return (
    <div className="widgets">
      <div className="widgets__search-container">
        <div className="widgets__search-input">
          <FaSearch className="widgets__search-icon" />
          <input
            type="text"
            placeholder={t("widgets.search_placeholder")}
            className="widgets__search-field"
          />
        </div>
      </div>

      <div className="widgets__content-container">
        <h2 className="widgets__heading">{t("widgets.heading")}</h2>

        <div className="widgets__trending-item">
          <div className="widgets__trending-meta">
            <span className="widgets__trending-category">
              {t("widgets.trending_category_programming")}
            </span>
            <h3 className="widgets__trending-title">#ReactJS</h3>
            <p className="widgets__trending-stats">
              {t("widgets.posts", { count: 15400 })}
            </p>
          </div>
        </div>

        <div className="widgets__trending-item">
          <div className="widgets__trending-meta">
            <span className="widgets__trending-category">
              {t("widgets.trending_category_technology")}
            </span>
            <h3 className="widgets__trending-title">#JavaScript</h3>
            <p className="widgets__trending-stats">
              {t("widgets.posts", { count: 28200 })}
            </p>
          </div>
        </div>

        <button className="widgets__show-more">{t("widgets.show_more")}</button>
      </div>
    </div>
  );
}

export default Widgets;
