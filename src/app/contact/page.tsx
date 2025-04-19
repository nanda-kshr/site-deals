//app/contact/page.tsx
import React from 'react';
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";

import * as motion from "framer-motion/client";


export default function ContactPage() {
    return (
        <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto w-full"
            >
                {/* Header */}
                <div className="text-center mb-10">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block mb-2 py-1 px-4 bg-blue-600 text-white rounded-full text-sm font-medium"
                    >
                        GET IN TOUCH
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
                        CONTACT US
                    </motion.h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200"
                    >
                        <h2 className="text-xl font-bold mb-6">Contact Information</h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium">Name</h3>
                                    <p className="text-gray-600">Nandakishore Puthuparambil</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                        <polyline points="22,6 12,13 2,6"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium">Email</h3>
                                    <a href="mailto:sitedeals999@gmail.com" className="text-blue-600 hover:underline">sitedeals999@gmail.com</a>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-medium">Business Hours</h3>
                                    <p className="text-gray-600">Monday - Friday: 9AM - 5PM</p>
                                </div>
                            </div>
                        </div>
                        
                        
                        <div>
                            <h3 className="font-medium mb-4">Connect With Us</h3>
                            <div className="flex gap-4">
                                <a href="#" className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>
                                <a href="#" className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200"
                    >
                        <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
                        
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" 
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" 
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                                <input 
                                    type="text" 
                                    id="subject" 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" 
                                    placeholder="How can we help?"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                                <textarea 
                                    id="message" 
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none" 
                                    placeholder="Your message..."
                                    required
                                ></textarea>
                            </div>
                            
                            <button
                                type="submit"
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                Send Message
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </form>
                    </motion.div>
                </div>
                
                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.5 }}
                    className="mt-16"
                >
                    <h2 className={cn([
                        integralCF.className,
                        "text-2xl md:text-3xl mb-8 text-center",
                    ])}>FREQUENTLY ASKED QUESTIONS</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                question: "How can I track my order?",
                                answer: "You can track your order by logging into your account and visiting the order history section. There you'll find your tracking information."
                            },
                            {
                                question: "What is your return policy?",
                                answer: "We offer a 30-day return policy for most items. Please check the product page for specific return policy details."
                            },
                            {
                                question: "Do you ship internationally?",
                                answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary based on location."
                            },
                            {
                                question: "How do I report an issue with my order?",
                                answer: "Please contact our customer service team through the form above or email us directly at sitedeals999@gmail.com."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="font-bold mb-2">{faq.question}</h3>
                                <p className="text-gray-600">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
                
            </motion.div>
        </div>
    );
}