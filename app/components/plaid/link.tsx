import React, { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "plaid-threads/Button";
import { useTypedSelector } from "../../state/hooks/user";
import { RootState } from "~/state/store";
import { useFetcher } from "@remix-run/react";

function Link() {
  const plaidState = useTypedSelector((state: RootState) => state.plaid.value);
  const fetcher = useFetcher();
  const [isLoading, setLoading] = useState(false);
  const [isOauth, setIsOauth] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side
    if (window.location.href.includes("?oauth_state_id=")) {
      setIsOauth(true);
    }
  }, []);

  const onSuccess = useCallback(() => {
    setLoading(true); // Set loading to true when the process starts
    fetcher.submit(
      { linkToken: plaidState.linkToken },
      { action: "/api/plaid", method: "post" }
    );
  }, [fetcher, plaidState.linkToken]);

  useEffect(() => {
    if (fetcher.state === "idle" && isLoading) {
      setLoading(false); // Set loading to false when the fetcher is idle again
    }
  }, [fetcher.state, isLoading]);

  const config = {
    token: plaidState.linkToken!,
    onSuccess,
    receivedRedirectUri: isOauth ? window.location.href : undefined,
  };

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (isOauth && ready) {
      open();
    }
  }, [isOauth, ready, open]);

  if (typeof window === "undefined") {
    // Render nothing or a placeholder when on the server
    return null;
  }

  return (
    <>
      {isLoading ? (
        <p className="text-lg text-gray-600">Loading...</p>
      ) : !plaidState.accessToken ? (
        <button
          type="button"
          className={`
        ${
          !ready
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }
        font-semibold py-2 px-4 rounded-lg shadow transition duration-300 ease-in-out transform ${
          !ready ? "" : "hover:-translate-y-1 hover:scale-105"
        }
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-75
      `}
          onClick={() => open()}
          disabled={!ready}
        >
          Launch Link
        </button>
      ) : (
        <div>
          <p className="text-lg text-gray-700">
            Hello, you have successfully linked your account.
          </p>
        </div>
      )}
    </>
  );
}

export default Link;
