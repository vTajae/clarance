// PageTemplate.tsx
import React from "react";
import Header from "./header";
import Footer from "./footer";
import { UserContext, UserModel } from "../../state/user/userSlice"; // Update the import path as needed

interface PageTemplateProps {
  children: React.ReactNode;
  user: UserModel | null; // Ensure this matches the prop expected by Header
  context: UserContext;
}

const PageTemplate: React.FC<PageTemplateProps> = ({ children, user, context }) => {
  if (context.isLoading === true || context.isLoading === null) {
    return (
      <header className="header-content">
        <div className="loader">Loading...</div>
      </header>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <div className="py-4">
        <Header user={user} context={context}/>
      </div>
      <main className="main-content flex-grow py-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <div className="">
        <Footer />
      </div>
    </div>
  );
};

export default PageTemplate;
