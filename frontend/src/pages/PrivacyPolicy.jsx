import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen px-4 py-10">
            <div className="max-w-2xl mx-auto glass-modal p-8 md:p-10 rounded-3xl space-y-8 animate-scale-in">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 shrink-0 bg-accent-gradient rounded-2xl flex items-center justify-center shadow-glow-teal">
                        <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Privacy Policy</h1>
                        <p className="text-gray-500 mt-1 font-medium">Heritage Slabs ERP</p>
                        <p className="text-sm text-gray-400 mt-2">Last updated: April 17, 2026</p>
                    </div>
                </div>

                <div className="text-gray-700 space-y-6 text-sm leading-relaxed">
                    <p>
                        This policy describes what personal information we collect in the Heritage Slabs ERP system,
                        how we use it, and what you should know before you create an account or use features such as
                        ordering or the room visualizer.
                    </p>

                    <section>
                        <h2 className="text-base font-bold text-gray-900">1. Account and identity</h2>
                        <p className="mt-2">
                            When you register, we collect your <strong>full name</strong>, <strong>email address</strong>,
                            and a <strong>password</strong> (stored in encrypted form). We use these details to authenticate
                            you, manage your role in the system, and communicate about your account and orders where
                            applicable.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-gray-900">2. Profile photo (avatar)</h2>
                        <p className="mt-2">
                            If you upload a <strong>profile picture</strong>, we store the image file on our application
                            servers and save a link to it on your user profile. Only use photos you are allowed to share.
                            Avoid uploading images that contain sensitive personal data of other people without their consent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-gray-900">3. Orders and delivery</h2>
                        <p className="mt-2">
                            When you place an order, we collect information needed to fulfil delivery and contact you,
                            including <strong>delivery address</strong>, <strong>city</strong>, <strong>province</strong>,
                            <strong>postal code</strong>, <strong>phone number</strong>, <strong>contact email</strong>,
                            optional <strong>delivery preferences</strong> (such as preferred delivery date), and any{' '}
                            <strong>order notes</strong> you choose to provide. This data is used to process and ship your
                            order and may be visible to authorised staff and logistics workflows within the system.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-gray-900">4. Room photos and AI visualization</h2>
                        <p className="mt-2">
                            The product catalog includes an optional <strong>room visualizer</strong>. If you use it, you
                            upload a <strong>photo of your room</strong>. That image is sent, together with the selected
                            product texture image, to our separate <strong>AI visualization service</strong> so a preview
                            can be generated. Processing may involve third-party AI providers configured for that service.
                        </p>
                        <p className="mt-2">
                            <strong>Important:</strong> Room photos may show private spaces, people, or belongings. Only
                            upload images you are comfortable sharing for this purpose. Do not upload unlawful content or
                            images of others without permission. Generated previews are returned for display in your
                            browser; we do not use your room photos for unrelated marketing unless we tell you otherwise
                            in a future update to this policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-gray-900">5. Reviews and support</h2>
                        <p className="mt-2">
                            If you submit <strong>reviews</strong> or <strong>support tickets</strong>, we store the
                            content you provide and associate it with your account so we can display or respond to it as
                            designed in the application.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-gray-900">6. Security and retention</h2>
                        <p className="mt-2">
                            We use reasonable technical and organisational measures to protect data in line with how the
                            system is operated. Retention periods depend on business and legal needs (for example, keeping
                            order records for accounting and fulfilment). Contact the organisation operating this deployment
                            if you need access, correction, or deletion requests subject to applicable law.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-bold text-gray-900">7. Acceptance</h2>
                        <p className="mt-2">
                            By creating an account and ticking the acceptance box at registration, you confirm that you have
                            read and understood this policy and agree to the collection and use of information as
                            described here.
                        </p>
                    </section>
                </div>

                <Link
                    to="/register"
                    className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-accent-dark transition-colors"
                >
                    <ArrowLeft size={18} />
                    Back to registration
                </Link>
            </div>
        </div>
    );
}
