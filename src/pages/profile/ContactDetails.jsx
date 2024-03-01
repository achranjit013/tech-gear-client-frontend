import React from "react";
import MainLayout from "../../components/layouts/MainLayout";
import Sidebar from "../../components/layouts/Sidebar";

const ContactDetails = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 xs:grid-cols-[256px,minmax(0,1fr)]">
        <Sidebar />

        <div className="p-4">
          <div className="p-4 border-2 border-dashed rounded-lg border-gray-800">
            <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-800">
              <p className="text-2xl text-gray-500">Contact Details To do...</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactDetails;
