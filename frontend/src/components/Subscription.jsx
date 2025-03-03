import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Subscription.css";

const PLANS = {
  free: { amount: 0, tweets: 1 },
  bronze: { amount: 10000, tweets: 3 },
  silver: { amount: 30000, tweets: 5, popular: true },
  gold: { amount: 100000, tweets: -1 },
};

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PlanCard = ({
  planKey,
  planDetails,
  isLoaded,
  currentUser,
  onSelect,
}) => {
  const { t } = useTranslation();
  const isFree = planKey === "free";

  return (
    <article className={`plan-card ${planDetails.popular ? "popular" : ""}`}>
      {planDetails.popular && (
        <div className="popular-ribbon">{t("subscription.most_popular")}</div>
      )}
      <div className="plan-content">
        <h3 className="plan-title">{planKey.toUpperCase()}</h3>
        <div className="plan-features">
          <p className="tweet-limit">
            {planDetails.tweets === -1 ? (
              <>
                <span className="emoji">∞</span>{" "}
                {t("subscription.unlimited_tweets")}
              </>
            ) : (
              <>
                <span className="emoji">🐦</span> {planDetails.tweets}{" "}
                {t("subscription.tweets_per_day")}
              </>
            )}
          </p>
          <div className="pricing">
            {isFree ? (
              <p className="price-free">{t("subscription.free_forever")}</p>
            ) : (
              <>
                <p className="price-amount">₹{planDetails.amount / 100}</p>
                <p className="price-duration">{t("subscription.per_month")}</p>
              </>
            )}
          </div>
        </div>
        <button
          className={`plan-button ${isFree ? "free" : "premium"}`}
          onClick={() => onSelect(planKey)}
          disabled={!isLoaded && !isFree}
          aria-label={`Subscribe to ${planKey} plan`}
        >
          {isFree
            ? t("subscription.get_started")
            : t("subscription.subscribe_now")}
          {!isFree && <span className="button-arrow">→</span>}
        </button>
      </div>
    </article>
  );
};

const SubscriptionPlans = ({ currentUser }) => {
  const { t } = useTranslation();
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then(setRazorpayLoaded);
  }, []);

  const handleFreeSubscription = async (planKey) => {
    if (!currentUser?.uid) {
      alert(t("subscription.log_in_to_subscribe"));
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments/update-subscription`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.uid,
            plan: planKey,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || t("subscription.error_updating_subscription")
        );
      }

      alert(t("subscription.free_plan_activated"));
    } catch (error) {
      console.error("Free subscription error:", error);
      alert(t("subscription.error_updating_subscription"));
    }
  };

  const handlePayment = async (planKey) => {
    if (!razorpayLoaded) {
      alert("Razorpay script not loaded. Please try again.");
      return;
    }

    if (!currentUser?.uid) {
      alert(t("subscription.log_in_to_subscribe"));
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: planKey, userId: currentUser.uid }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (
          errorData.error ===
          "Payments are only allowed between 10:00 AM and 11:00 AM."
        ) {
          alert(errorData.error);
          return;
        }
        throw new Error(errorData.error || "Failed to create order");
      }

      const resData = await response.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: resData.amount,
        currency: resData.currency,
        name: "Your Twitter Clone",
        description: `${planKey} Plan Subscription`,
        order_id: resData.id,
        handler: async (response) => {
          // console.log("Razorpay Response:", response);

          if (
            !response.razorpay_payment_id ||
            !response.razorpay_order_id ||
            !response.razorpay_signature
          ) {
            alert(t("subscription.payment_verification_failed"));
            return;
          }

          try {
            const successResponse = await fetch(
              `${
                import.meta.env.VITE_API_BASE_URL
              }/api/payments/payment-success`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  userEmail: currentUser?.email,
                  userName: currentUser.providerData[0]?.displayName || "",
                  plan: planKey,
                  userId: currentUser.uid,
                }),
              }
            );

            const successData = await successResponse.json();
            if (successResponse.ok) {
              alert(t("subscription.payment_successful"));
            } else {
              alert(
                `${t("subscription.payment_verification_failed")}: ${
                  successData.error
                }`
              );
            }
          } catch (error) {
            console.error("Payment confirmation error:", error);
            alert(t("subscription.error_confirming_payment"));
          }
        },
        prefill: {
          email: currentUser?.email || "",
          name: currentUser.providerData[0]?.displayName || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert(error.message); // Ensure the specific error message is alerted
    }
  };

  return (
    <section className="subscription-grid">
      {Object.entries(PLANS).map(([planKey, planDetails]) => (
        <PlanCard
          key={planKey}
          planKey={planKey}
          planDetails={planDetails}
          isLoaded={razorpayLoaded}
          currentUser={currentUser}
          onSelect={planKey === "free" ? handleFreeSubscription : handlePayment}
        />
      ))}
    </section>
  );
};

export default SubscriptionPlans;
