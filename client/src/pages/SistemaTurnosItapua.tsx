import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import { CheckCircle, MessageCircle } from "lucide-react";

export default function SistemaTurnosItapua() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleWhatsAppContact = () => {
    const phoneNumber = "+595985990046";
    const message = "Hola! Quisiera solicitar una demostración del Sistema de Turnos Online para mi consultorio/clínica en Itapúa.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Layout onAuthClick={openAuthModal}>
      <title>Sistema de Turnos Online para Consultorios en Itapúa | SoftwarePar</title>
      <meta name="description" content="Sistema de turnos online para consultorios, clínicas y hospitales en Itapúa. Gestión de citas automática y administración de pacientes." />
      <link rel="canonical" href="https://softwarepar.lat/sistema-de-turnos-en-itapua" />
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-background min-h-screen">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Sistema de Turnos Online para Consultorios en Itapúa
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              En SoftwarePar desarrollamos sistemas de turnos online para consultorios, clínicas y hospitales en Itapúa. Digitalizamos la gestión de pacientes para evitar largas esperas, mejorar la organización y brindar una mejor experiencia tanto al personal como a los pacientes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              ¿Por qué muchos centros de salud necesitan modernizarse?
            </h2>
            <p className="text-lg text-muted-foreground">
              Muchos consultorios y hospitales en Itapúa todavía gestionan turnos de forma manual, utilizando cuadernos, planillas o sistemas desorganizados. Esto genera largas esperas, confusión en la sala de espera y molestias para los pacientes. Un sistema digital permite ordenar la atención, reducir el tiempo de espera y brindar una experiencia más profesional.
            </p>
            <div className="pt-4">
              <Button 
                size="lg" 
                onClick={handleWhatsAppContact}
                className="bg-[#25D366] hover:bg-[#20ba5a] text-white px-8 py-6 text-lg rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <MessageCircle className="h-6 w-6" />
                Solicitar demostración ahora
              </Button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              ¿Dónde implementamos nuestro sistema?
            </h2>
            <p className="text-lg text-muted-foreground">
              Trabajamos en todo el departamento de Itapúa, incluyendo Carlos Antonio López, Mayor Otaño, Encarnación y ciudades cercanas.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Beneficios del sistema de turnos
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Gestión digital de turnos en tiempo real",
                "Pantalla para sala de espera con número actual",
                "Historial de pacientes",
                "Reducción del tiempo de espera",
                "Organización interna más eficiente"
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-lg text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Ideal para:
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Consultorios privados",
                "Clínicas médicas",
                "Hospitales públicos",
                "Centros de salud"
              ].map((type, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span className="text-lg text-muted-foreground">{type}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Soporte local en Itapúa
            </h2>
            <p className="text-lg text-muted-foreground">
              Brindamos atención directa en Carlos Antonio López, Mayor Otaño y ciudades cercanas. Ofrecemos acompañamiento personalizado, configuración inicial del sistema y soporte técnico cercano para garantizar el correcto funcionamiento en tu consultorio o centro de salud.
            </p>
          </section>

          <section className="bg-primary/5 rounded-2xl p-8 sm:p-12 text-center space-y-6 border border-primary/10">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Solicitar información
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Si tienes un consultorio, clínica o centro de salud en Itapúa y deseas modernizar tu sistema de atención, contáctanos para una demostración.
            </p>
            <Button 
              size="lg" 
              onClick={handleWhatsAppContact}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg transition-all hover:scale-105"
            >
              <MessageCircle className="mr-2 h-6 w-6" />
              Solicitar demostración por WhatsApp
            </Button>
          </section>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </Layout>
  );
}
