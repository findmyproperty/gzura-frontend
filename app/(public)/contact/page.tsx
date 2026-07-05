'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import ContactForm from '@/components/forms/ContactForm';

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-bg pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2Mmgydi0yem0tMTAgMGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat" />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <MessageSquare className="w-4 h-4 text-gold-400" />
              <span className="text-gold-400 text-sm font-semibold">
                Get in Touch
              </span>
            </div>
            <h1 className="heading-xl text-white mb-6">
              Contact <span className="text-gold-400">Us</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Have questions? We would love to hear from you. Send us a message
              and we will respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="heading-md text-gray-900 mb-8">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-deep to-purple-700 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Email Us</p>
                    <a
                      href="mailto:hello@gzura.com"
                      className="text-gray-900 font-medium hover:text-purple-700 transition-colors"
                    >
                      hello@gzura.com
                    </a>
                    <p className="text-gray-500 text-sm mt-1">
                      support@gzura.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-deep to-purple-700 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Call Us</p>
                    <a
                      href="tel:+1234567890"
                      className="text-gray-900 font-medium hover:text-purple-700 transition-colors"
                    >
                      +1 (234) 567-890
                    </a>
                    <p className="text-gray-500 text-sm mt-1">
                      Mon-Fri, 9am-6pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-deep to-purple-700 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Visit Us</p>
                    <p className="text-gray-900 font-medium">
                      123 Innovation Drive
                    </p>
                    <p className="text-gray-500">Suite 100</p>
                    <p className="text-gray-500">New York, NY 10001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-deep to-purple-700 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Office Hours</p>
                    <p className="text-gray-900 font-medium">
                      Monday - Friday
                    </p>
                    <p className="text-gray-500">9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-10 pt-8 border-t border-gray-200">
                <p className="text-gray-500 text-sm mb-4">Follow Us</p>
                <div className="flex gap-3">
                  {['facebook', 'twitter', 'instagram', 'linkedin'].map(
                    (social) => (
                      <a
                        key={social}
                        href="#"
                        className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center hover:bg-purple-deep hover:text-white text-purple-700 transition-all"
                      >
                        <span className="text-xs font-bold uppercase">
                          {social[0]}
                        </span>
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-8 md:p-10">
                <h2 className="heading-md text-gray-900 mb-6">
                  Send Us a Message
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-96 bg-gray-200 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-deep/90 to-purple-900/90 flex items-center justify-center">
          <div className="text-center text-white">
            <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg opacity-75">Map integration coming soon</p>
            <p className="text-white/60">123 Innovation Drive, Suite 100, New York, NY</p>
          </div>
        </div>
      </section>
    </>
  );
}
