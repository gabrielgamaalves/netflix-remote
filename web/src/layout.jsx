// import { useEffect, useState } from "react";

export default function Layout({ children }) {
  return (
    <>
      <div className="container block mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {children}
      </div>
    </>
  );
}
