import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function FacturacionElectronicaSifen() {
  const handleWhatsAppContact = () => {
    const whatsappNumber = "+595985990046";
    const message = "Hola! Quisiera solicitar información sobre facturación electrónica SIFEN en Itapúa.";
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`, '_blank');
  };

  return (
    <Layout onAuthClick={() => {}}>
      <title>Facturación Electrónica SIFEN en Itapúa | Implementación DNIT | SoftwarePar</title>
      <meta name="description" content="Implementación de facturación electrónica SIFEN en Paraguay. Integración completa para empresas según normativas DNIT." />
      <link rel="canonical" href="https://softwarepar.lat/facturacion-electronica-sifen-itapua" />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-6">
              Facturación Electrónica SIFEN en Itapúa
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12">
              Implementamos sistemas de facturación electrónica compatibles con SIFEN para negocios y profesionales en Itapúa.
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">¿Qué es SIFEN?</h2>
              <p className="text-lg text-muted-foreground">
                SIFEN es el Sistema Integrado de Facturación Electrónica de Paraguay administrado por la DNIT. Permite emitir comprobantes electrónicos con validez legal.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-6">Nuestros servicios</h2>
              <div className="grid gap-4">
                {[
                  "Implementación de facturación electrónica",
                  "Integración con sistemas de venta",
                  "Generación automática de comprobantes",
                  "Cumplimiento con normativa DNIT",
                  "Capacitación básica de uso"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                    <span className="text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Implementación local en Itapúa</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Brindamos soporte técnico local para negocios y consultorios de Itapúa que necesiten implementar facturación electrónica.
              </p>
              
              <Button 
                size="lg" 
                onClick={handleWhatsAppContact}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-6 px-8 rounded-full text-lg shadow-xl transition-all transform hover:scale-105"
              >
                Solicitar información
              </Button>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
