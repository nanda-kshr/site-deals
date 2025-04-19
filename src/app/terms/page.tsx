import React from 'react';
import { integralCF } from "@/styles/fonts";
import { cn } from "@/lib/utils";
import * as motion from "framer-motion/client";
import Link from "next/link";
import { privacyPolicy, refundPolicy, termsAndConditions } from '@/lib/constants';

export default function TermsPage() {
    return (
        <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen py-10 px-4">
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8"
            >
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
                            {termsAndConditions.map((term, index) => (
                                <div key={index}>
                                    <h3 className="font-bold text-lg mb-2">{term.title}</h3>
                                    <p>{term.content}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                    
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
                            {privacyPolicy.map((policy, index) => (
                                    <div key={index}>
                                            <h3 className="font-bold text-lg mb-2">{policy.title}</h3>
                                            <p>{policy.content}</p>
                                    </div>
                            ))}
                        </div>
                    </motion.div>
                    
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
                            {refundPolicy.map((policy, index) => (
                                <div key={index}>
                                    <h3 className="font-bold text-lg mb-2">{policy.title}</h3>
                                    <p>{policy.content}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
                
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