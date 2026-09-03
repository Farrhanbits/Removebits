import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How does Removebits guarantee 100% original image resolution?',
      a: 'Unlike traditional web tools that downsample images upon upload, Removebits retains your exact raw pixel canvas matrix locally in your browser memory. When exporting, the file is rendered using lossless PNG or uncompressed JPEG (quality 1.0) at the identical original dimensions.',
    },
    {
      q: 'Can I remove small logos, watermarks, as well as large photobombers?',
      a: 'Yes. Our brush size ranges from 2px (ideal for micro watermarks, timestamps, dust specks, and text) up to 120px+ (ideal for erasing tourists, vehicles, power lines, and unwanted background furniture).',
    },
    {
      q: 'Are my personal photos uploaded to external cloud servers?',
      a: 'No. Removebits operates 100% client-side inside your web browser. Your images never leave your computer, laptop, or phone, guaranteeing absolute privacy for sensitive or corporate photos.',
    },
    {
      q: 'What file formats and image resolutions are supported?',
      a: 'We support all standard web and photography formats including JPG, PNG, WEBP, and TIFF. You can process images from small web assets up to 4K and 8K camera files.',
    },
    {
      q: 'How does the background reconstruction look so natural?',
      a: 'Our inpainting engine utilizes BRIA AI content-aware exemplar synthesis. Rather than blurring the region, it analyzes neighboring textures (waves, sand, bricks, foliage) and propagates them inward with natural edge diffusion.',
    },
    {
      q: 'How do I download my edited photos?',
      a: 'Click the Download button in the Studio Editor. You can choose Lossless PNG or Full-Quality JPG. The file downloads directly to your machine instantly with zero queue time.',
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <ScrollReveal>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171322] border border-white/10 text-[11px] font-semibold text-zinc-300 tracking-wider uppercase mb-4">
              <HelpCircle className="w-3.5 h-3.5 text-[#C084FC]" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Everything you need to know about quality preservation, brush controls, and privacy.
            </p>
          </div>
        </ScrollReveal>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <ScrollReveal key={idx} delay={idx * 60}>
                <div className="bg-[#130f1c]/70 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden transition-all duration-200 hover:border-white/20">
                  <button
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-bold text-white text-base sm:text-lg">
                      {faq.q}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-zinc-300 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-[#A855F7]/20 text-white border-[#A855F7]/40' : ''
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
