import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function DigitalizacionNegociosItapua() {
  const handleWhatsAppContact = () => {
    const whatsappNumber = "+595985990046";
    const message = "Hola! Me interesa solicitar asesoría sobre digitalización de negocios en Itapúa.";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`, '_blank');
  };

  return (
    <Layout onAuthClick={() => {}}>
      <title>Digitalización de Negocios en Itapúa | Automatización Empresarial | SoftwarePar</title>
      <meta name="description" content="Servicios de digitalización de negocios en Itapúa. Automatizamos procesos empresariales con software a medida para empresas y emprendedores." />
      <link rel="canonical" href="https://softwarepar.lat/digitalizacion-de-negocios-en-itapua" />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-6">
              Digitalización de Negocios en Itapúa
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12">
              Ayudamos a negocios y emprendedores de Itapúa a modernizar su gestión con sistemas digitales, automatización de procesos y herramientas tecnológicas adaptadas a cada negocio.
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">¿Qué incluye la digitalización de un negocio?</h2>
              <div className="grid gap-4">
                {[
                  "Sistemas de gestión para negocios",
                  "Automatización de procesos administrativos",
                  "Control de clientes y ventas",
                  "Gestión digital de inventarios",
                  "Reportes y estadísticas de negocio"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Negocios que pueden digitalizarse</h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Comercios",
                      "Farmacias",
                      "Ferreterías",
                      "Clínicas y consultorios",
                      "Distribuidoras",
                      "Emprendimientos locales"
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
                Trabajamos con negocios de Itapúa, incluyendo Carlos Antonio López, Mayor Otaño y zonas cercanas, brindando soluciones tecnológicas adaptadas a la realidad de cada empresa.
              </p>
              
              <Button 
                size="lg" 
                onClick={handleWhatsAppContact}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-8 rounded-full text-lg shadow-xl transition-all transform hover:scale-105"
              >
                Solicitar asesoría por WhatsApp
              </Button>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
