import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AuthModal from "@/components/AuthModal";
import ContactForm from "@/components/ContactForm";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import type { HeroSlide } from "@shared/schema";
import {
  Code,
  Smartphone,
  Cloud,
  TrendingUp,
  Shield,
  HeadphonesIcon,
  Check,
  Star,
  Users,
  CheckCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// Placeholder for AnimatedCounter component
// In a real scenario, this would be imported from a library or defined elsewhere.
const AnimatedCounter = ({ value, suffix }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0); // Reiniciar contador cuando cambia el valor
    const animationFrame = requestAnimationFrame(() => {
      let startTime: number | null = null;
      const duration = 1000; // Duración de la animación en ms

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        setCount(Math.floor(progress * value));

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          setCount(value); // Asegurar que el valor final sea exacto
        }
      };
      requestAnimationFrame(step);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [value]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
};


export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [currentSlide, setCurrentSlide] = useState(0);
  const { portfolio, isLoading: portfolioLoading } = usePortfolio();

  const { data: heroSlides, isLoading: slidesLoading } = useQuery<HeroSlide[]>({
    queryKey: ["/api/hero-slides"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/hero-slides");
      if (!response.ok) {
        throw new Error('Error al cargar slides del hero');
      }
      return await response.json();
    },
    refetchOnWindowFocus: false,
  });

  // Auto-advance slides
  useEffect(() => {
    if (!heroSlides || heroSlides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [heroSlides]);

  const nextSlide = () => {
    if (heroSlides) {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }
  };

  const prevSlide = () => {
    if (heroSlides) {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }
  };

  const { data: workModalities, isLoading: modalitiesLoading, error: modalitiesError } = useQuery({
    queryKey: ["/api/work-modalities"],
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "/api/work-modalities");
        if (!response.ok) {
          throw new Error('Error al cargar modalidades');
        }
        const data = await response.json();

        console.log("Work modalities loaded:", data);

        return data.map((modality: any) => ({
          ...modality,
          features: typeof modality.features === 'string'
            ? JSON.parse(modality.features)
            : Array.isArray(modality.features)
              ? modality.features
              : []
        }));
      } catch (error) {
        console.error("Error loading work modalities:", error);
        return [];
      }
    },
    retry: 1,
    retryDelay: 2000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // Manejar navegación automática cuando hay hash en la URL
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      // Pequeño delay para asegurar que el DOM esté listo
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);


  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleWhatsAppContact = () => {
    // Replace with your actual WhatsApp number and message
    const phoneNumber = "+595981123456"; // Example number
    const message = "¡Hola! Quisiera solicitar una cotización.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const services = [
    {
      icon: Code,
      title: "Digitalización de Negocios en Itapúa",
      description: "Creamos la presencia digital que tu negocio en Itapúa necesita. Sitios web rápidos, modernos y optimizados para atraer más clientes locales.",
      features: ["Páginas web profesionales", "Google Maps y presencia local", "Diseño adaptado a móviles"],
    },
    {
      icon: Smartphone,
      title: "Sistemas para Consultorios",
      description: "Software especializado para la gestión de pacientes y turnos en consultorios de Itapúa. Simplifica tu administración hoy mismo.",
      features: ["Gestión de turnos online", "Fichas de pacientes digitales", "Recordatorios por WhatsApp"],
    },
    {
      icon: TrendingUp,
      title: "Facturación Electrónica SIFEN",
      description: "Implementación completa de facturación electrónica según normativas SIFEN Paraguay. Emití facturas legales desde tu negocio en Itapúa.",
      features: ["Integración SIFEN completa", "Generación automática de facturas", "Cumplimiento SET garantizado"],
    },
    {
      icon: HeadphonesIcon,
      title: "Soporte Técnico Local",
      description: "Asistencia técnica personalizada y cercana para negocios en Carlos Antonio López, Mayor Otaño y alrededores. Estamos donde vos estás.",
      features: ["Soporte presencial y remoto", "Mantenimiento preventivo", "Atención rápida en Itapúa"],
    },
    {
      icon: Cloud,
      title: "Gestión de Inventarios",
      description: "Controlá el stock de tu negocio de forma eficiente con nuestros sistemas en la nube. Accedé a tu información desde cualquier lugar.",
      features: ["Control de entradas y salidas", "Reportes de ventas diarios", "Acceso desde el celular"],
    },
    {
      icon: Shield,
      title: "Seguridad y Resguardos",
      description: "Protegemos los datos de tu empresa y pacientes con copias de seguridad automáticas y las mejores prácticas de seguridad digital.",
      features: ["Copias de seguridad diarias", "Protección de datos sensibles", "Acceso seguro multidispositivo"],
    },
  ];

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "¿Qué es SoftwarePar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "SoftwarePar es una empresa de Itapúa especializada en la digitalización de negocios y consultorios locales en Carlos Antonio López, Mayor Otaño y toda la región. Creamos sistemas de gestión, turnos online y facturación electrónica adaptados a la realidad de nuestra comunidad."
          }
        },
        {
          "@type": "Question",
          "name": "¿Qué servicios ofrece SoftwarePar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ofrecemos sistemas de turnos para consultorios, digitalización de negocios locales, implementación de facturación electrónica SIFEN, desarrollo de sitios web profesionales y soporte técnico presencial en Itapúa."
          }
        },
        {
          "@type": "Question",
          "name": "¿Dónde está ubicada SoftwarePar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Estamos ubicados en Itapúa, Paraguay, específicamente atendiendo de forma prioritaria a Carlos Antonio López, Mayor Otaño y distritos vecinos con soporte local y cercano."
          }
        },
        {
          "@type": "Question",
          "name": "¿SoftwarePar ofrece soporte técnico?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, brindamos soporte técnico 24/7 con la ventaja de estar en Itapúa, lo que nos permite ofrecer una atención más rápida y personalizada a los negocios de la zona."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuántos proyectos ha completado SoftwarePar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Hemos completado más de 50 proyectos exitosos, ayudando a transformar digitalmente a empresas y profesionales en Itapúa y todo Paraguay."
          }
        },
        {
          "@type": "Question",
          "name": "¿SoftwarePar implementa facturación electrónica SIFEN?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí, somos expertos en SIFEN y ayudamos a los negocios de Itapúa a cumplir con las normativas de la SET de forma simple y eficiente."
          }
        },
        {
          "@type": "Question",
          "name": "¿Cuánto tiempo tarda la implementación del sistema?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "La implementación puede realizarse en pocos días dependiendo del tamaño del consultorio o centro de salud. Nos encargamos de la configuración inicial y acompañamos todo el proceso para que la transición sea simple y ordenada."
          }
        },
        {
          "@type": "Question",
          "name": "¿Es difícil usar el sistema de turnos?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. El sistema está diseñado para ser simple e intuitivo. El personal puede aprender a utilizarlo en poco tiempo y ofrecemos capacitación inicial incluida para asegurar una correcta implementación."
          }
        },
        {
          "@type": "Question",
          "name": "¿Necesito equipamiento especial?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Solo se necesita una computadora con conexión a internet. Si se desea implementar una pantalla en la sala de espera, podemos asesorar sobre la mejor opción según el espacio disponible."
          }
        },
        {
          "@type": "Question",
          "name": "¿El sistema cumple con las normativas de Paraguay?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Sí. Implementamos soluciones adaptadas a la normativa vigente en Paraguay, incluyendo integración con facturación electrónica SIFEN cuando el cliente lo requiere."
          }
        }
      ]
    };

    return (
      <Layout onAuthClick={openAuthModal}>
        <title>SoftwarePar | Desarrollo de Software en Paraguay</title>
        <meta name="description" content="Empresa de desarrollo de software en Paraguay. Creamos aplicaciones web, sistemas empresariales, facturación electrónica SIFEN y soluciones digitales para negocios en Itapúa." />
        <link rel="canonical" href="https://softwarepar.lat/" />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      {/* Hero Section - Slider Dinámico */}
      <section id="inicio" className="pt-0 pb-8 md:pb-20 relative overflow-hidden">
        <div className="relative h-[500px] sm:h-[600px] md:h-[780px]">
          <AnimatePresence mode="sync">
            {heroSlides && heroSlides.length > 0 && (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {/* Background Color Layer (always present) */}
                <div 
                  className="absolute inset-0"
                  style={{
                    background: heroSlides[currentSlide]?.backgroundColor 
                      ? (() => {
                          const color = heroSlides[currentSlide].backgroundColor;
                          const opacityPercent = heroSlides[currentSlide].backgroundColorOpacity ?? 100;
                          
                          // Si la opacidad es 0, no mostrar color
                          if (opacityPercent === 0) {
                            return 'transparent';
                          }
                          
                          const opacity = opacityPercent / 100;
                          const opacityHex = Math.round(opacity * 255).toString(16).padStart(2, '0');
                          
                          // If there's a video or image and opacity is 100, we might want to reduce it 
                          // to see the media. But the user specifically said "clean background" for videos.
                          return `linear-gradient(135deg, ${color}${opacityHex} 0%, ${color}${Math.round(opacity * 0.87).toString(16).padStart(2, '0')} 50%, ${color}${Math.round(opacity * 0.8).toString(16).padStart(2, '0')} 100%)`;
                        })()
                      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.6) 50%, rgba(59, 130, 246, 0.4) 100%)'
                  }}
                />

                {/* Media Layer (image or video) */}
                {heroSlides[currentSlide]?.imageUrl && (
                  heroSlides[currentSlide]?.mediaType === 'video' ? (
                    <div className="absolute inset-0">
                      <video
                        key={heroSlides[currentSlide].imageUrl}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      >
                        <source src={heroSlides[currentSlide].imageUrl} type="video/mp4" />
                      </video>
                    </div>
                  ) : (
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${heroSlides[currentSlide].imageUrl})`,
                      }}
                    />
                  )
                )}

                {/* Content */}
                <div className="relative z-10 max-w-6xl mx-auto px-4 h-full flex flex-col justify-center pt-16 sm:pt-20 md:pt-28">
                  <motion.div
                    className="text-center px-3 sm:px-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {heroSlides[currentSlide]?.subtitle && (
                      <div className="mb-3 sm:mb-6 inline-block">
                        <Badge variant="outline" className="bg-white/10 backdrop-blur-sm text-white px-2.5 py-1 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-sm font-medium border border-white/20">
                          🇵🇾 Itapúa, Paraguay
                        </Badge>
                      </div>
                    )}

                    <h1 className="font-sans text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-3 sm:mb-6 tracking-tight drop-shadow-xl leading-tight max-w-4xl mx-auto px-2">
                      Sistemas y Soluciones Digitales para Negocios en Itapúa
                    </h1>

                    <p className="text-xs sm:text-base md:text-lg lg:text-xl text-white/90 mb-4 sm:mb-8 max-w-3xl mx-auto leading-relaxed font-normal drop-shadow-lg px-2">
                      En SoftwarePar ayudamos a negocios y consultorios en Carlos Antonio López, Mayor Otaño y todo Itapúa a organizar su gestión, aumentar sus ventas y modernizar su atención con sistemas profesionales y soluciones digitales adaptadas a la realidad local.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center items-center max-w-md mx-auto mb-6 sm:mb-10 md:mb-12 px-4">
                      {heroSlides[currentSlide]?.buttonText && (
                        <Button
                          size="lg"
                          onClick={() => {
                            const link = heroSlides[currentSlide]?.buttonLink || '#contacto';
                            if (link.startsWith('#')) {
                              scrollToSection(link.substring(1));
                            } else {
                              window.location.href = link;
                            }
                          }}
                          className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 hover:text-primary transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg px-5 py-2 sm:px-8 sm:py-3 text-xs sm:text-base"
                        >
                          Solicitar Diagnóstico Gratuito
                        </Button>
                      )}
                      <Button
                        size="lg"
                        onClick={() => openAuthModal('login')}
                        className="w-full sm:w-auto bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-200 font-semibold backdrop-blur-sm px-5 py-2 sm:px-8 sm:py-3 shadow-lg text-xs sm:text-base"
                      >
                        <Users className="h-3 w-3 sm:h-5 sm:w-5 mr-2" />
                        Acceso Clientes
                      </Button>
                    </div>
                    
                    {/* Trust Line Removed */}
                    
                  </motion.div>

                  {/* Hero Stats */}
                  <motion.div
                    className="mt-6 sm:mt-10 md:mt-12 grid grid-cols-3 gap-2 sm:gap-6 max-w-5xl mx-auto px-4"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <div className="text-center glass-effect p-3 sm:p-6 rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-2 drop-shadow-md">
                        <AnimatedCounter value={50} suffix="+" />
                      </div>
                      <div className="text-[9px] sm:text-sm text-white/95 font-medium drop-shadow-sm leading-tight">Proyectos Completados</div>
                    </div>
                    <div className="text-center glass-effect p-3 sm:p-6 rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-2 drop-shadow-md">
                        <AnimatedCounter value={98} suffix="%" />
                      </div>
                      <div className="text-[9px] sm:text-sm text-white/95 font-medium drop-shadow-sm leading-tight">Satisfacción del Cliente</div>
                    </div>
                    <div className="text-center glass-effect p-3 sm:p-6 rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-300">
                      <div className="text-2xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-2 drop-shadow-md">24/7</div>
                      <div className="text-[9px] sm:text-sm text-white/95 font-medium drop-shadow-sm leading-tight">Soporte Técnico</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slider Controls */}
          {heroSlides && heroSlides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Slide anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                aria-label="Siguiente slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {heroSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-white w-6 sm:w-8"
                        : "bg-white/40 hover:bg-white/60 w-2 sm:w-3"
                    }`}
                    aria-label={`Ir al slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* New Section: Sistema de Turnos */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="font-sans text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
                Sistema de Turnos Online para Consultorios en Itapúa
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Moderniza la atención de tu consultorio con un sistema profesional de gestión de turnos. Organiza mejor tu agenda, reduce ausencias y mejora la experiencia de tus pacientes.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  "Reservas online 24/7",
                  "Confirmaciones automáticas por WhatsApp",
                  "Pantalla para sala de espera",
                  "Historial de pacientes",
                  "Panel administrativo simple",
                  "Reportes y control de ingresos"
                ].map((item, i) => (
                  <li key={i} className="flex items-center text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button size="lg" onClick={() => scrollToSection('contacto')}>
                Agendar Asesoría para mi Consultorio
              </Button>
            </motion.div>
            <motion.div
              className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80" 
                alt="Sistema de turnos para consultorios"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Soluciones Digitales para Negocios y Consultorios en Itapúa
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Herramientas tecnológicas diseñadas específicamente para la realidad de las empresas paraguayas.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden bg-card/50 backdrop-blur-sm">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                  <CardHeader>
                    <div className="mb-4 bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                      <service.icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl font-bold mb-2">
                      <a 
                        href={
                          service.title === "Digitalización de Negocios en Itapúa" ? "/digitalizacion-de-negocios-en-itapua" :
                          service.title === "Sistemas para Consultorios" ? "/software-para-consultorios-en-itapua" :
                          service.title === "Facturación Electrónica SIFEN" ? "/facturacion-electronica-sifen-itapua" :
                          service.title === "Soporte Técnico Local" ? "/digitalizacion-de-negocios-en-itapua" :
                          service.title === "Gestión de Inventarios" ? "/digitalizacion-de-negocios-en-itapua" :
                          service.title === "Seguridad y Resguardos" ? "/digitalizacion-de-negocios-en-itapua" : "#"
                        }
                        className="hover:text-primary transition-colors"
                      >
                        {service.title}
                      </a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-3">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center text-sm text-muted-foreground/90 font-medium">
                          <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 id="portafolio" className="font-sans text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Proyectos que Impulsan Negocios en Itapúa
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Desarrollamos soluciones digitales adaptadas a la realidad comercial de Itapúa y la región.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {portfolioLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-xl bg-card border border-border/50 overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse"></div>
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between">
                      <div className="h-6 bg-muted rounded animate-pulse w-20"></div>
                      <div className="flex space-x-2">
                        <div className="h-5 bg-muted rounded animate-pulse w-12"></div>
                        <div className="h-5 bg-muted rounded animate-pulse w-16"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
                    <div className="h-16 bg-muted rounded animate-pulse"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                      <div className="h-8 bg-muted rounded animate-pulse w-20"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : portfolio && portfolio.length > 0 ? (
              // Dynamic portfolio items
              portfolio.filter(item => item.isActive).slice(0, 6).map((item, index) => {
                const technologies = JSON.parse(item.technologies || '[]');
                return (
                  <div key={item.id} className="group relative overflow-hidden rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover-lift">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={`${item.title} - Proyecto desarrollado por SoftwarePar`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">{item.category}</Badge>
                        <div className="flex space-x-2">
                          {technologies.slice(0, 2).map((tech: string, techIndex: number) => (
                            <Badge key={techIndex} variant="outline" className="text-xs">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Proyecto desarrollado por SoftwarePar
                        </span>
                        {item.demoUrl ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80"
                            onClick={() => window.open(item.demoUrl!, '_blank')}
                          >
                            Ver demo →
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                            Ver detalles →
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback static items
              [
                {
                  image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
                  category: "E-commerce",
                  technologies: ["React", "Node.js"],
                  title: "Tienda Online Premium",
                  description: "Plataforma completa de e-commerce con carrito de compras, pagos integrados y panel administrativo.",
                  year: "2024"
                },
                {
                  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
                  category: "Dashboard",
                  technologies: ["Vue.js", "Python"],
                  title: "Panel de Analytics",
                  description: "Dashboard interactivo con métricas en tiempo real, reportes automatizados y visualizaciones avanzadas.",
                  year: "2024"
                },
                {
                  image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
                  category: "Mobile App",
                  technologies: ["React Native", "Firebase"],
                  title: "App de Delivery",
                  description: "Aplicación móvil completa para delivery con geolocalización, pagos y seguimiento en tiempo real.",
                  year: "2023"
                },
                {
                  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
                  category: "CRM",
                  technologies: ["Angular", "PostgreSQL"],
                  title: "Sistema CRM Empresarial",
                  description: "Plataforma de gestión de clientes con automatización de ventas y seguimiento de leads.",
                  year: "2023"
                },
                {
                  image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
                  category: "E-learning",
                  technologies: ["Next.js", "MongoDB"],
                  title: "Plataforma Educativa",
                  description: "Sistema de aprendizaje online con videos, evaluaciones y certificaciones automáticas.",
                  year: "2023"
                },
                {
                  image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=400&fit=crop",
                  category: "Cloud",
                  technologies: ["AWS", "Docker"],
                  title: "Infraestructura Cloud",
                  description: "Migración completa a la nube con arquitectura escalable y alta disponibilidad.",
                  year: "2024"
                }
              ].map((item, index) => (
                <div key={index} className="group relative overflow-hidden rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover-lift">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={`${item.title} - Proyecto desarrollado por SoftwarePar`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">{item.category}</Badge>
                      <div className="flex space-x-2">
                        {item.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Proyecto desarrollado por SoftwarePar</span>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Ver detalles →
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground mb-6">
              ¿Quieres ver tu proyecto aquí? Contáctanos y hagamos realidad tu idea.
            </p>
            <Button
              onClick={() => scrollToSection('contacto')}
              className="bg-primary text-white hover:bg-primary/90 font-semibold"
            >
              Comenzar mi Proyecto
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/20 via-background to-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Planes y Sistemas Itapúa</Badge>
            <h2 className="font-sans text-4xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight">
              Planes de Desarrollo Web y Sistemas en Itapúa
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Soluciones diseñadas para negocios y consultorios de Carlos Antonio López, Mayor Otaño y todo Itapúa.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mt-8">
            {modalitiesLoading ? (
              // Loading skeletons
              Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="rounded-xl bg-card border border-border/50 overflow-hidden">
                  <div className="p-6 space-y-4">
                    <div className="h-8 bg-muted animate-pulse rounded w-3/4"></div>
                    <div className="h-4 bg-muted animate-pulse rounded w-full"></div>
                    <div className="h-6 bg-muted animate-pulse rounded w-1/2"></div>
                    <div className="space-y-2">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-4 bg-muted animate-pulse rounded"></div>
                      ))}
                    </div>
                    <div className="h-12 bg-muted animate-pulse rounded"></div>
                  </div>
                </div>
              ))
            ) : modalitiesError ? (
              <div className="col-span-full text-center text-red-500">
                Error al cargar las modalidades. Por favor, intente más tarde.
              </div>
            ) : workModalities && workModalities.length > 0 ? (
              // Dynamic modalities from database
              workModalities.map((modality: any, index: number) => {
                const features = Array.isArray(modality.features) ? modality.features : JSON.parse(modality.features || '[]');

                return (
                  <motion.div
                    key={modality.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className={`h-full transition-all duration-300 relative overflow-visible ${
                      modality.isPopular
                        ? 'border-2 border-primary shadow-lg hover:shadow-xl'
                        : 'border-2 border-border/50 hover:border-primary/50 hover:shadow-lg'
                    }`}>
                      {/* Popular Badge - Posicionado arriba fuera del card */}
                      {modality.isPopular && (
                        <>
                          <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-20">
                            <Badge className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-500 text-white font-bold px-8 py-2 shadow-lg text-sm whitespace-nowrap rounded-full border-2 border-white">
                              ⭐ {modality.badgeText || 'Más Popular'}
                            </Badge>
                          </div>
                          {/* Background Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
                        </>
                      )}

                      <CardHeader className="pt-6 pb-6 relative z-10 space-y-3">
                        <div className="space-y-2">
                          <CardTitle className={`text-2xl sm:text-3xl font-bold leading-tight ${
                            modality.isPopular ? 'text-primary' : 'text-foreground'
                          }`}>
                            {modality.title}
                          </CardTitle>
                          {modality.subtitle && (
                            <p className="text-sm font-semibold text-muted-foreground">
                              {modality.subtitle}
                            </p>
                          )}
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-sm sm:text-base pt-2">
                          {modality.description}
                        </p>
                      </CardHeader>

                      <CardContent className="relative z-10 px-6 pb-8">
                        {/* Price Section */}
                        <div className={`mb-6 p-6 rounded-xl ${
                          modality.isPopular
                            ? 'bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20'
                            : 'bg-muted/30 border border-border'
                        }`}>
                          <div className={`text-3xl sm:text-4xl font-bold mb-1 ${
                            modality.isPopular
                              ? 'text-primary'
                              : 'text-primary'
                          }`}>
                            {modality.priceText}
                          </div>
                          {modality.priceSubtitle && (
                            <p className="text-xs sm:text-sm text-muted-foreground font-medium flex items-center gap-2 mt-2">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                              {modality.priceSubtitle}
                            </p>
                          )}
                        </div>

                        {/* Features List */}
                        <ul className="space-y-3 mb-8">
                          {features.map((feature: string, featureIndex: number) => (
                            <li
                              key={featureIndex}
                              className="flex items-start gap-3"
                            >
                              <div className={`rounded-full p-1 mt-0.5 flex-shrink-0 ${
                                modality.isPopular
                                  ? 'bg-primary/20'
                                  : 'bg-primary/10'
                              }`}>
                                <CheckCircle className={`h-4 w-4 ${modality.isPopular ? 'text-primary' : 'text-primary/80'}`} />
                              </div>
                              <span className="text-foreground/90 leading-relaxed text-sm font-medium flex-1">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA Button */}
                        <Button
                          size="lg"
                          className={`w-full font-semibold shadow-md hover:shadow-lg transition-shadow duration-200 text-base py-6 ${
                            modality.isPopular
                              ? 'bg-primary hover:bg-primary/90 text-white'
                              : 'bg-primary text-white hover:bg-primary/90'
                          }`}
                          onClick={() => scrollToSection('contacto')}
                          data-testid={`button-contact-${modality.title.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {modality.buttonText}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              // Fallback to original hardcoded modalities if no data
              <>
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-4">
                        <CardTitle className="text-2xl">Compra Completa</CardTitle>
                        <Badge variant="secondary">Tradicional</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        Recibe el código fuente completo y propiedad total del proyecto
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <div className="text-3xl font-bold text-primary mb-2">
                          $2,500 - $15,000
                          <span className="text-lg font-normal text-muted-foreground ml-2">USD</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Precio según complejidad</p>
                      </div>

                      <ul className="space-y-4 mb-8">
                        {[
                          "Código fuente completo incluido",
                          "Propiedad intelectual total",
                          "Documentación técnica completa",
                          "3 meses de soporte incluido",
                          "Capacitación del equipo",
                          "Deployment en tu servidor"
                        ].map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="w-full bg-primary text-white hover:bg-primary/90 font-semibold shadow-md"
                        onClick={() => scrollToSection('contacto')}
                        data-testid="button-contact-complete"
                      >
                        Solicitar Cotización
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full border-2 border-primary hover:border-primary/70 transition-all duration-300 hover:shadow-xl relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Más Popular
                      </Badge>
                    </div>

                    <CardHeader className="pt-8">
                      <div className="flex items-center justify-between mb-4">
                        <CardTitle className="text-2xl">Partnership</CardTitle>
                        <Badge variant="outline" className="border-primary text-primary">Innovador</Badge>
                      </div>
                      <p className="text-muted-foreground">
                        Paga menos, conviértete en partner y genera ingresos revendendolo
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <div className="text-3xl font-bold text-primary mb-2">
                          40% - 60%
                          <span className="text-lg font-normal text-muted-foreground ml-2">Descuento</span>
                        </div>
                        <p className="text-sm text-muted-foreground">+ comisiones por ventas</p>
                      </div>

                      <ul className="space-y-4 mb-8">
                        {[
                          "Precio reducido inicial",
                          "Código de referido único",
                          "20-40% comisión por venta",
                          "Dashboard de ganancias",
                          "Sistema de licencias",
                          "Soporte y marketing incluido"
                        ].map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Star className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="w-full bg-primary text-white hover:bg-primary/90 font-semibold shadow-md"
                        onClick={() => scrollToSection('contacto')}
                        data-testid="button-contact-partner"
                      >
                        Convertirse en Partner
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </div>

          {/* Additional Info */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="inline-block border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-blue-50/30 shadow-lg max-w-3xl mx-auto">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 text-left">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-base text-foreground font-semibold">
                      💡 Emitimos factura electrónica oficial (SET Paraguay) para todos los servicios
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Incluye garantía de 6 meses, actualizaciones de seguridad y soporte técnico prioritario.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section - Optimizado para Google AI Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Preguntas Frecuentes sobre Nuestros Servicios en Itapúa
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Resolvemos las dudas más comunes sobre desarrollo web, sistemas de turnos y digitalización de negocios en Itapúa.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {[
                {
                  question: "¿Qué es SoftwarePar?",
                  answer: "SoftwarePar es una empresa de Itapúa especializada en la digitalización de negocios y consultorios locales en Carlos Antonio López, Mayor Otaño y toda la región. Creamos sistemas de gestión, turnos online y facturación electrónica adaptados a la realidad de nuestra comunidad."
                },
                {
                  question: "¿Qué servicios ofrece SoftwarePar?",
                  answer: "Ofrecemos sistemas de turnos para consultorios, digitalización de negocios locales, implementación de facturación electrónica SIFEN, desarrollo de sitios web profesionales y soporte técnico presencial en Itapúa."
                },
                {
                  question: "¿Dónde está ubicada SoftwarePar?",
                  answer: "Estamos ubicados en Itapúa, Paraguay, específicamente atendiendo de forma prioritaria a Carlos Antonio López, Mayor Otaño y distritos vecinos con soporte local y cercano."
                },
                {
                  question: "¿SoftwarePar ofrece soporte técnico?",
                  answer: "Sí, brindamos soporte técnico 24/7 con la ventaja de estar en Itapúa, lo que nos permite ofrecer una atención más rápida y personalizada a los negocios de la zona."
                },
                {
                  question: "¿Cuántos proyectos ha completado SoftwarePar?",
                  answer: "Hemos completado más de 50 proyectos exitosos, ayudando a transformar digitalmente a empresas y profesionales en Itapúa y todo Paraguay."
                },
                {
                  question: "¿SoftwarePar implementa facturación electrónica SIFEN?",
                  answer: "Sí, somos expertos en SIFEN y ayudamos a los negocios de Itapúa a cumplir con las normativas de la SET de forma simple y eficiente."
                },
                {
                  question: "¿Cuánto tiempo tarda la implementación del sistema?",
                  answer: "La implementación puede realizarse en pocos días dependiendo del tamaño del consultorio o centro de salud. Nos encargamos de la configuración inicial y acompañamos todo el proceso para que la transición sea simple y ordenada."
                },
                {
                  question: "¿Es difícil usar el sistema de turnos?",
                  answer: "No. El sistema está diseñado para ser simple e intuitivo. El personal puede aprender a utilizarlo en poco tiempo y ofrecemos capacitación inicial incluida para asegurar una correcta implementación."
                },
                {
                  question: "¿Necesito equipamiento especial?",
                  answer: "Solo se necesita una computadora con conexión a internet. Si se desea implementar una pantalla en la sala de espera, podemos asesorar sobre la mejor opción según el espacio disponible."
                },
                {
                  question: "¿El sistema cumple con las normativas de Paraguay?",
                  answer: "Sí. Implementamos soluciones adaptadas a la normativa vigente en Paraguay, incluyendo integración con facturación electrónica SIFEN cuando el cliente lo requiere."
                }
              ].map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg bg-card overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-3 text-left">
                      <span className="text-primary flex-shrink-0 font-bold">Q:</span>
                      <span className="font-semibold text-foreground">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="flex items-start gap-3 pt-2">
                      <span className="text-primary flex-shrink-0 font-bold">R:</span>
                      <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Contacto y Asesoría en Itapúa
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Solicita tu presupuesto sin compromiso para el sistema de tu negocio o consultorio en Itapúa.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

    </Layout>
  );
}