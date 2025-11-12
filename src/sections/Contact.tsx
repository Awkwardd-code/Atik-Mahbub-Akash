
'use client';

import emailjs from '@emailjs/browser';
import { useRef, useState, Suspense, useMemo } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Float, Environment, OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';
import ContactForm3D from '../components/ContactForm3D';
import Particles from '../components/Particles';
import CanvasLoader from '../components/Loading';

type ContactFormState = {
  name: string;
  email: string;
  message: string;
};

const emailConfig = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '',
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '',
};

interface ContactSceneProps {
  focusedField: string | null;
  isHovered: boolean;
}

const ContactScene = ({ focusedField, isHovered }: ContactSceneProps) => {
  const accentColor = focusedField ? '#8b5cf6' : '#38bdf8';
  const orbitNodes = useMemo(
    () =>
      Array.from({ length: 8 }, (_, index) => ({
        angle: (index / 8) * Math.PI * 2,
        radius: 7.5 + Math.random() * 0.6,
        height: index % 2 === 0 ? 1.2 : -1.2,
        hue: 190 + Math.random() * 40,
      })),
    [],
  );

  return (
    <group>
      {/* Base platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, 0]}>
        <cylinderGeometry args={[7, 7, 0.5, 64]} />
        <meshStandardMaterial color="#0f172a" metalness={0.2} roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.2, 0]}>
        <ringGeometry args={[5, 6.5, 64]} />
        <meshStandardMaterial
          color={accentColor}
          transparent
          opacity={0.25}
          emissive={accentColor}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Glowing shafts */}
      {[-2.5, 2.5].map((x) => (
        <mesh key={`beam-${x}`} position={[x, -1, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 6, 32]} />
          <meshStandardMaterial
            color={accentColor}
            transparent
            opacity={0.15}
            emissive={accentColor}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}

      {/* Orbiting rings */}
      {[0.3, 1.1].map((height, idx) => (
        <mesh key={`ring-${idx}`} rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
          <torusGeometry args={[6 + height * 0.5, 0.06, 16, 96]} />
          <meshStandardMaterial
            color={accentColor}
            transparent
            opacity={0.35}
            emissive={accentColor}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Floating contact form */}
      <Float speed={isHovered ? 2 : 1.4} rotationIntensity={isHovered ? 0.5 : 0.3} floatIntensity={0.6}>
        <ContactForm3D focusedField={focusedField} />
      </Float>

      {/* Orbiting nodes */}
      {orbitNodes.map(({ angle, radius, height, hue }, index) => (
        <Float key={`node-${index}`} speed={1.2} rotationIntensity={0.4} floatIntensity={0.5}>
          <mesh position={[Math.cos(angle) * radius, height, Math.sin(angle) * radius]}>
            <sphereGeometry args={[0.35, 24, 24]} />
            <meshStandardMaterial
              color={`hsl(${hue}, 70%, 60%)`}
              transparent
              opacity={0.85}
              emissive={`hsl(${hue}, 70%, 30%)`}
              emissiveIntensity={0.4}
            />
          </mesh>
        </Float>
      ))}

      {/* Data arcs */}
      {[0, Math.PI / 2].map((rotation, idx) => (
        <Float key={`arc-${idx}`} speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <mesh rotation={[Math.PI / 2, rotation, 0]} position={[0, 0.2, 0]}>
            <torusGeometry args={[4.5, 0.03, 12, 120, Math.PI * 1.3]} />
            <meshStandardMaterial
              color="#f472b6"
              transparent
              opacity={0.25}
              emissive="#f472b6"
              emissiveIntensity={0.15}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const Contact = () => {
  const formRef = useRef<HTMLFormElement | null>(null);
  const { alert, showAlert, hideAlert } = useAlert();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ContactFormState>({ name: '', email: '', message: '' });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailConfig.serviceId || !emailConfig.templateId || !emailConfig.publicKey) {
      showAlert({ text: 'Email service is not configured yet. Please try again later.' });
      return;
    }

    setLoading(true);

    try {
      await emailjs.send(
        emailConfig.serviceId,
        emailConfig.templateId,
        {
          from_name: form.name,
          to_name: 'Your Name',
          from_email: form.email,
          to_email: 'your@email.com',
          message: form.message,
        },
        emailConfig.publicKey,
      );

      setLoading(false);
      showAlert({ text: 'Thank you for your message! I will get back to you soon.', type: 'success' });
      setTimeout(() => hideAlert(), 5000);
      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setLoading(false);
      console.error(error);
      showAlert({ text: 'I didn&apos;t receive your message. Please try again.', type: 'danger' });
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-900 via-slate-900 to-blue-900/30" id="contact">
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
          >
            <Alert {...alert} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-linear-to-r from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-linear-to-r from-cyan-400/10 to-indigo-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 16 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl shadow-black/20 mb-8"
          >
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="w-2 h-2 bg-linear-to-r from-violet-400 to-purple-400 rounded-full"
                />
              ))}
            </div>
            <span className="text-sm font-semibold bg-linear-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent">
              Let&apos;s Connect
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-linear-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent">
              Let&apos;s Create
            </span>
            <br />
            <span className="bg-linear-to-r from-blue-600 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              Something Amazing
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Ready to bring your vision to life? Let&apos;s discuss your project and craft an exceptional digital experience together.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          {/* 3D Canvas Section */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-full min-h-[520px]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative h-full min-h-[520px] rounded-4xl overflow-hidden group">
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-4xl shadow-[0_35px_80px_rgba(15,23,42,0.65)]" />
              <Canvas className="absolute inset-4 rounded-3xl" shadows>
                <Suspense fallback={<CanvasLoader />}>
                  <PerspectiveCamera makeDefault position={[0, 2, 16]} fov={50} />
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[12, 14, 6]} intensity={0.9} castShadow shadow-mapSize={[2048, 2048]} />
                  <pointLight position={[-10, -8, 12]} intensity={0.5} color="#8b5cf6" />
                  <pointLight position={[6, 2, -6]} intensity={0.35} color="#06b6d4" />
                  <Environment preset="dawn" />
                  <Particles count={900} speed={0.12} opacity={0.12} size={1} color="#7dd3fc" />
                  <ContactScene focusedField={focusedField} isHovered={isHovered} />
                  <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    autoRotate={!isHovered}
                    autoRotateSpeed={1.5}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 5}
                  />
                </Suspense>
              </Canvas>
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-white/70 via-transparent to-transparent dark:from-slate-950/60 rounded-4xl" />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute bottom-6 left-6 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-white/10 shadow-lg"
              >
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Interactive 3D Workspace
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-full min-h-[520px]"
          >
            {/* Glass Form Container */}
            <div className="relative h-full rounded-3xl p-8 lg:p-10 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-black/10 flex flex-col">
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-16 h-16 bg-linear-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl" />
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-linear-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-lg" />
              
              <div className="relative space-y-2 mb-8">
                <h3 className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-slate-800 to-slate-600 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  Start Your Project
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Fill out the form and I&apos;ll get back to you within 24 hours
                </p>
              </div>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 flex-1">
                {[
                  {
                    label: 'Full Name',
                    name: 'name',
                    type: 'text',
                    placeholder: 'Enter your full name',
                    icon: '👤'
                  },
                  {
                    label: 'Email Address',
                    name: 'email',
                    type: 'email',
                    placeholder: 'your@email.com',
                    icon: '📧'
                  },
                  {
                    label: 'Project Details',
                    name: 'message',
                    type: 'textarea',
                    placeholder: 'Tell me about your project, timeline, and goals...',
                    icon: '💭'
                  }
                ].map((field, index) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="relative"
                  >
                    <label className="block space-y-3">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span>{field.icon}</span>
                        {field.label}
                      </span>
                      {field.type === 'textarea' ? (
                        <textarea
                          name={field.name}
                          value={form[field.name as keyof ContactFormState]}
                          onChange={handleChange}
                          onFocus={() => handleFocus(field.name)}
                          onBlur={handleBlur}
                          required
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none backdrop-blur-sm"
                          placeholder={field.placeholder}
                        />
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={form[field.name as keyof ContactFormState]}
                          onChange={handleChange}
                          onFocus={() => handleFocus(field.name)}
                          onBlur={handleBlur}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 backdrop-blur-sm"
                          placeholder={field.placeholder}
                        />
                      )}
                    </label>
                  </motion.div>
                ))}

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-purple-600 group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300" />
                  
                  {/* Content */}
                  <span className="relative z-10">{loading ? 'Sending...' : 'Send Message'}</span>
                  <motion.div
                    animate={loading ? { rotate: 360 } : { rotate: 0 }}
                    transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                    className="relative z-10 w-5 h-5"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      <Image
                        src="/assets/arrow-up.png"
                        alt="arrow-up"
                        width={20}
                        height={20}
                        className="group-hover:-translate-y-0.5 transition-transform duration-300"
                      />
                    )}
                  </motion.div>
                </motion.button>
              </form>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Fast Response
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    Secure & Private
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
