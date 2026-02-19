import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-gray pt-section px-4 pb-8">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8">
        <div>
          <h3 className="text-h3 text-white mb-4">
            Medi<span className="text-secondary">Code</span>
          </h3>
          <p className="text-sm-text leading-[1.8]">
            Bridging the gap between medical education and technology.
            Learn from industry experts at your own pace.
          </p>
        </div>

        <div>
          <h4 className="text-white text-body font-bold mb-4">Quick Links</h4>
          <Link href="/" className="block text-sm-text py-1 transition-colors duration-200 hover:text-white">Home</Link>
          <Link href="/courses" className="block text-sm-text py-1 transition-colors duration-200 hover:text-white">All Courses</Link>
          <Link href="/about" className="block text-sm-text py-1 transition-colors duration-200 hover:text-white">About Us</Link>
          <Link href="/blogs" className="block text-sm-text py-1 transition-colors duration-200 hover:text-white">Blog</Link>
        </div>

        <div>
          <h4 className="text-white text-body font-bold mb-4">Categories</h4>
          <Link href="/courses" className="block text-sm-text py-1 transition-colors duration-200 hover:text-white">Medical Sciences</Link>
          <Link href="/courses" className="block text-sm-text py-1 transition-colors duration-200 hover:text-white">Computer Science</Link>
          <Link href="/quiz" className="block text-sm-text py-1 transition-colors duration-200 hover:text-white">Practice Quizzes</Link>
        </div>

        <div>
          <h4 className="text-white text-body font-bold mb-4">Support</h4>
          <Link href="/about" className="block text-sm-text py-1 transition-colors duration-200 hover:text-white">Contact Us</Link>
          <Link href="/about" className="block text-sm-text py-1 transition-colors duration-200 hover:text-white">FAQ</Link>
          <Link href="/about" className="block text-sm-text py-1 transition-colors duration-200 hover:text-white">Privacy Policy</Link>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto mt-8 pt-8 border-t border-dark-gray text-center text-sm-text">
        &copy; {new Date().getFullYear()} MediCode Institute. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
