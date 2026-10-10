import React from "react";

const Bag = () => {
  return (
    <div className="bag-page">

      <h1>Your Bag is empty.</h1>

      <p>
        <a href="/signin">Sign in</a> to see if you have any saved items
      </p>

      <h3>My Profile</h3>

      <p>📦 Orders</p>
      <p>🔖 Your Saves</p>
      <p>⚙️ Account</p>
      <p>👤 Sign in</p>

    </div>
  );
};

export default Bag;