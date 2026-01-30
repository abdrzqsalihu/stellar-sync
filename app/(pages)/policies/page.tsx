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
          <div className="hidden">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              Contact Information
            </h3>
            <div className="space-y-1 text-sm md:text-base">
              <p>StellarSync</p>
              <p>BHND TRUTH AND TRUST ACADE.</p>
              <p>Phone: 08085458632</p>
            </div>
          </div>

          {/* Refund Policy */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-1">
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

            <div className="space-y-6 text-sm md:text-base">
              <p>
                <strong>Effective Date:</strong> January 2026
              </p>

              <p>
                StellarSync (“we,” “our,” or “us”) respects your privacy and is committed
                to protecting the personal information of users who access or use our file
                sharing and file management platform (the “Service”).
              </p>

              <p>
                This Privacy Policy explains what information we collect, how we use it,
                and the choices you have regarding your information.
              </p>

              <hr className="border-gray-200" />

              <h4 className="font-semibold text-gray-900">1. Information We Collect</h4>

              <p className="!mt-2">
                When you use StellarSync, we may collect the following types of
                information:
              </p>

              <h5 className="font-semibold text-gray-900">a. Personal Information</h5>
              <p className="!mt-2">We may collect personal details such as:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Billing or payment-related details</li>
              </ul>

              <h5 className="font-semibold text-gray-900">b. Uploaded Content</h5>
              <p className="!mt-2">
                As a file storage and sharing platform, we collect and store files and
                content that you voluntarily upload, including:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Documents, images, and other files</li>
                <li>File metadata (file name, size, type)</li>
              </ul>

              <h5 className="font-semibold text-gray-900">
                c. Usage and Technical Information
              </h5>
              <p className="!mt-2">We may automatically collect certain technical data, including:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>IP address</li>
                <li>Browser type and device information</li>
                <li>Log data (pages visited, access times)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <hr className="border-gray-200" />

              <h4 className="font-semibold text-gray-900">2. How We Use Your Information</h4>

              <p className="!mt-2">We use collected information to:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Provide and maintain the Service</li>
                <li>Allow users upload, store, and share files securely</li>
                <li>Process payments for premium features (if applicable)</li>
                <li>Communicate important updates or support responses</li>
                <li>Prevent fraud, abuse, or unauthorized activity</li>
                <li>Improve platform performance and user experience</li>
              </ul>

              <hr className="border-gray-200" />

              <h4 className="font-semibold text-gray-900">3. Payment Processing</h4>

              <p className="!mt-2">
                Payments on StellarSync are processed through third-party payment
                providers such as <strong>Flutterwave</strong>.
              </p>

              <p className="!mt-1">
                StellarSync does not store sensitive card details directly. Payment
                providers handle transactions securely in accordance with their compliance
                standards.
              </p>

              <hr className="border-gray-200" />

              <h4 className="font-semibold text-gray-900">4. Sharing of Information</h4>

              <p className="!mt-2">We do <strong>not</strong> sell or rent your personal information.</p>

              <p className="!mt-1">We may share information only in the following cases:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  With service providers necessary to operate the platform (e.g., payment
                  processors, hosting services)
                </li>
                <li>To comply with legal obligations or lawful requests</li>
                <li>
                  To protect the rights, safety, and security of StellarSync and its users
                </li>
              </ul>

              <hr className="border-gray-200" />

              <h4 className="font-semibold text-gray-900">5. Data Storage and Security</h4>

              <p className="!mt-2">
                We implement industry-standard security measures to protect user data,
                including:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Secure authentication</li>
                <li>Encrypted connections (HTTPS)</li>
                <li>Access controls for stored files</li>
              </ul>

              <p>
                However, no system can be 100% secure, and users are responsible for
                safeguarding their login credentials.
              </p>

              <hr className="border-gray-200" />

              <h4 className="font-semibold text-gray-900">6. Data Retention</h4>

              <p className="!mt-2">
                We retain personal information and uploaded files only as long as
                necessary to provide the Service or meet legal and operational
                requirements.
              </p>

              <p className="!mt-2">Users may request deletion of their data by contacting us.</p>

              <hr className="border-gray-200" />

              <h4 className="font-semibold text-gray-900">7. User Rights</h4>

              <p className="!mt-2">You have the right to:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Access or update your account information</li>
                <li>Request deletion of your personal data</li>
                <li>Withdraw consent where applicable</li>
              </ul>

              <p>To make such requests, contact us using the details below.</p>

              <hr className="border-gray-200" />

              <h4 className="font-semibold text-gray-900">8. Children’s Privacy</h4>

              <p className="!mt-2">
                StellarSync is not intended for children under the age of 13. We do not
                knowingly collect personal information from children.
              </p>

              <hr className="border-gray-200" />

              <h4 className="font-semibold text-gray-900">9. Cookies</h4>

              <p className="!mt-2">We may use cookies or similar technologies to:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Maintain user sessions</li>
                <li>Improve platform performance</li>
                <li>Analyze usage trends</li>
              </ul>

              <p>
                You may disable cookies through your browser settings, though some
                features may not function properly.
              </p>

              <hr className="border-gray-200" />

              <h4 className="font-semibold text-gray-900">10. Changes to This Policy</h4>

              <p className="!mt-2">
                We may update this Privacy Policy from time to time. Continued use of the
                Service after updates means you accept the revised policy.
              </p>

              <hr className="border-gray-200" />

              <h4 className="font-semibold text-gray-900">11. Contact Information</h4>

              <p className="!mt-2">If you have any questions about this Privacy Policy, please contact:</p>

              <p>
                <strong>StellarSync</strong>
                <br />
                <strong>Address:</strong> BHND TRUTH AND TRUST ACADE
                <br />
                <strong>Phone:</strong> +234 808 545 8632
                <br />
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:abdrzq.salihu@gmail.com"
                  className="text-primary underline"
                >
                  abdrzq.salihu@gmail.com
                </a>
              </p>
            </div>
          </div>


          {/* Terms & Conditions */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
              Terms & Conditions
            </h3>
            <ol className="list-decimal ml-6 space-y-2 text-sm md:text-base leading-6">
              <li>You must be at least 12 years old to use StellarSync.</li>
              <li>
                StellarSync provides tools for uploading, managing, and sharing
                digital files. Misuse or illegal activity is prohibited.
              </li>
              <li>
                Users agree to pay applicable fees for premium services.
                Non-payment may result in suspended access.
              </li>
              <li>Refunds are governed by our Refund Policy above.</li>
              <li>
                StellarSync is not liable for indirect or incidental damages
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
