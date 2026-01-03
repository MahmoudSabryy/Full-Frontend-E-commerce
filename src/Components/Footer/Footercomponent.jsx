import React, { Component } from "react";

export default class Footercomponent extends Component {
  render() {
    return (
      <>
        <footer className="bg-[#0B0F1A] border-t border-white/10 py-8">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-gray-400">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">E.Shop</h3>
              <p className="text-sm">
                Premium shopping experience with secure payments.
              </p>
            </div>

            <div>
              <h4 className="text-white mb-2 text-sm font-semibold">
                Quick Links
              </h4>
              <ul className="space-y-1 text-sm">
                <li>Products</li>
                <li>Categories</li>
                <li>Wishlist</li>
                <li>Cart</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-2 text-sm font-semibold">Support</h4>
              <ul className="space-y-1 text-sm">
                <li>Contact</li>
                <li>Orders</li>
                <li>Returns</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white mb-2 text-sm font-semibold">
                Follow Us
              </h4>
              <p className="text-sm">Instagram · Twitter · LinkedIn</p>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-6 text-xs">
            © 2025 E.Shop — All rights reserved
          </p>
        </footer>
      </>
    );
  }
}
