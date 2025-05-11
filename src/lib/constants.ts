import { Review } from "@/types/review.types";


export const placeholderImage = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s"


export const newarrivals = `/api/v1/products/arrivals`;
export const bestsellers = `/api/v1/products/best-sellers`;
export const getimage = '/api/v1/image/';
export const gotoproduct = '/shop/product/';
export const getproducts = '/api/v1/products';
export const getproduct = '/api/v1/product';
export const searchproducts = '/api/v1/products/search';
export const trackorder = "/api/v1/order/track";

export const categories = [
  { name: "All", value: null },
  { name: "Electronics", value: "electronics" },
  { name: "Home & Kitchen", value: "home-kitchen" },
  { name: "Toys & Games", value: "toys-games" },
  { name: "Books & Media", value: "books-media" },
];


export const reviewsData: Review[] = [
  {
    id: 1,
    user: "Alex K.",
    content:
      '"Finding clothes that align with my personal style used to be a challenge until I discovered SiteDeals.store. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.”',
    rating: 5,
    date: "August 14, 2023",
  },
  {
    id: 2,
    user: "Sarah M.",
    content:
      `"I'm blown away by the quality and style of the clothes I received from SiteDeals.store. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.”`,
    rating: 5,
    date: "August 15, 2023",
  },
  {
    id: 3,
    user: "Ethan R.",
    content:
      `"This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt."`,
    rating: 5,
    date: "August 16, 2023",
  },
  {
    id: 4,
    user: "Olivia P.",
    content:
      `"As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out."`,
    rating: 5,
    date: "August 17, 2023",
  },
  {
    id: 5,
    user: "Liam K.",
    content:
      `"This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of art that reflects my passion for both design and fashion."`,
    rating: 5,
    date: "August 18, 2023",
  },
  {
    id: 6,
    user: "Samantha D.",
    content:
      `"I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt."`,
    rating: 5,
    date: "August 19, 2023",
  },
];


export const termsAndConditions = [
  {
      title: "1. Introduction",
      content: "Welcome to Site Deals. These terms and conditions govern your use of our website and the purchase of products from our online store. By accessing our website or placing an order, you agree to be bound by these terms and conditions."
  },
  {
      title: "2. Definitions",
      content: "\"We\", \"our\", \"us\", or \"Site Deals\" refers to the owner and operator of the website. \"Website\" refers to sitedeals.com or any associated domains. \"You\" refers to the user or viewer of our website and customer of our products."
  },
  {
      title: "3. Order Acceptance",
      content: "All orders placed through our website are subject to acceptance and availability. We reserve the right to refuse any order. Once we accept your order, we will send you an order confirmation email."
  },
  {
      title: "4. Pricing and Payment",
      content: "All prices are shown in the applicable currency and are inclusive of VAT where applicable. We reserve the right to change prices at any time without notice. Payment must be made in full at the time of ordering. We accept various payment methods as indicated on our website."
  },
  {
      title: "5. Shipping and Delivery",
      content: "We aim to dispatch all orders within 1-3 business days. Delivery times may vary depending on your location and other factors beyond our control. Shipping costs will be calculated and displayed at checkout."
  },
  {
      title: "6. Product Information",
      content: "While we make every effort to display products accurately, we cannot guarantee that your computer's display will accurately reflect the actual product. We reserve the right to limit quantities, discontinue products, or alter specifications without notice."
  },
  {
      title: "7. Intellectual Property",
      content: "All content on this website including text, graphics, logos, images, and software is the property of Site Deals and is protected by international copyright laws."
  },
  {
      title: "8. Limitation of Liability",
      content: "To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses."
  },
  {
      title: "9. Governing Law",
      content: "These terms and conditions shall be governed by and construed in accordance with the laws of the India, and any disputes will be subject to the exclusive jurisdiction of the courts of the India."
  },
  {
      title: "10. Changes to Terms",
      content: "We reserve the right to update or modify these terms and conditions at any time without prior notice. Your continued use of the website following any changes indicates your acceptance of the new terms."
  }
];

export const privacyPolicy = [
  {
      title: "1. Information We Collect",
      content: "We collect personal information that you voluntarily provide to us when you register on the website, place an order, subscribe to a newsletter, or contact us. This may include your name, email address, postal address, phone number, and payment information."
  },
  {
      title: "2. How We Use Your Information",
      content: "We use your information to process transactions, send order confirmations, respond to inquiries, send marketing communications (if you've opted in), improve our website, and comply with legal obligations."
  },
  {
      title: "3. Information Sharing",
      content: "We may share your information with third-party service providers who assist us in operating our website, conducting our business, or servicing you. These third parties are bound by confidentiality agreements and are not permitted to use your personal information for any purpose other than those specified by us."
  },
  {
      title: "4. Cookies",
      content: "We use cookies to enhance your browsing experience, analyze website traffic, and personalize content. You can choose to disable cookies through your browser settings, but this may affect your ability to use certain features of our website."
  },
  {
      title: "5. Data Security",
      content: "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
  },
  {
      title: "6. Your Rights",
      content: "You have the right to access, correct, or delete your personal information. You may also request a copy of the personal information we hold about you. To exercise these rights, please contact us at sitedeals999@gmail.com."
  },
  {
      title: "7. Changes to Privacy Policy",
      content: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last Updated\" date."
  }
];

export const refundPolicy = [
  {
      title: "1. Return Eligibility",
      content: "Products are eligible for return within 30 days of receipt, but only if explicitly stated as refundable on the product page or in your invoice. To qualify for a return, items must be unused, in their original condition, and include all packaging materials and attached tags."
  },
  {
      title: "2. Return Process",
      content: "To initiate a return, please email us at sitedeals999@gmail.com with your order number and reason for return. We will provide you with instructions on how and where to send your package."
  },
  {
      title: "3. Refunds",
      content: "Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. If your return is approved, your refund will be processed to the original method of payment. Depending on your payment provider, refunds may take 5-10 business days to appear in your account."
  },
  {
      title: "4. Return Shipping",
      content: "You are responsible for paying the shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund."
  },
  {
      title: "5. Damaged or Defective Items",
      content: "If you receive a damaged or defective item, please contact us immediately at sitedeals999@gmail.com with photos of the damage. We will work with you to resolve the issue promptly, which may include a replacement or refund."
  },
  {
      title: "6. Non-Returnable Items",
      content: "Certain items cannot be returned, including personalized items, digital products, gift cards, and items marked as final sale. Please check product descriptions for specific return eligibility."
  },
  {
      title: "7. Late or Missing Refunds",
      content: "If you haven't received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. If you've done all of this and you still have not received your refund, please contact us at sitedeals999@gmail.com."
  }
];
