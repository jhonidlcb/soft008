import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Phone } from "lucide-react";

export default function SoftwareConsultoriosItapua() {
  const handleWhatsAppContact = () => {
    const whatsappNumber = "+595985990046";
    const message = "Hola! Me interesa solicitar asesoría sobre el software para consultorios en Itapúa.";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`, '_blank');
  };

  const handleCotizacionClick = () => {
    window.location.href = "/#contacto";
  };

  return (
    <Layout onAuthClick={() => {}}>
      <title>Software para Consultorios en Itapúa | Gestión de Pacientes | SoftwarePar</title>
      <meta name="description" content="Software para consultorios médicos en Itapúa. Gestión de pacientes, turnos, historial clínico y administración médica." />
      <link rel="canonical" href="https://softwarepar.lat/software-para-consultorios-en-itapua" />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-6">
              Software para Consultorios y Clínicas en Itapúa
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12">
              Desarrollamos sistemas para consultorios médicos, clínicas y profesionales de la salud en Itapúa. Nuestro software permite gestionar pacientes, turnos, historiales y mejorar la organización del consultorio.
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">¿Qué incluye el sistema para consultorios?</h2>
              <div className="grid gap-4">
                {[
                  "Gestión de pacientes",
                  "Sistema de turnos online",
                  "Pantalla de sala de espera",
                  "Historial básico de pacientes",
                  "Aviso por voz cuando se llama al paciente",
                  "Organización por consultorio o profesional"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Profesionales que pueden usar este sistema</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Médicos",
                      "Odontólogos",
                      "Psicólogos",
                      "Clínicas privadas",
                      "Centros médicos",
                      "Profesionales independientes"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Implementación en Itapúa</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Trabajamos con profesionales de Itapúa incluyendo Carlos Antonio López, Mayor Otaño y zonas cercanas, brindando soporte local y capacitación básica para el uso del sistema.
              </p>
              
              <Button 
                size="lg" 
                onClick={handleWhatsAppContact}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-8 rounded-full text-lg shadow-xl transition-all transform hover:scale-105"
              >
                <Phone className="mr-2 h-5 w-5" />
                Solicitar asesoría por WhatsApp
              </Button>
            </section>
          </div>
        </div>
      </div>

      {/* CTA Section - Reusing from Footer but as a standalone section if needed, 
          however the instructions say "same as other pages" which usually includes the footer's CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
            ¿Listo para digitalizar tu consultorio en Itapúa?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Unite a los más de 50 negocios y profesionales que ya transformaron su gestión con SoftwarePar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={handleCotizacionClick}
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Solicitar Cotización Gratis
            </Button>
            <Button
              onClick={handleWhatsAppContact}
              variant="outline"
              className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              Hablar por WhatsApp
            </Button>
          </div>
          <p className="mt-8 text-sm opacity-80 font-medium">
            Soporte local en Carlos Antonio López, Mayor Otaño y alrededores.
          </p>
        </div>
      </section>
    </Layout>
  );
}
