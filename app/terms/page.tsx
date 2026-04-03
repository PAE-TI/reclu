'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicHeader from '@/components/public-header';
import { useLanguage } from '@/contexts/language-context';
import { 
  Sparkles, 
  ArrowLeft,
  Shield,
  FileText,
  Users,
  Lock,
  AlertTriangle,
  Scale,
  Globe,
  Mail,
  Coins
} from 'lucide-react';

export default function TermsPage() {
  const { t, language } = useLanguage();
  
  const content = {
    es: {
      title: 'Términos y Condiciones',
      lastUpdate: 'Última actualización: 16 de enero de 2026',
      sections: [
        {
          icon: FileText,
          iconColor: 'indigo',
          title: '1. Introducción',
          content: [
            'Bienvenido a Reclu. Estos Términos y Condiciones regulan el uso de nuestra plataforma de evaluación de talento empresarial. Al acceder o utilizar nuestros servicios, usted acepta estar sujeto a estos términos. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder a nuestros servicios.',
            'Reclu es una plataforma que proporciona evaluaciones psicométricas basadas en la metodología DISC y Fuerzas Motivadoras para ayudar a las organizaciones a tomar mejores decisiones de talento.'
          ]
        },
        {
          icon: Globe,
          iconColor: 'purple',
          title: '2. Definiciones',
          list: [
            { term: '"Plataforma"', def: 'Se refiere al sitio web y aplicación de Reclu.' },
            { term: '"Usuario"', def: 'Cualquier persona que acceda o utilice la Plataforma.' },
            { term: '"Administrador"', def: 'Usuario con cuenta empresarial que gestiona evaluaciones.' },
            { term: '"Evaluado"', def: 'Persona que completa una evaluación DISC o Fuerzas Motivadoras.' },
            { term: '"Evaluación"', def: 'Cuestionario psicométrico DISC o de Fuerzas Motivadoras.' },
            { term: '"Resultados"', def: 'Informes generados a partir de las evaluaciones completadas.' }
          ]
        },
        {
          icon: Users,
          iconColor: 'green',
          title: '3. Uso del Servicio',
          intro: 'Al utilizar Reclu, usted se compromete a:',
          list: [
            'Proporcionar información veraz y actualizada al registrarse.',
            'Mantener la confidencialidad de sus credenciales de acceso.',
            'Utilizar la plataforma únicamente para fines legítimos de evaluación de talento.',
            'No compartir resultados de evaluaciones sin el consentimiento apropiado.',
            'Respetar la privacidad de los evaluados y sus datos personales.',
            'No intentar acceder a datos de otros usuarios sin autorización.',
            'No utilizar la plataforma para discriminación o decisiones ilegales.'
          ]
        },
        {
          icon: Lock,
          iconColor: 'blue',
          title: '4. Privacidad y Protección de Datos',
          intro: 'La protección de sus datos es fundamental para nosotros:',
          list: [
            { term: 'Recolección:', def: 'Recopilamos datos necesarios para proporcionar el servicio, incluyendo información de contacto, respuestas a evaluaciones y resultados.' },
            { term: 'Uso:', def: 'Sus datos se utilizan exclusivamente para generar evaluaciones, proporcionar insights y mejorar nuestros servicios.' },
            { term: 'Almacenamiento:', def: 'Los datos se almacenan de forma segura con encriptación y medidas de seguridad estándar de la industria.' },
            { term: 'Compartir:', def: 'No vendemos ni compartimos sus datos personales con terceros para fines de marketing.' },
            { term: 'Retención:', def: 'Mantenemos sus datos mientras su cuenta esté activa o según sea necesario para proporcionar servicios.' },
            { term: 'Derechos:', def: 'Puede solicitar acceso, rectificación o eliminación de sus datos en cualquier momento.' }
          ]
        },
        {
          icon: Shield,
          iconColor: 'amber',
          title: '5. Evaluaciones y Resultados',
          intro: 'Respecto a las evaluaciones DISC y Fuerzas Motivadoras:',
          list: [
            { term: 'Naturaleza:', def: 'Las evaluaciones son herramientas de desarrollo y autoconocimiento, no diagnósticos psicológicos clínicos.' },
            { term: 'Precisión:', def: 'Los resultados reflejan las respuestas proporcionadas en un momento específico y pueden variar con el tiempo.' },
            { term: 'Uso apropiado:', def: 'Los resultados deben usarse como una herramienta más en procesos de desarrollo, no como único criterio de decisión.' },
            { term: 'Confidencialidad:', def: 'Los resultados de los evaluados son confidenciales y solo accesibles por administradores autorizados.' },
            { term: 'No discriminación:', def: 'Los resultados no deben usarse para discriminar por raza, género, religión, orientación sexual o cualquier característica protegida.' }
          ]
        },
        {
          icon: Coins,
          iconColor: 'amber',
          title: '6. Sistema de Créditos',
          intro: 'Reclu opera mediante un sistema de créditos para el envío de evaluaciones:',
          list: [
            { term: 'Costo por evaluación:', def: 'Cada evaluación enviada tiene un costo en créditos. El costo por evaluación es definido por Reclu y puede cambiar en cualquier momento por decisión de la empresa, sin previo aviso.' },
            { term: 'Créditos iniciales:', def: 'Al registrarse, cada usuario recibe una cantidad inicial de créditos. Esta cantidad es definida exclusivamente por Reclu y puede ser modificada en cualquier momento sin previo aviso.' },
            { term: 'Valor de los créditos:', def: 'El valor monetario de los créditos, incluyendo el precio de compra de créditos adicionales, es establecido por Reclu y está sujeto a cambios sin previo aviso.' },
            { term: 'No reembolsables:', def: 'Los créditos utilizados para enviar evaluaciones no son reembolsables bajo ninguna circunstancia, incluso si el evaluado no completa la evaluación.' },
            { term: 'Vigencia:', def: 'Los créditos no tienen fecha de expiración mientras la cuenta del usuario permanezca activa.' },
            { term: 'Transferibilidad:', def: 'Los créditos no son transferibles entre cuentas de usuarios.' }
          ],
          warning: '⚠️ Importante: Al utilizar la plataforma, usted acepta que Reclu tiene la facultad exclusiva de definir y modificar los costos, valores y cantidades relacionadas con el sistema de créditos sin necesidad de notificación previa.'
        },
        {
          icon: AlertTriangle,
          iconColor: 'red',
          title: '7. Limitaciones de Responsabilidad',
          intro: 'Reclu se proporciona "tal cual" y "según disponibilidad":',
          list: [
            'No garantizamos que el servicio sea ininterrumpido o libre de errores.',
            'No somos responsables de decisiones tomadas basándose en los resultados.',
            'Las evaluaciones son herramientas de orientación, no garantías de comportamiento futuro.',
            'No somos responsables por el uso indebido de los resultados por parte de terceros.',
            'Nuestra responsabilidad máxima está limitada al monto pagado por los servicios.'
          ]
        },
        {
          icon: Sparkles,
          iconColor: 'indigo',
          title: '8. Propiedad Intelectual',
          content: [
            'Todo el contenido de Reclu, incluyendo pero no limitado a textos, gráficos, logos, iconos, imágenes, clips de audio, descargas digitales y compilaciones de datos, es propiedad de Reclu o sus proveedores de contenido y está protegido por las leyes de propiedad intelectual. Las metodologías DISC y Fuerzas Motivadoras se utilizan bajo licencia y son propiedad de sus respectivos titulares.'
          ]
        },
        {
          icon: FileText,
          iconColor: 'purple',
          title: '9. Modificaciones',
          content: [
            'Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma. Su uso continuado de Reclu después de la publicación de cambios constituye su aceptación de dichos cambios. Le recomendamos revisar periódicamente estos términos.'
          ]
        },
        {
          icon: Mail,
          iconColor: 'green',
          title: '10. Contacto',
          content: [
            'Si tiene preguntas sobre estos Términos y Condiciones, puede contactarnos a través de nuestra plataforma o enviando un correo electrónico a soporte@reclu.com.'
          ]
        }
      ],
      ctaTitle: '¿Listo para comenzar?',
      ctaText: 'Al crear una cuenta en Reclu, confirmas que has leído y aceptas estos términos.',
      createAccount: 'Crear Cuenta',
      login: 'Iniciar Sesión',
      footer: '© 2026 Reclu. Plataforma de evaluación de talento empresarial.'
    },
    en: {
      title: 'Terms & Conditions',
      lastUpdate: 'Last updated: January 16, 2026',
      sections: [
        {
          icon: FileText,
          iconColor: 'indigo',
          title: '1. Introduction',
          content: [
            'Welcome to Reclu. These Terms and Conditions govern the use of our enterprise talent assessment platform. By accessing or using our services, you agree to be bound by these terms. If you do not agree with any part of these terms, you may not access our services.',
            'Reclu is a platform that provides psychometric assessments based on DISC and Driving Forces methodology to help organizations make better talent decisions.'
          ]
        },
        {
          icon: Globe,
          iconColor: 'purple',
          title: '2. Definitions',
          list: [
            { term: '"Platform"', def: 'Refers to the Reclu website and application.' },
            { term: '"User"', def: 'Any person who accesses or uses the Platform.' },
            { term: '"Administrator"', def: 'User with a business account who manages assessments.' },
            { term: '"Assessed"', def: 'Person who completes a DISC or Driving Forces assessment.' },
            { term: '"Assessment"', def: 'DISC or Driving Forces psychometric questionnaire.' },
            { term: '"Results"', def: 'Reports generated from completed assessments.' }
          ]
        },
        {
          icon: Users,
          iconColor: 'green',
          title: '3. Use of Service',
          intro: 'By using Reclu, you agree to:',
          list: [
            'Provide truthful and up-to-date information when registering.',
            'Maintain the confidentiality of your access credentials.',
            'Use the platform solely for legitimate talent assessment purposes.',
            'Not share assessment results without appropriate consent.',
            'Respect the privacy of assessed individuals and their personal data.',
            'Not attempt to access other users\' data without authorization.',
            'Not use the platform for discrimination or illegal decisions.'
          ]
        },
        {
          icon: Lock,
          iconColor: 'blue',
          title: '4. Privacy and Data Protection',
          intro: 'Protecting your data is fundamental to us:',
          list: [
            { term: 'Collection:', def: 'We collect data necessary to provide the service, including contact information, assessment responses, and results.' },
            { term: 'Use:', def: 'Your data is used exclusively to generate assessments, provide insights, and improve our services.' },
            { term: 'Storage:', def: 'Data is stored securely with encryption and industry-standard security measures.' },
            { term: 'Sharing:', def: 'We do not sell or share your personal data with third parties for marketing purposes.' },
            { term: 'Retention:', def: 'We keep your data while your account is active or as needed to provide services.' },
            { term: 'Rights:', def: 'You can request access, rectification, or deletion of your data at any time.' }
          ]
        },
        {
          icon: Shield,
          iconColor: 'amber',
          title: '5. Assessments and Results',
          intro: 'Regarding DISC and Driving Forces assessments:',
          list: [
            { term: 'Nature:', def: 'Assessments are development and self-knowledge tools, not clinical psychological diagnoses.' },
            { term: 'Accuracy:', def: 'Results reflect responses provided at a specific time and may vary over time.' },
            { term: 'Appropriate use:', def: 'Results should be used as one tool among many in development processes, not as the sole decision criterion.' },
            { term: 'Confidentiality:', def: 'Assessed individuals\' results are confidential and only accessible by authorized administrators.' },
            { term: 'Non-discrimination:', def: 'Results should not be used to discriminate based on race, gender, religion, sexual orientation, or any protected characteristic.' }
          ]
        },
        {
          icon: Coins,
          iconColor: 'amber',
          title: '6. Credit System',
          intro: 'Reclu operates through a credit system for sending assessments:',
          list: [
            { term: 'Cost per assessment:', def: 'Each assessment sent has a credit cost. The cost per assessment is defined by Reclu and may change at any time at the company\'s discretion, without prior notice.' },
            { term: 'Initial credits:', def: 'Upon registration, each user receives an initial amount of credits. This amount is defined exclusively by Reclu and may be modified at any time without prior notice.' },
            { term: 'Credit value:', def: 'The monetary value of credits, including the purchase price of additional credits, is established by Reclu and is subject to change without prior notice.' },
            { term: 'Non-refundable:', def: 'Credits used to send assessments are non-refundable under any circumstances, even if the assessed person does not complete the assessment.' },
            { term: 'Validity:', def: 'Credits do not expire as long as the user\'s account remains active.' },
            { term: 'Transferability:', def: 'Credits are not transferable between user accounts.' }
          ],
          warning: '⚠️ Important: By using the platform, you accept that Reclu has the exclusive authority to define and modify costs, values, and amounts related to the credit system without the need for prior notification.'
        },
        {
          icon: AlertTriangle,
          iconColor: 'red',
          title: '7. Limitations of Liability',
          intro: 'Reclu is provided "as is" and "as available":',
          list: [
            'We do not guarantee that the service will be uninterrupted or error-free.',
            'We are not responsible for decisions made based on the results.',
            'Assessments are guidance tools, not guarantees of future behavior.',
            'We are not responsible for misuse of results by third parties.',
            'Our maximum liability is limited to the amount paid for the services.'
          ]
        },
        {
          icon: Sparkles,
          iconColor: 'indigo',
          title: '8. Intellectual Property',
          content: [
            'All Reclu content, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, and data compilations, is the property of Reclu or its content providers and is protected by intellectual property laws. DISC and Driving Forces methodologies are used under license and are the property of their respective owners.'
          ]
        },
        {
          icon: FileText,
          iconColor: 'purple',
          title: '9. Modifications',
          content: [
            'We reserve the right to modify these Terms and Conditions at any time. Changes will take effect immediately upon publication on the platform. Your continued use of Reclu after the publication of changes constitutes your acceptance of such changes. We recommend periodically reviewing these terms.'
          ]
        },
        {
          icon: Mail,
          iconColor: 'green',
          title: '10. Contact',
          content: [
            'If you have questions about these Terms and Conditions, you can contact us through our platform or by sending an email to support@reclu.com.'
          ]
        }
      ],
      ctaTitle: 'Ready to get started?',
      ctaText: 'By creating an account on Reclu, you confirm that you have read and accept these terms.',
      createAccount: 'Create Account',
      login: 'Log In',
      footer: '© 2026 Reclu. Enterprise talent assessment platform.'
    }
  };

  const c = content[language];

  const iconColorMap: Record<string, { bg: string; text: string }> = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    red: { bg: 'bg-red-100', text: 'text-red-600' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/50">
      <PublicHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-6">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{c.title}</h1>
          <p className="text-lg text-gray-600">{c.lastUpdate}</p>
        </div>

        <Card className="shadow-xl border-0 bg-white mb-8">
          <CardContent className="p-8 lg:p-12">
            <div className="prose prose-lg max-w-none">
              {c.sections.map((section: any, i: number) => {
                const Icon = section.icon;
                const colors = iconColorMap[section.iconColor];
                return (
                  <section key={i} className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 m-0">{section.title}</h2>
                    </div>
                    
                    {section.content && section.content.map((p: string, j: number) => (
                      <p key={j} className="text-gray-600 leading-relaxed mb-4">{p}</p>
                    ))}
                    
                    {section.intro && (
                      <p className="text-gray-600 leading-relaxed mb-4">{section.intro}</p>
                    )}
                    
                    {section.list && (
                      <ul className="text-gray-600 space-y-3">
                        {section.list.map((item: any, j: number) => (
                          <li key={j}>
                            {typeof item === 'string' ? (
                              item
                            ) : (
                              <><strong>{item.term}</strong> {item.def}</>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    {section.warning && (
                      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <p className="text-amber-800 text-sm">
                          <strong>{section.warning}</strong>
                        </p>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-4">{c.ctaTitle}</h3>
          <p className="text-white/80 mb-6">{c.ctaText}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
                {c.createAccount}
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline" className="border-white/50 text-white bg-white/10 hover:bg-white/20">
                {c.login}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-8 bg-gray-900 text-gray-400 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>{c.footer}</p>
        </div>
      </footer>
    </div>
  );
}
