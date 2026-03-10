import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Phone } from "lucide-react";

export default function DesarrolloWebItapua() {
  const handleWhatsAppContact = () => {
    const whatsappNumber = "+595985990046";
    const message = "Hola! Me interesa solicitar información sobre desarrollo web en Itapúa.";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`, '_blank');
  };

  const handleCotizacionClick = () => {
    window.location.href = "/#contacto";
  };

  return (
    <Layout onAuthClick={() => {}}>
      <title>Desarrollo Web Profesional en Itapúa | Páginas Web para Empresas | SoftwarePar</title>
      <meta name="description" content="Desarrollo web profesional en Itapúa. Creamos páginas web rápidas, seguras y optimizadas para empresas y emprendedores." />
      <link rel="canonical" href="https://softwarepar.lat/desarrollo-web-en-itapua" />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-6">
              Desarrollo Web Profesional para Negocios en Itapúa
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12">
              Creamos páginas web profesionales para negocios, emprendedores y profesionales en Itapúa. Diseñamos sitios modernos optimizados para atraer clientes y mejorar la presencia digital.
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">¿Qué incluye el desarrollo web?</h2>
              <div className="grid gap-4">
                {[
                  "Diseño web moderno y profesional",
                  "Página optimizada para Google",
                  "Formulario de contacto y WhatsApp",
                  "Adaptado para celulares y computadoras",
                  "Optimización de velocidad",
                  "Hosting y dominio opcional"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Tipos de páginas que desarrollamos</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Páginas para negocios locales",
                      "Sitios web para consultorios",
                      "Páginas para emprendedores",
                      "Landing pages para servicios",
                      "Catálogos de productos"
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
              <h2 className="text-2xl font-semibold mb-6">Desarrollo web en Itapúa</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Trabajamos con negocios de Itapúa incluyendo Carlos Antonio López, Mayor Otaño y zonas cercanas, ayudándolos a tener presencia profesional en internet.
              </p>
              
              <Button 
                size="lg" 
                onClick={handleWhatsAppContact}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 px-8 rounded-full text-lg shadow-xl transition-all transform hover:scale-105"
              >
                Solicitar información
              </Button>
            </section>
          </div>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
            ¿Listo para digitalizar tu negocio en Itapúa?
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
