import React from "react";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";

function Policies() {
  return (
    <>
      <Header />
      <section id="policies" className="mx-auto py-32">
        <div className="text-center mb-12 border-b pb-12 border-gray-200">
          <h2 className="text-3xl font-extrabold sm:text-4xl bg-gradient-to-r from-blue-500 via-primary to-purple-700 bg-clip-text text-transparent">
            Legal & Policies
          </h2>
          <p className="mt-2 text-secondary text-sm sm:text-base px-4">
            Transparency matters. Here’s everything you need to know.
          </p>
        </div>

        <div className="space-y-12 text-gray-700 text-sm sm:text-base leading-relaxed mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              Contact Information
            </h3>
            <div className="space-y-1 text-sm md:text-base">
              <p>StellarSync</p>
              <p>BHND TRUTH AND TRUST ACADE.</p>
              <p>Phone: 08085458632</p>
              {/* <p>Email: abdrzq.salihu@gmail.com</p> */}
            </div>
          </div>

          {/* Refund Policy */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              Refund Policy
            </h3>
            <p className="text-sm md:text-base leading-6">
              Refunds apply only to duplicate payments, unauthorized
              transactions, or undelivered services. Requests must be made
              within <strong>7 days</strong> of the transaction at{" "}
              <a href="mailto:abdrzq.salihu@gmail.com">
                <span className="text-primary">abdrzq.salihu@gmail.com</span>
              </a>
              . Approved refunds are processed within{" "}
              <strong>7–14 business days</strong>. Transaction charges are
              non-refundable.
            </p>
          </div>

          {/* Privacy Policy */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              Privacy Policy
            </h3>
            <p className="text-sm md:text-base leading-6">
              Stellarsync collects minimal personal data (such as name, email,
              phone, and payment details) strictly to deliver services. We never
              sell or rent your information. Data is protected with
              industry-standard security measures. By using our platform, you
              agree to this policy.
              {/* For inquiries, contact{" "} <span className="text-primary">privacy@stellarsync.com</span>. */}
            </p>
          </div>

          {/* Terms & Conditions */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              Terms & Conditions
            </h3>
            <ol className="list-decimal ml-6 space-y-2 text-sm md:text-base leading-6">
              <li>
                You must be at least 12 years old to use Stellarsync services.
              </li>
              <li>
                Stellarsync provides digital tools for uploading, managing, and
                sharing content. Misuse or illegal activity is prohibited.
              </li>
              <li>
                Users agree to pay applicable fees for premium services.
                Non-payment may result in suspended access.
              </li>
              <li>Refunds are governed by our Refund Policy above.</li>
              <li>
                Stellarsync is not liable for indirect or incidental damages
                arising from service use.
              </li>
              <li>
                Terms may be updated anytime. Continued use means acceptance of
                the new terms.
              </li>
            </ol>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Policies;
