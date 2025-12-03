import React from 'react';

const AuthFormLayout = ({ title, subtitle, children, showMobileLogo = true }) => {
  return (
    <>
      {showMobileLogo && (
        <div className="lg:hidden text-center mb-8">
          <img
            src="https://www.launchuicomponents.com/favicon.svg"
            alt="Logo"
            className="w-8 h-8 mx-auto mb-3"
          />
          <h1 className="text-xl font-semibold text-foreground">Shopease</h1>
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl text-foreground">{title}</h2>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {children}
      </div>
    </>
  );
};

export default AuthFormLayout;

