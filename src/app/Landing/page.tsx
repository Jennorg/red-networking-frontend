"use client";

import React from "react";
import Header from "@/components/layout/header/Header";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <div className="flex">
        <main className="flex-1">
          <h1 className="text-white text-2xl font-bold">Landing Page</h1>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
