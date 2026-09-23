import React from "react";
import Header from "../../_components/Header";
import Footer from "../../_components/Footer";

const sections = [
  { id: "refund-policy", label: "Refund Policy" },
  { id: "privacy-policy", label: "Privacy Policy" },
  { id: "terms", label: "Terms & Conditions" },
];

function Policies() {
  return (
    <>
      <Header />
      <main className="bg-white">
        {/* Intro */}
        <section className="border-b border-black/[0.06] bg-[#FBFAF7] pb-14 pt-32 sm:pb-16 sm:pt-40">
          <div className="mx-auto max-w-screen-xl px-5 sm:px-8">
            <span className="text-xs md:text-[13px] font-medium uppercase tracking-[0.14em] text-[#5056FD]">
              Legal
            </span>
            <h1 className="mt-5 font-serif text-4xl leading-[1.1] tracking-tight text-[#111827] sm:text-5xl">
              Legal &amp; policies
            </h1>
            <p className="mt-5 max-w-lg text-base md:text-lg leading-relaxed text-gray-500">
              Transparency matters. Here&rsquo;s everything you need to know
              about refunds, your data, and the terms of using StellarSync.
            </p>

            <nav
              aria-label="Sections on this page"
              className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3"
            >
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="group flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-[#111827]"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#5056FD]/30 transition-colors group-hover:bg-[#5056FD]" />
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* Body */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl px-5 sm:px-8">
            <div className="space-y-16">
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
              <div id="refund-policy" className="scroll-mt-24">
                <h2 className="font-serif text-2xl tracking-tight text-[#111827] sm:text-3xl">
                  Refund Policy
                </h2>
                <p className="mt-4 text-[15px] leading-relaxed text-gray-600">
                  Refunds apply only to duplicate payments, unauthorized
                  transactions, or undelivered services. Requests must be made
                  within <strong className="text-[#111827]">7 days</strong> of
                  the transaction at{" "}
                  <a
                    href="mailto:abdrzq.salihu@gmail.com"
                    className="text-[#5056FD] underline underline-offset-2 transition-colors hover:text-[#111827]"
                  >
                    abdrzq.salihu@gmail.com
                  </a>
                  . Approved refunds are processed within{" "}
                  <strong className="text-[#111827]">
                    7&ndash;14 business days
                  </strong>
                  . Transaction charges are non-refundable.
                </p>
              </div>

              {/* Privacy Policy */}
              <div id="privacy-policy" className="scroll-mt-24">
                <h2 className="font-serif text-2xl tracking-tight text-[#111827] sm:text-3xl">
                  Privacy Policy
                </h2>

                <div className="mt-6 space-y-6 text-[15px] leading-relaxed text-gray-600">
                  <p>
                    <strong className="text-[#111827]">Effective Date:</strong>{" "}
                    January 2026
                  </p>

                  <p>
                    StellarSync (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or
                    &ldquo;us&rdquo;) respects your privacy and is committed to
                    protecting the personal information of users who access or
                    use our file sharing and file management platform (the
                    &ldquo;Service&rdquo;).
                  </p>

                  <p>
                    This Privacy Policy explains what information we collect,
                    how we use it, and the choices you have regarding your
                    information.
                  </p>

                  <hr className="border-black/[0.06]" />

                  <h3 className="text-base font-semibold text-[#111827]">
                    1. Information We Collect
                  </h3>

                  <p className="!mt-2">
                    When you use StellarSync, we may collect the following types
                    of information:
                  </p>

                  <h4 className="text-sm font-semibold text-[#111827]">
                    a. Personal Information
                  </h4>
                  <p className="!mt-2">
                    We may collect personal details such as:
                  </p>
                  <ul className="ml-6 list-disc space-y-1.5">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Billing or payment-related details</li>
                  </ul>

                  <h4 className="text-sm font-semibold text-[#111827]">
                    b. Uploaded Content
                  </h4>
                  <p className="!mt-2">
                    As a file storage and sharing platform, we collect and store
                    files and content that you voluntarily upload, including:
                  </p>
                  <ul className="ml-6 list-disc space-y-1.5">
                    <li>Documents, images, and other files</li>
                    <li>File metadata (file name, size, type)</li>
                  </ul>

                  <h4 className="text-sm font-semibold text-[#111827]">
                    c. Usage and Technical Information
                  </h4>
                  <p className="!mt-2">
                    We may automatically collect certain technical data,
                    including:
                  </p>
                  <ul className="ml-6 list-disc space-y-1.5">
                    <li>IP address</li>
                    <li>Browser type and device information</li>
                    <li>Log data (pages visited, access times)</li>
                    <li>Cookies and similar tracking technologies</li>
                  </ul>

                  <hr className="border-black/[0.06]" />

                  <h3 className="text-base font-semibold text-[#111827]">
                    2. How We Use Your Information
                  </h3>

                  <p className="!mt-2">We use collected information to:</p>
                  <ul className="ml-6 list-disc space-y-1.5">
                    <li>Provide and maintain the Service</li>
                    <li>Allow users upload, store, and share files securely</li>
                    <li>
                      Process payments for premium features (if applicable)
                    </li>
                    <li>Communicate important updates or support responses</li>
                    <li>Prevent fraud, abuse, or unauthorized activity</li>
                    <li>Improve platform performance and user experience</li>
                  </ul>

                  <hr className="border-black/[0.06]" />

                  <h3 className="text-base font-semibold text-[#111827]">
                    3. Payment Processing
                  </h3>

                  <p className="!mt-2">
                    Payments on StellarSync are processed through third-party
                    payment providers such as{" "}
                    <strong className="text-[#111827]">Flutterwave</strong>.
                  </p>

                  <p className="!mt-1">
                    StellarSync does not store sensitive card details directly.
                    Payment providers handle transactions securely in accordance
                    with their compliance standards.
                  </p>

                  <hr className="border-black/[0.06]" />

                  <h3 className="text-base font-semibold text-[#111827]">
                    4. Sharing of Information
                  </h3>

                  <p className="!mt-2">
                    We do <strong className="text-[#111827]">not</strong> sell
                    or rent your personal information.
                  </p>

                  <p className="!mt-1">
                    We may share information only in the following cases:
                  </p>
                  <ul className="ml-6 list-disc space-y-1.5">
                    <li>
                      With service providers necessary to operate the platform
                      (e.g., payment processors, hosting services)
                    </li>
                    <li>To comply with legal obligations or lawful requests</li>
                    <li>
                      To protect the rights, safety, and security of StellarSync
                      and its users
                    </li>
                  </ul>

                  <hr className="border-black/[0.06]" />

                  <h3 className="text-base font-semibold text-[#111827]">
                    5. Data Storage and Security
                  </h3>

                  <p className="!mt-2">
                    We implement industry-standard security measures to protect
                    user data, including:
                  </p>
                  <ul className="ml-6 list-disc space-y-1.5">
                    <li>Secure authentication</li>
                    <li>Encrypted connections (HTTPS)</li>
                    <li>Access controls for stored files</li>
                  </ul>

                  <p>
                    However, no system can be 100% secure, and users are
                    responsible for safeguarding their login credentials.
                  </p>

                  <hr className="border-black/[0.06]" />

                  <h3 className="text-base font-semibold text-[#111827]">
                    6. Data Retention
                  </h3>

                  <p className="!mt-2">
                    We retain personal information and uploaded files only as
                    long as necessary to provide the Service or meet legal and
                    operational requirements.
                  </p>

                  <p className="!mt-2">
                    Users may request deletion of their data by contacting us.
                  </p>

                  <hr className="border-black/[0.06]" />

                  <h3 className="text-base font-semibold text-[#111827]">
                    7. User Rights
                  </h3>

                  <p className="!mt-2">You have the right to:</p>
                  <ul className="ml-6 list-disc space-y-1.5">
                    <li>Access or update your account information</li>
                    <li>Request deletion of your personal data</li>
                    <li>Withdraw consent where applicable</li>
                  </ul>

                  <p>
                    To make such requests, contact us using the details below.
                  </p>

                  <hr className="border-black/[0.06]" />

                  <h3 className="text-base font-semibold text-[#111827]">
                    8. Children&rsquo;s Privacy
                  </h3>

                  <p className="!mt-2">
                    StellarSync is not intended for children under the age of
                    13. We do not knowingly collect personal information from
                    children.
                  </p>

                  <hr className="border-black/[0.06]" />

                  <h3 className="text-base font-semibold text-[#111827]">
                    9. Cookies
                  </h3>

                  <p className="!mt-2">
                    We may use cookies or similar technologies to:
                  </p>
                  <ul className="ml-6 list-disc space-y-1.5">
                    <li>Maintain user sessions</li>
                    <li>Improve platform performance</li>
                    <li>Analyze usage trends</li>
                  </ul>

                  <p>
                    You may disable cookies through your browser settings,
                    though some features may not function properly.
                  </p>

                  <hr className="border-black/[0.06]" />

                  <h3 className="text-base font-semibold text-[#111827]">
                    10. Changes to This Policy
                  </h3>

                  <p className="!mt-2">
                    We may update this Privacy Policy from time to time.
                    Continued use of the Service after updates means you accept
                    the revised policy.
                  </p>

                  <hr className="border-black/[0.06]" />

                  <h3 className="text-base font-semibold text-[#111827]">
                    11. Contact Information
                  </h3>

                  <p className="!mt-2">
                    If you have any questions about this Privacy Policy, please
                    contact:
                  </p>

                  <p>
                    <strong className="text-[#111827]">StellarSync</strong>
                    <br />
                    {/* <strong className="text-[#111827]">Address:</strong> BHND TRUTH AND TRUST ACADE */}
                    {/* <br /> */}
                    <strong className="text-[#111827]">Phone:</strong> +234 808
                    545 8632
                    <br />
                    <strong className="text-[#111827]">Email:</strong>{" "}
                    <a
                      href="mailto:abdrzq.salihu@gmail.com"
                      className="text-[#5056FD] underline underline-offset-2 transition-colors hover:text-[#111827]"
                    >
                      abdrzq.salihu@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              {/* Terms & Conditions */}
              <div id="terms" className="scroll-mt-24">
                <h2 className="font-serif text-2xl tracking-tight text-[#111827] sm:text-3xl">
                  Terms &amp; Conditions
                </h2>
                <ol className="ml-6 mt-6 list-decimal space-y-2.5 text-[15px] leading-relaxed text-gray-600">
                  <li>You must be at least 12 years old to use StellarSync.</li>
                  <li>
                    StellarSync provides tools for uploading, managing, and
                    sharing digital files. Misuse or illegal activity is
                    prohibited.
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
                    Terms may be updated anytime. Continued use means acceptance
                    of the new terms.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Policies;
