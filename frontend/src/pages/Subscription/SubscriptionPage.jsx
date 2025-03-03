import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import SubscriptionPlans from "../../components/Subscription";
import Sidebar from "../sidebar/Sidebar";
import Widgets from "../widgets/Widgets";
import "./SubscriptionPage.css";

const SubscriptionPage = ({ currentUser }) => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t("subscription.page_title");
  }, [t]);

  return (
    <div className="app__layout">
      <Sidebar />
      <main className="subscription-page">
        <header className="page-header">
          <h1 className="page-header__title">
            {t("subscription.choose_plan")}
          </h1>
          <p className="page-header__subtitle">
            {t("subscription.upgrade_experience")}
          </p>
        </header>

        <section className="plans-section">
          <SubscriptionPlans currentUser={currentUser} />
        </section>

        <aside className="features-card">
          <h2 className="features-card__title">
            {t("subscription.all_plans_include")}
          </h2>
          <ul className="features-list">
            <li className="features-list__item">
              <span className="feature-icon">📊</span>
              {t("subscription.basic_analytics")}
            </li>
            <li className="features-list__item">
              <span className="feature-icon">🎨</span>
              {t("subscription.profile_customization")}
            </li>
            <li className="features-list__item">
              <span className="feature-icon">🛎️</span>
              {t("subscription.support")}
            </li>
          </ul>
        </aside>
      </main>
      <Widgets />
    </div>
  );
};

export default SubscriptionPage;
