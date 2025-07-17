import { Home, Mail, MessageCircle, Phone } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { ContactUs as ContactUsType } from "@/app/types/landing";

interface ContactUsProps {
  contactUs: ContactUsType[];
}

export default function ContactUs({ contactUs }: ContactUsProps) {
  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-gray-100 via-gray-50 to-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=50')] opacity-5"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">
            CONTACT US
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">
            Get in touch for premium legal services
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div className="bg-white md:p-10 p-6 rounded-3xl shadow-2xl border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a message
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Get in touch with us for premium business service, we will promptly
              respond to all your enquiries.
            </p>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label
                  htmlFor="remark"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="remark"
                  placeholder="Tell us about your legal needs..."
                  rows={5}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 resize-none"
                ></textarea>
              </div>

              <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-lg font-semibold">
                Send Message
              </Button>
            </form>
          </div>

          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactUs.map((contact, index) => {
                let icon = null;
                let color = "from-blue-500 to-blue-600";
                if (contact.medium.toLowerCase().includes("phone")) {
                  icon = <Phone className="w-6 h-6 text-white" />;
                  color = "from-blue-500 to-blue-600";
                } else if (contact.medium.toLowerCase().includes("email")) {
                  icon = <Mail className="w-6 h-6 text-white" />;
                  color = "from-green-500 to-green-600";
                } else if (contact.medium.toLowerCase().includes("whatsapp")) {
                  icon = <MessageCircle className="w-6 h-6 text-white" />;
                  color = "from-emerald-500 to-emerald-600";
                } else if (contact.medium.toLowerCase().includes("office")) {
                  icon = <Home className="w-6 h-6 text-white" />;
                  color = "from-purple-500 to-purple-600";
                }
                return (
                  <div
                    key={contact.id}
                    className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${color} rounded-xl flex items-center justify-center mb-4`}
                    >
                      {icon}
                    </div>
                    <h3 className="text-gray-500 font-semibold mb-2">{contact.medium}</h3>
                    <p className="text-gray-900 font-bold">
                      {contact.email || contact.phone_number || "-"}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex-1">
              <div className="h-full">
                <iframe
                  src="https://www.google.com/maps/embed/v1/place?q=dembel%20city%20center&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-3xl"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
