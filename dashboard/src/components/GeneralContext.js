import React, { useState } from "react";

import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, onExecuted) => {},
  closeBuyWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [onExecuted, setOnExecuted] = useState(null);

  // uid: symbol to trade. onExecuted (optional): called after an order is
  // successfully placed, so the caller can refresh whatever depends on it
  // (e.g. Stock Detail's quote/holding state) without a full page reload.
  const handleOpenBuyWindow = (uid, onExecutedCallback) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setOnExecuted(() => onExecutedCallback || null);
  };

  const handleCloseBuyWindow = (executed) => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    if (executed && onExecuted) {
      onExecuted();
    }
    setOnExecuted(null);
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
      }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
