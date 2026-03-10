import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Logo from "./Logo";
import { useQuery } from "@tanstack/react-query";

interface FooterProps {
  onAuthClick?: (mode: "login" | "register") => void;
}

export default function Footer({ onAuthClick }: FooterProps) {
  const { data: companyInfo } = useQuery({
    queryKey: ["/api/public/company-info"],
    queryFn: async () => {
      const response = await fetch("/api/public/company-info");
      if (!response.ok) return null;
      return await response.json();
    },
    enabled: true,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const scrollToServices = () => {
    if (window.location.pathname !== '/') {
      window.location.href = '/#servicios';
      return;
    }
    const element = document.getElementById('servicios');
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      {/* CTA Section - Pre-footer */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full -ml-32 -mb-32 blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
            ¿Listo para digitalizar tu negocio en Itapúa?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Unite a los más de 50 negocios y profesionales que ya transformaron su gestión con SoftwarePar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                const element = document.getElementById('contacto');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-xl"
            >
              Solicitar Cotización Gratis
            </button>
            <a
              href="https://wa.me/595985990046"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-transparent border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              Hablar por WhatsApp
            </a>
          </div>
          <p className="mt-8 text-sm opacity-80 font-medium">
            Soporte local en Carlos Antonio López, Mayor Otaño y alrededores.
          </p>
        </div>
      </section>

      <footer className="bg-muted/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Left Column - Logo and Description */}
            <div>
              <div className="mb-4">
                <Logo size="md" textClassName="text-foreground" />
                <p className="text-sm text-primary/80 italic mt-2 font-light">
                  Digitalizamos negocios y consultorios en Itapúa con soluciones profesionales y soporte local.
                </p>
              </div>
              <p className="text-muted-foreground text-sm">
                Especialistas en digitalización de negocios y consultorios en Itapúa. Acompañamos a emprendedores y profesionales de Carlos Antonio López, Mayor Otaño y alrededores con soluciones prácticas y soporte local.
              </p>
            </div>

            {/* Right Column - Three columns grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <h4 className="text-foreground font-semibold mb-4">Servicios</h4>
                <ul className="space-y-2 text-sm">
                  <li><button onClick={scrollToServices} className="text-muted-foreground hover:text-primary transition-colors text-left">Sistemas para Consultorios</button></li>
                  <li><button onClick={scrollToServices} className="text-muted-foreground hover:text-primary transition-colors text-left">Digitalización de Negocios</button></li>
                  <li><button onClick={scrollToServices} className="text-muted-foreground hover:text-primary transition-colors text-left">Facturación Electrónica</button></li>
                  <li><button onClick={scrollToServices} className="text-muted-foreground hover:text-primary transition-colors text-left">Soporte Técnico Local</button></li>
                  <li><button onClick={scrollToServices} className="text-muted-foreground hover:text-primary transition-colors text-left">Gestión de Inventarios</button></li>
                  <li><button onClick={scrollToServices} className="text-muted-foreground hover:text-primary transition-colors text-left">Seguridad y Resguardos</button></li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-foreground font-semibold mb-4">Recursos</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/digitalizacion-de-negocios-en-itapua" className="text-muted-foreground hover:text-primary transition-colors">
                      Digitalización de Negocios en Itapúa
                    </a>
                  </li>
                  <li>
                    <a href="/facturacion-electronica-sifen-itapua" className="text-muted-foreground hover:text-primary transition-colors">
                      Facturación Electrónica SIFEN
                    </a>
                  </li>
                  <li>
                    <a href="/sistema-de-turnos-en-itapua" className="text-muted-foreground hover:text-primary transition-colors">
                      Sistema de Turnos para Consultorios
                    </a>
                  </li>
                  <li>
                    <a href="/software-para-consultorios-en-itapua" className="text-muted-foreground hover:text-primary transition-colors">
                      Software para Consultorios en Itapúa
                    </a>
                  </li>
                  <li>
                    <a href="/desarrollo-web-en-itapua" className="text-muted-foreground hover:text-primary transition-colors">
                      Desarrollo Web en Itapúa
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-foreground font-semibold mb-4">Contacto</h4>
                <ul className="space-y-2 text-muted-foreground text-sm">
                  <li className="flex items-start"><Mail className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" /><span>softwarepar.lat@gmail.com</span></li>
                  <li className="flex items-start"><Phone className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" /><span>+595 985 990 046</span></li>
                  <li className="flex items-start"><MapPin className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" /><span>Itapúa, Carlos Antonio López</span></li>
                  <li className="flex items-start"><Clock className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" /><span>Lun - Vie: 9:00 - 18:00</span></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="flex flex-col items-center lg:items-start w-full">
                <h5 className="text-foreground font-semibold mb-3 text-center lg:text-left w-full">Facturación Legal</h5>
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4 w-full">
                  <div className="bg-white p-2 rounded-lg shadow-sm flex-shrink-0" style={{ width: '120px' }}>
                    <img 
                      src="https://www.dnit.gov.py/documents/d/global/logo-dnit1-png" 
                      alt="DNIT" 
                      className="w-full h-auto object-contain"
                      style={{ maxHeight: '50px' }}
                      onError={(e) => { e.currentTarget.src = '/dnit-logo.png'; }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground text-center lg:text-left flex-1">
                    <p className="font-semibold text-foreground">{companyInfo?.companyName || "SoftwarePar"}</p>
                    <p>RUC: {companyInfo?.ruc || "En proceso"}</p>
                    <p>Timbrado N°: {companyInfo?.timbradoNumber || "En proceso"}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <h5 className="text-foreground font-semibold mb-3">Medios de Pago</h5>
                <div className="flex items-center justify-center mb-2">
                  <img src="/medios-pago.png?v=2" alt="Pagos" className="h-12 object-contain" />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <Badge variant="outline" className="text-xs">Mango Wallet</Badge>
                  <Badge variant="outline" className="text-xs">Transferencia Bancaria</Badge>
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-end">
                <h5 className="text-foreground font-semibold mb-3 text-center lg:text-right">Partners Tecnológicos</h5>
                <div className="flex flex-col items-center lg:items-end space-y-2">
                  <div className="flex items-center space-x-3">
                    <img src="https://cdn.worldvectorlogo.com/logos/aws-2.svg" alt="AWS" className="h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <img src="https://cdn.worldvectorlogo.com/logos/google-cloud-1.svg" alt="GCP" className="h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <img src="https://cdn.worldvectorlogo.com/logos/microsoft-azure-2.svg" alt="Azure" className="h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                  <div className="flex flex-wrap justify-center lg:justify-end gap-2">
                    <Badge variant="outline" className="text-xs">Replit Partner</Badge>
                    <Badge variant="outline" className="text-xs">Vercel Partner</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 SoftwarePar. Todos los derechos reservados.</p>
            <p className="mt-2">
              <a href="/terminos" className="hover:text-primary transition-colors">Términos de Servicio</a>
              <span className="mx-2">•</span>
              <a href="/privacidad" className="hover:text-primary transition-colors">Política de Privacidad</a>
              <span className="mx-2">•</span>
              <a href="/cookies" className="hover:text-primary transition-colors">Cookies</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
