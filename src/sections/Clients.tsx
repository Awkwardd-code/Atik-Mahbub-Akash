'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import type { Variants, Transition } from 'framer-motion';

import AmbientCanvas3D from '../components/AmbientCanvas3D';
import { clientReviews } from '../constants';

const slideSpring: Transition = { type: 'spring', stiffness: 220, damping: 28 };

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
    scale: 0.85,
    rotateY: direction > 0 ? -12 : 12,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: slideSpring,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -400 : 400,
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? 12 : -12,
    transition: { ...slideSpring, duration: 0.5 },
  }),
};

const Clients = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const totalReviews = clientReviews.length;

  const handleSlide = (dir: 'next' | 'prev') => {
    const delta = dir === 'next' ? 1 : -1;
    setDirection(delta);
    setActiveIndex((prev) => (prev + delta + totalReviews) % totalReviews);
  };

  const goToSlide = (index: number) => {
    const delta = index > activeIndex ? 1 : -1;
    setDirection(delta);
    setActiveIndex(index);
  };

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-900 via-slate-900 to-blue-900/30 px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-12 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-1/3 -right-16 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <AmbientCanvas3D 
        particleCount={600}
        particleSpeed={0.03}
        particleOpacity={0.08}
        shapesCount={8}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Modern Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/20 mb-8"
          >
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="w-1.5 h-1.5 bg-linear-to-r from-violet-400 to-purple-400 rounded-full"
                />
              ))}
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm font-semibold bg-linear-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent"
            >
              Client Stories
            </motion.span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tight"
          >
            <span className="bg-linear-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent">
              Crafted Voices
            </span>
            <br />
            <span className="bg-linear-to-r from-blue-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              From Visionary Teams
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Hear how ambitious partners transformed lofty ideas into immersive realities through collaborative design,
            strategic thinking, and meticulous execution.
          </motion.p>
        </motion.div>

        {/* Enhanced Slider */}
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            style={{ perspective: 2000 }}
            className="relative"
          >
            {/* Main Slider Card */}
            <motion.div
              className="relative rounded-[40px] overflow-hidden"
              whileHover={{ rotateX: 2, rotateY: -2 }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Floating glow */}
              <motion.div
                className="absolute inset-0 rounded-[40px] bg-linear-to-r from-violet-500/20 via-purple-500/10 to-cyan-500/20 blur-3xl"
                animate={{ rotateY: [0, 8, 0], rotateX: [0, -6, 0] }}
                transition={{ duration: 14, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                style={{ transform: 'translateZ(-80px)' }}
              />

              {/* Glass Background */}
              <div className="absolute inset-0 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/30" />
              
              {/* Animated Border */}
              <div className="absolute inset-0 rounded-[40px] bg-linear-to-r from-violet-500/30 via-purple-500/30 to-fuchsia-500/30 opacity-0 hover:opacity-100 transition-opacity duration-500 p-px">
                <div className="w-full h-full bg-slate-950 rounded-[40px]" />
              </div>

              <div className="relative p-8 lg:p-12">
                <div className="relative h-[400px] lg:h-[350px] flex items-center" style={{ transformStyle: 'preserve-3d' }}>
                  <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                      key={clientReviews[activeIndex].id}
                      className="absolute inset-0 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                    >
                      {/* Content Side */}
                      <div className="flex-1 space-y-8">
                        {/* Quote */}
                        <div className="relative">
                          <div className="absolute -left-4 -top-4 text-6xl text-violet-400/20 font-serif">&ldquo;</div>
                          <p className="text-2xl lg:text-3xl text-slate-100 leading-relaxed font-light pl-8">
                            &ldquo;{clientReviews[activeIndex].review}&rdquo;
                          </p>
                        </div>

                        {/* Client Info */}
                        <div className="flex items-center gap-6">
                          <div className="relative">
                            <div className="absolute -inset-2 bg-linear-to-r from-violet-500 to-purple-500 rounded-full blur-lg opacity-60" />
                            <Image
                              src={clientReviews[activeIndex].img}
                              alt={clientReviews[activeIndex].name}
                              width={80}
                              height={80}
                              className="relative rounded-full border-2 border-white/20 shadow-2xl"
                            />
                          </div>
                          <div>
                            <p className="text-xl font-semibold text-white mb-1">
                              {clientReviews[activeIndex].name}
                            </p>
                            <p className="text-slate-400 font-light">
                              {clientReviews[activeIndex].position}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Rating Side */}
                      <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="text-center">
                          <div className="text-6xl font-bold bg-linear-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                            5.0
                          </div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <motion.span
                                key={i}
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.8 + i * 0.1 }}
                                className="inline-block h-5 w-5 rounded-sm bg-linear-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-500/30 rotate-12"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-8 px-4">
              {/* Dots Indicator */}
              <div className="flex items-center gap-3">
                {clientReviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`relative h-3 rounded-full transition-all duration-300 ${
                      index === activeIndex 
                        ? 'w-8 bg-linear-to-r from-violet-500 to-purple-500' 
                        : 'w-3 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              {/* Arrow Controls */}
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSlide('prev')}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:border-violet-400 hover:bg-violet-400/10 transition-all duration-300 shadow-lg"
                  aria-label="Previous testimonial"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 6L9 12L15 18" />
                  </svg>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSlide('next')}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:border-violet-400 hover:bg-violet-400/10 transition-all duration-300 shadow-lg"
                  aria-label="Next testimonial"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 6L15 12L9 18" />
                  </svg>
                </motion.button>
              </div>
            </div>

            {/* Slide Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-slate-300 text-sm"
            >
              <span className="font-semibold text-white">
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-slate-500">/</span>
              <span>{String(totalReviews).padStart(2, '0')}</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-24"
        >
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl hover:border-violet-400/30 transition-all duration-300 group">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur group-hover:blur-lg transition-all duration-300" />
              <div className="relative w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            </div>
            <span className="text-lg font-medium text-white">
              Available for new projects
            </span>
            <div className="w-px h-6 bg-white/20" />
            <span className="text-slate-400 group-hover:text-slate-300 transition-colors">
              Let&apos;s create something extraordinary
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Clients;
