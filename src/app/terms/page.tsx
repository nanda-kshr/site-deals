import React from 'react';
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import * as motion from "framer-motion/client";
import Link from "next/link";

export default function TermsPage() {
    return (
        <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen py-10 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="md:max-w-4xl mx-[var(--content-margin)]"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block mb-2 py-1 px-4 bg-blue-600 text-white rounded-full text-sm font-medium"
                    >
                        LEGAL INFORMATION
                    </motion.span>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className={cn([
                            integralCF.className,
                            "text-3xl md:text-4xl lg:text-5xl mb-6",
                        ])}
                    >
                        TERMS & POLICIES
                    </motion.h1>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Terms and Conditions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200"
                    >
                        <h2 className={cn([
                            integralCF.className,
                            "text-xl md:text-2xl mb-6",
                        ])}>TERMS AND CONDITIONS</h2>
                        
                        <div className="space-y-6 text-gray-700">
                            <div>
                                <h3 className="font-bold text-lg mb-2">1. Introduction</h3>
                                <p>Welcome to Site Deals. These terms and conditions govern your use of our website and the purchase of products from our online store. By accessing our website or placing an order, you agree to be bound by these terms and conditions.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">2. Definitions</h3>
                                <p>"We", "our", "us", or "Site Deals" refers to the owner and operator of the website. "Website" refers to sitedeals.com or any associated domains. "You" refers to the user or viewer of our website and customer of our products.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">3. Order Acceptance</h3>
                                <p>All orders placed through our website are subject to acceptance and availability. We reserve the right to refuse any order without giving reason. Once we accept your order, we will send you an order confirmation email.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">4. Pricing and Payment</h3>
                                <p>All prices are shown in the applicable currency and are inclusive of VAT where applicable. We reserve the right to change prices at any time without notice. Payment must be made in full at the time of ordering. We accept various payment methods as indicated on our website.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">5. Shipping and Delivery</h3>
                                <p>We aim to dispatch all orders within 1-3 business days. Delivery times may vary depending on your location and other factors beyond our control. Shipping costs will be calculated and displayed at checkout.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">6. Product Information</h3>
                                <p>While we make every effort to display products accurately, we cannot guarantee that your computer's display will accurately reflect the actual product. We reserve the right to limit quantities, discontinue products, or alter specifications without notice.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">7. Intellectual Property</h3>
                                <p>All content on this website including text, graphics, logos, images, and software is the property of Site Deals and is protected by international copyright laws.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">8. Limitation of Liability</h3>
                                <p>To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">9. Governing Law</h3>
                                <p>These terms and conditions shall be governed by and construed in accordance with the laws of [Your Country], and any disputes will be subject to the exclusive jurisdiction of the courts of [Your Country].</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">10. Changes to Terms</h3>
                                <p>We reserve the right to update or modify these terms and conditions at any time without prior notice. Your continued use of the website following any changes indicates your acceptance of the new terms.</p>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Privacy Policy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200"
                    >
                        <h2 className={cn([
                            integralCF.className,
                            "text-xl md:text-2xl mb-6",
                        ])}>PRIVACY POLICY</h2>
                        
                        <div className="space-y-6 text-gray-700">
                            <div>
                                <h3 className="font-bold text-lg mb-2">1. Information We Collect</h3>
                                <p>We collect personal information that you voluntarily provide to us when you register on the website, place an order, subscribe to a newsletter, or contact us. This may include your name, email address, postal address, phone number, and payment information.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">2. How We Use Your Information</h3>
                                <p>We use your information to process transactions, send order confirmations, respond to inquiries, send marketing communications (if you've opted in), improve our website, and comply with legal obligations.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">3. Information Sharing</h3>
                                <p>We may share your information with third-party service providers who assist us in operating our website, conducting our business, or servicing you. These third parties are bound by confidentiality agreements and are not permitted to use your personal information for any purpose other than those specified by us.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">4. Cookies</h3>
                                <p>We use cookies to enhance your browsing experience, analyze website traffic, and personalize content. You can choose to disable cookies through your browser settings, but this may affect your ability to use certain features of our website.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">5. Data Security</h3>
                                <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">6. Your Rights</h3>
                                <p>You have the right to access, correct, or delete your personal information. You may also request a copy of the personal information we hold about you. To exercise these rights, please contact us at sitedeals999@gmail.com.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">7. Changes to Privacy Policy</h3>
                                <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Refund Policy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0, duration: 0.5 }}
                        className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200"
                    >
                        <h2 className={cn([
                            integralCF.className,
                            "text-xl md:text-2xl mb-6",
                        ])}>REFUND POLICY</h2>
                        
                        <div className="space-y-6 text-gray-700">
                            <div>
                                <h3 className="font-bold text-lg mb-2">1. Return Eligibility</h3>
                                <p>Products are eligible for return within 30 days of receipt, but only if explicitly stated as refundable on the product page or in your invoice. To qualify for a return, items must be unused, in their original condition, and include all packaging materials and attached tags.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">2. Return Process</h3>
                                <p>To initiate a return, please email us at sitedeals999@gmail.com with your order number and reason for return. We will provide you with instructions on how and where to send your package.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">3. Refunds</h3>
                                <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. If your return is approved, your refund will be processed to the original method of payment. Depending on your payment provider, refunds may take 5-10 business days to appear in your account.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">4. Return Shipping</h3>
                                <p>You are responsible for paying the shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">5. Damaged or Defective Items</h3>
                                <p>If you receive a damaged or defective item, please contact us immediately at sitedeals999@gmail.com with photos of the damage. We will work with you to resolve the issue promptly, which may include a replacement or refund.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">6. Non-Returnable Items</h3>
                                <p>Certain items cannot be returned, including personalized items, digital products, gift cards, and items marked as final sale. Please check product descriptions for specific return eligibility.</p>
                            </div>
                            
                            <div>
                                <h3 className="font-bold text-lg mb-2">7. Late or Missing Refunds</h3>
                                <p>If you haven't received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. If you've done all of this and you still have not received your refund, please contact us at sitedeals999@gmail.com.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
                
                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="mt-16 text-center bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 p-8 rounded-xl"
                >
                    <h3 className="text-xl font-bold mb-4">Have questions about our policies?</h3>
                    <p className="text-gray-600 mb-6 max-w-lg mx-[var(--content-margin)]">
                        Our customer support team is ready to assist you with any questions or concerns.
                    </p>
                    <Link
                        href="/contact"
                        className="group bg-amber-500 hover:bg-amber-600 transition-all text-white px-6 py-3 rounded-lg hover:shadow-md inline-flex items-center gap-2"
                        >
                        Contact Us 
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform transition-transform group-hover:translate-x-1">
                            <path d="m9 18 6-6-6-6"/>
                        </svg>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}