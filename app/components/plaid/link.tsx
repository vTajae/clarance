import React, { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "plaid-threads/Button";
import { useTypedSelector } from "~/hooks/user";
import { RootState } from "~/state/store";
import { useFetcher } from "@remix-run/react";

const Link = () => {
  const plaidState = useTypedSelector((state: RootState) => state.plaid.value);
  const fetcher = useFetcher();
  const [isLoading, setLoading] = useState(false);

  const onSuccess = React.useCallback(() => {
    setLoading(true); // Set loading to true when the process starts
    fetcher.submit({ linkToken: plaidState.linkToken }, { action: '/api/plaid', method: 'post' });
  }, [fetcher, plaidState.linkToken]);

  useEffect(() => {
    if (fetcher.state === 'idle' && isLoading) {
      setLoading(false); // Set loading to false when the fetcher is idle again
    }
  }, [fetcher.state, isLoading]);

  let isOauth = false;
  const config: Parameters<typeof usePlaidLink>[0] = {
    token: plaidState.linkToken!,
    onSuccess,
  };

  if (typeof window !== "undefined") {
    if (window.location.href.includes("?oauth_state_id=")) {
      config.receivedRedirectUri = window.location.href;
      isOauth = true;
    }
  }

  const { open, ready } = usePlaidLink(config);

  useEffect(() => {
    if (isOauth && ready) {
      open();
    }
  }, [isOauth, ready, open]);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : !plaidState.accessToken ? (
        <Button type="button" large onClick={() => open()} disabled={!ready}>
          Launch Link
        </Button>
      ) : (
        <div>
          <p>Hello, you have successfully linked your account.</p>
        </div>
      )}
    </>
  );
};

export default Link;
