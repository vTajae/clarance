// withLoader.tsx
import React from "react";
import { useAppContext } from "~/contexts/app-context"; // Import useAppContext

interface LoaderProps {
  children: React.ReactNode;
  isLoading: boolean;
}

export function Loader({ children, isLoading }: LoaderProps): JSX.Element {
  const { state } = useAppContext(); // Use the custom hook to access the state
  if (state.isLoading) {
    return (
      <div>
        {/* Your loader design here */}
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}
