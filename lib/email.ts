import nodemailer from 'nodemailer';
import { getAppBaseUrl } from '@/lib/site-url';
interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  async sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
    return this.sendViaSMTP({ to, subject, html, text });
  }

  private async sendViaSMTP({ to, subject, html, text }: EmailOptions): Promise<boolean> {
    try {
      const transporter = this.getTransporter();
      if (!transporter) {
      console.error('SMTP no configurado. Agrega MAIL_SMTP_HOST, MAIL_SMTP_USER y MAIL_SMTP_PASS en las variables de entorno.');
        return false;
      }

      await transporter.sendMail({
        from: this.getFromAddress(),
        to,
        subject,
        html,
        text: text || this.htmlToText(html),
      });

      return true;
    } catch (error) {
      console.error('Error sending email via SMTP:', error);
      return false;
    }
  }

  private getTransporter() {
    const host = process.env.MAIL_SMTP_HOST;
    const user = process.env.MAIL_SMTP_USER;
    const password = process.env.MAIL_SMTP_PASS;
    const port = Number(process.env.MAIL_SMTP_PORT || '587');

    if (!host || !user || !password) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass: password },
    });
  }

  private getFromAddress() {
    const email = process.env.MAIL_FROM_EMAIL || `noreply@${new URL(getAppBaseUrl()).hostname}`;
    const name = process.env.MAIL_FROM_NAME || 'Reclu';
    return `${name} <${email}>`;
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  generateDrivingForcesInvitationEmail(
    recipientName: string,
    senderName: string,
    evaluationTitle: string,
    evaluationLink: string,
    expiryDays: number = 30
  ): { subject: string; html: string } {
    const subject = `Invitación para Evaluación Driving Forces - ${evaluationTitle}`;
    
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitación Evaluación Driving Forces</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #fff;
            padding: 30px;
            border: 1px solid #e1e5e9;
            border-top: none;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border: 1px solid #e1e5e9;
            border-top: none;
            border-radius: 0 0 10px 10px;
            font-size: 14px;
            color: #6c757d;
          }
          .button {
            display: inline-block;
            background: #8b5cf6;
            color: #ffffff !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
          .button:hover {
            background: #7c3aed;
          }
          .info-box {
            background: #faf5ff;
            border: 1px solid #8b5cf6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 Evaluación Driving Forces</h1>
          <p>Sistema Reclu de Evaluación de Fuerzas Motivacionales</p>
        </div>
        
        <div class="content">
          <h2>Hola ${recipientName},</h2>
          
          <p>Has sido invitado/a por <strong>${senderName}</strong> a completar una evaluación Driving Forces para el siguiente propósito:</p>
          
          <div class="info-box">
            <h3>🎯 ${evaluationTitle}</h3>
            <p><strong>¿Qué es la evaluación Driving Forces?</strong></p>
            <p>La evaluación Driving Forces identifica las 12 fuerzas motivacionales que impulsan tus acciones y decisiones:</p>
            <ul>
              <li><strong>Fuerzas Internas:</strong> Intelectual, Instintivo, Práctico, Altruista</li>
              <li><strong>Fuerzas Externas:</strong> Armonioso, Objetivo, Benévolo, Intencional</li>
              <li><strong>Fuerzas Interpersonales:</strong> Dominante, Colaborativo, Estructurado, Receptivo</li>
            </ul>
          </div>
          
          <p><strong>⏱️ Tiempo estimado:</strong> 15-20 minutos</p>
          <p><strong>📝 Preguntas:</strong> 10 situaciones de ranking motivacional</p>
          <p><strong>🎯 Objetivo:</strong> Identificar tus fuerzas motivacionales principales</p>
          
          <div style="text-align: center;">
            <a href="${evaluationLink}" class="button" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
              🚀 Comenzar Evaluación
            </a>
          </div>
          
          <div class="warning">
            ⚠️ <strong>Importante:</strong> Este enlace es personal e intransferible, y expirará en <strong>${expiryDays} días</strong> por motivos de seguridad.
          </div>
          
          <p><strong>Instrucciones:</strong></p>
          <ol>
            <li>Haz clic en el botón "Comenzar Evaluación"</li>
            <li>Lee cada grupo de afirmaciones cuidadosamente</li>
            <li>Ordena las 4 opciones del 1 al 4 según tu preferencia:</li>
            <ul>
              <li><strong>1:</strong> Más como tú</li>
              <li><strong>2:</strong> Segundo más como tú</li>
              <li><strong>3:</strong> Tercer más como tú</li>
              <li><strong>4:</strong> Menos como tú</li>
            </ul>
            <li>Responde de manera honesta y espontánea</li>
          </ol>
          
          <p><strong>💡 Consejos:</strong></p>
          <ul>
            <li>No hay respuestas correctas o incorrectas</li>
            <li>Responde basándote en lo que te motiva realmente</li>
            <li>Piensa en tu comportamiento en el trabajo o situaciones profesionales</li>
            <li>Mantén un ambiente tranquilo durante la evaluación</li>
          </ul>
          
          <p>Una vez completada la evaluación, los resultados estarán disponibles para ${senderName} quien podrá compartir contigo un reporte detallado de tu perfil motivacional.</p>
          
          <p>Si tienes alguna pregunta sobre esta evaluación, no dudes en contactar directamente a ${senderName}.</p>
          
          <p>¡Gracias por tu participación!</p>
        </div>
        
        <div class="footer">
          <p><strong>Reclu System</strong></p>
          <p>Sistema Profesional de Evaluaciones Psicométricas</p>
          <p>Este correo fue enviado automáticamente. Por favor no respondas a esta dirección.</p>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  generateEvaluationInvitationEmail(
    recipientName: string,
    senderName: string,
    evaluationTitle: string,
    evaluationLink: string,
    expiryDays: number = 7
  ): { subject: string; html: string } {
    const subject = `Invitación para Evaluación DISC - ${evaluationTitle}`;
    
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitación Evaluación DISC</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #fff;
            padding: 30px;
            border: 1px solid #e1e5e9;
            border-top: none;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border: 1px solid #e1e5e9;
            border-top: none;
            border-radius: 0 0 10px 10px;
            font-size: 14px;
            color: #6c757d;
          }
          .button {
            display: inline-block;
            background: #4f46e5;
            color: #ffffff !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
          .button:hover {
            background: #4338ca;
          }
          .info-box {
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🧠 Evaluación DISC</h1>
          <p>Sistema Reclu de Evaluación Psicométrica</p>
        </div>
        
        <div class="content">
          <h2>Hola ${recipientName},</h2>
          
          <p>Has sido invitado/a por <strong>${senderName}</strong> a completar una evaluación DISC para el siguiente propósito:</p>
          
          <div class="info-box">
            <h3>📋 ${evaluationTitle}</h3>
            <p><strong>¿Qué es la evaluación DISC?</strong></p>
            <p>DISC es una herramienta de evaluación psicométrica que analiza tu estilo de personalidad y comportamiento en cuatro dimensiones principales:</p>
            <ul>
              <li><strong>D - Dominante:</strong> Orientado a resultados y desafíos</li>
              <li><strong>I - Influyente:</strong> Orientado a personas e interacción</li>
              <li><strong>S - Estable:</strong> Orientado a estabilidad y cooperación</li>
              <li><strong>C - Concienzudo:</strong> Orientado a precisión y calidad</li>
            </ul>
          </div>
          
          <p><strong>⏱️ Tiempo estimado:</strong> 10-15 minutos</p>
          <p><strong>📝 Preguntas:</strong> 24 situaciones a evaluar</p>
          <p><strong>🎯 Objetivo:</strong> Identificar tu perfil de personalidad y fortalezas</p>
          
          <div style="text-align: center;">
            <a href="${evaluationLink}" class="button" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
              🚀 Comenzar Evaluación
            </a>
          </div>
          
          <div class="warning">
            ⚠️ <strong>Importante:</strong> Este enlace es personal e intransferible, y expirará en <strong>${expiryDays} días</strong> por motivos de seguridad.
          </div>
          
          <p><strong>Instrucciones:</strong></p>
          <ol>
            <li>Haz clic en el botón "Comenzar Evaluación"</li>
            <li>Lee cada situación cuidadosamente</li>
            <li>Selecciona la opción que MÁS se parece a ti</li>
            <li>Selecciona la opción que MENOS se parece a ti</li>
            <li>Responde de manera honesta y espontánea</li>
          </ol>
          
          <p><strong>💡 Consejos:</strong></p>
          <ul>
            <li>No hay respuestas correctas o incorrectas</li>
            <li>Responde basándote en tu comportamiento natural</li>
            <li>No pienses demasiado cada respuesta</li>
            <li>Mantén un ambiente tranquilo durante la evaluación</li>
          </ul>
          
          <p>Una vez completada la evaluación, los resultados estarán disponibles para ${senderName} quien podrá compartir contigo un reporte detallado de tu perfil DISC.</p>
          
          <p>Si tienes alguna pregunta sobre esta evaluación, no dudes en contactar directamente a ${senderName}.</p>
          
          <p>¡Gracias por tu participación!</p>
        </div>
        
        <div class="footer">
          <p><strong>Reclu System</strong></p>
          <p>Sistema Profesional de Evaluaciones Psicométricas</p>
          <p>Este correo fue enviado automáticamente. Por favor no respondas a esta dirección.</p>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  // Send EQ evaluation invitation
  async sendEQEvaluationInvitation(options: {
    recipientEmail: string;
    recipientName: string;
    senderName: string;
    companyName: string;
    evaluationToken: string;
  }): Promise<boolean> {
    const { recipientEmail, recipientName, senderName, companyName, evaluationToken } = options;
    
    const baseUrl = getAppBaseUrl();
    const evaluationLink = `${baseUrl}/external-eq-evaluation/${evaluationToken}`;
    
    const { subject, html } = this.generateEQInvitationEmail(
      recipientName,
      senderName,
      `Evaluación de Inteligencia Emocional - ${companyName}`,
      evaluationLink,
      30
    );
    
    return this.sendEmail({
      to: recipientEmail,
      subject,
      html,
    });
  }

  generateEQInvitationEmail(
    recipientName: string,
    senderName: string,
    evaluationTitle: string,
    evaluationLink: string,
    expiryDays: number = 30
  ): { subject: string; html: string } {
    const subject = `Invitación para Evaluación de Inteligencia Emocional (EQ) - ${evaluationTitle}`;
    
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitación Evaluación EQ</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #fff;
            padding: 30px;
            border: 1px solid #e1e5e9;
            border-top: none;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border: 1px solid #e1e5e9;
            border-top: none;
            border-radius: 0 0 10px 10px;
            font-size: 14px;
            color: #6c757d;
          }
          .button {
            display: inline-block;
            background: #ec4899;
            color: #ffffff !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
          .button:hover {
            background: #db2777;
          }
          .info-box {
            background: #fdf2f8;
            border: 1px solid #ec4899;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
          .dimension {
            background: #f9fafb;
            border-radius: 6px;
            padding: 10px 15px;
            margin: 8px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>❤️ Evaluación de Inteligencia Emocional</h1>
          <p>Sistema Reclu - Evaluación EQ</p>
        </div>
        
        <div class="content">
          <h2>Hola ${recipientName},</h2>
          
          <p>Has sido invitado/a por <strong>${senderName}</strong> a completar una evaluación de Inteligencia Emocional:</p>
          
          <div class="info-box">
            <h3>❤️ ${evaluationTitle}</h3>
            <p><strong>¿Qué mide esta evaluación?</strong></p>
            <p>La Inteligencia Emocional (EQ) es la capacidad de reconocer, entender y manejar nuestras emociones y las de los demás. Esta evaluación mide 5 dimensiones clave:</p>
            
            <div class="dimension">
              <strong>🔴 Autoconciencia:</strong> Reconocer tus propias emociones y su impacto
            </div>
            <div class="dimension">
              <strong>🟠 Autorregulación:</strong> Manejar impulsos y emociones de manera efectiva
            </div>
            <div class="dimension">
              <strong>🟡 Motivación:</strong> Impulso interno para alcanzar metas
            </div>
            <div class="dimension">
              <strong>🟢 Empatía:</strong> Comprender las emociones de los demás
            </div>
            <div class="dimension">
              <strong>🔵 Habilidades Sociales:</strong> Gestionar relaciones de manera efectiva
            </div>
          </div>
          
          <p><strong>⏱️ Tiempo estimado:</strong> 10-12 minutos</p>
          <p><strong>📝 Preguntas:</strong> 25 afirmaciones para evaluar</p>
          <p><strong>🎯 Objetivo:</strong> Identificar tus fortalezas emocionales y áreas de desarrollo</p>
          
          <div style="text-align: center;">
            <a href="${evaluationLink}" class="button" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
              🚀 Comenzar Evaluación
            </a>
          </div>
          
          <div class="warning">
            ⚠️ <strong>Importante:</strong> Este enlace es personal e intransferible, y expirará en <strong>${expiryDays} días</strong> por motivos de seguridad.
          </div>
          
          <p><strong>Instrucciones:</strong></p>
          <ol>
            <li>Haz clic en el botón "Comenzar Evaluación"</li>
            <li>Lee cada afirmación cuidadosamente</li>
            <li>Indica qué tan de acuerdo estás en una escala del 1 al 5:</li>
            <ul>
              <li><strong>1:</strong> Totalmente en desacuerdo</li>
              <li><strong>2:</strong> En desacuerdo</li>
              <li><strong>3:</strong> Neutral</li>
              <li><strong>4:</strong> De acuerdo</li>
              <li><strong>5:</strong> Totalmente de acuerdo</li>
            </ul>
            <li>Responde de manera honesta y reflexiva</li>
          </ol>
          
          <p><strong>💡 Consejos:</strong></p>
          <ul>
            <li>No hay respuestas correctas o incorrectas</li>
            <li>Responde según cómo actúas normalmente, no cómo te gustaría actuar</li>
            <li>Piensa en situaciones reales de trabajo o vida personal</li>
            <li>Sé honesto/a contigo mismo/a para obtener resultados precisos</li>
          </ul>
          
          <p>Una vez completada la evaluación, los resultados estarán disponibles para ${senderName} quien podrá compartir contigo un reporte detallado de tu perfil de Inteligencia Emocional.</p>
          
          <p>Si tienes alguna pregunta, contacta directamente a ${senderName}.</p>
          
          <p>¡Gracias por tu participación!</p>
        </div>
        
        <div class="footer">
          <p><strong>Reclu System</strong></p>
          <p>Sistema Profesional de Evaluaciones de Talento</p>
          <p>Este correo fue enviado automáticamente. Por favor no respondas a esta dirección.</p>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  // Send DNA-25 evaluation invitation
  async sendDNAEvaluationInvitation(options: {
    recipientEmail: string;
    recipientName: string;
    senderName: string;
    companyName: string;
    evaluationToken: string;
  }): Promise<boolean> {
    const { recipientEmail, recipientName, senderName, companyName, evaluationToken } = options;
    
    const baseUrl = getAppBaseUrl();
    const evaluationLink = `${baseUrl}/external-dna-evaluation/${evaluationToken}`;
    
    const { subject, html } = this.generateDNAInvitationEmail(
      recipientName,
      senderName,
      `Evaluación de Competencias DNA-25 - ${companyName}`,
      evaluationLink,
      30
    );
    
    return this.sendEmail({
      to: recipientEmail,
      subject,
      html,
    });
  }

  generateDNAInvitationEmail(
    recipientName: string,
    senderName: string,
    evaluationTitle: string,
    evaluationLink: string,
    expiryDays: number = 30
  ): { subject: string; html: string } {
    const subject = `Invitación para Evaluación de Competencias DNA-25 - ${evaluationTitle}`;
    
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitación Evaluación DNA-25</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #fff;
            padding: 30px;
            border: 1px solid #e1e5e9;
            border-top: none;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border: 1px solid #e1e5e9;
            border-top: none;
            border-radius: 0 0 10px 10px;
            font-size: 14px;
            color: #6c757d;
          }
          .button {
            display: inline-block;
            background: #6366f1;
            color: #ffffff !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
          }
          .button:hover {
            background: #4f46e5;
          }
          .info-box {
            background: #eef2ff;
            border: 1px solid #6366f1;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
          }
          .category {
            background: #f9fafb;
            border-radius: 6px;
            padding: 10px 15px;
            margin: 8px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🧬 Evaluación de Competencias DNA-25</h1>
          <p>Sistema Reclu - Evaluación de Competencias</p>
        </div>
        
        <div class="content">
          <h2>Hola ${recipientName},</h2>
          
          <p>Has sido invitado/a por <strong>${senderName}</strong> a completar una evaluación de Competencias DNA-25:</p>
          
          <div class="info-box">
            <h3>🧬 ${evaluationTitle}</h3>
            <p><strong>¿Qué mide esta evaluación?</strong></p>
            <p>DNA-25 evalúa 25 competencias clave agrupadas en 5 categorías que determinan tu efectividad profesional:</p>
            
            <div class="category">
              <strong>🧠 Pensamiento:</strong> Análisis, resolución de problemas, creatividad, pensamiento estratégico, toma de decisiones
            </div>
            <div class="category">
              <strong>💬 Comunicación:</strong> Comunicación escrita y verbal, presentaciones, influencia, negociación
            </div>
            <div class="category">
              <strong>👥 Liderazgo:</strong> Liderazgo, desarrollo de personas, gestión de conflictos, adaptabilidad, visión de negocio
            </div>
            <div class="category">
              <strong>🎯 Resultados:</strong> Orientación al logro, gestión del tiempo, planificación, atención al detalle
            </div>
            <div class="category">
              <strong>🤝 Relacionamiento:</strong> Trabajo en equipo, servicio al cliente, relaciones, resiliencia, responsabilidad
            </div>
          </div>
          
          <p style="text-align: center;">
            <a href="${evaluationLink}" class="button" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Comenzar Evaluación DNA-25</a>
          </p>
          
          <div class="warning">
            ⚠️ <strong>Importante:</strong> Este enlace es válido por ${expiryDays} días. Asegúrate de completar la evaluación antes de que expire.
          </div>
          
          <h3>📋 Instrucciones:</h3>
          <ol>
            <li>La evaluación contiene 25 preguntas (una por competencia)</li>
            <li>Tiempo estimado: 10-15 minutos</li>
            <li>Cada pregunta usa una escala de 1 a 5:
            <ul>
              <li><strong>1:</strong> Nunca</li>
              <li><strong>2:</strong> Raramente</li>
              <li><strong>3:</strong> A veces</li>
              <li><strong>4:</strong> Frecuentemente</li>
              <li><strong>5:</strong> Siempre</li>
            </ul>
            <li>Responde de manera honesta y reflexiva</li>
          </ol>
          
          <p><strong>💡 Consejos:</strong></p>
          <ul>
            <li>No hay respuestas correctas o incorrectas</li>
            <li>Piensa en cómo actúas realmente, no cómo te gustaría actuar</li>
            <li>Considera situaciones de trabajo recientes</li>
            <li>Sé honesto/a para obtener resultados precisos y útiles</li>
          </ul>
          
          <p>Una vez completada la evaluación, los resultados estarán disponibles para ${senderName} quien podrá compartir contigo un reporte detallado de tu perfil de competencias.</p>
          
          <p>Si tienes alguna pregunta, contacta directamente a ${senderName}.</p>
          
          <p>¡Gracias por tu participación!</p>
        </div>
        
        <div class="footer">
          <p><strong>Reclu System</strong></p>
          <p>Sistema Profesional de Evaluaciones de Talento</p>
          <p>Este correo fue enviado automáticamente. Por favor no respondas a esta dirección.</p>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  // Acumen Invitation Email
  async sendAcumenInvitation(options: {
    to: string;
    recipientName: string;
    senderName: string;
    evaluationLink: string;
    expiryDate: Date;
  }): Promise<boolean> {
    const { to, recipientName, senderName, evaluationLink, expiryDate } = options;
    const expiryDays = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    const { subject, html } = this.generateAcumenInvitationEmail({
      recipientName,
      senderName,
      evaluationLink,
      expiryDays,
      evaluationTitle: 'Evaluación Acumen - Capacidad de Juicio',
    });

    return this.sendEmail({ to, subject, html });
  }

  generateAcumenInvitationEmail(options: {
    recipientName: string;
    senderName: string;
    evaluationLink: string;
    expiryDays: number;
    evaluationTitle: string;
  }) {
    const { recipientName, senderName, evaluationLink, expiryDays, evaluationTitle } = options;

    const subject = `🎯 Invitación: Evaluación Acumen de ${senderName} - Reclu`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f3f4f6; }
          .header { background: linear-gradient(135deg, #0891b2, #0e7490, #155e75); padding: 30px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header p { color: #cffafe; margin: 10px 0 0 0; }
          .content { padding: 30px 20px; max-width: 600px; margin: 0 auto; background: white; }
          .button { display: inline-block; background: linear-gradient(135deg, #0891b2, #0e7490); color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px; }
          .info-box { background: #ecfeff; border: 1px solid #0891b2; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 14px; }
          .dimension { background: #f9fafb; border-radius: 6px; padding: 10px 15px; margin: 8px 0; border-left: 4px solid #0891b2; }
          .external { border-left-color: #0891b2; }
          .internal { border-left-color: #7c3aed; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 Evaluación Acumen</h1>
          <p>Sistema Reclu - Índice de Capacidad de Juicio</p>
        </div>
        
        <div class="content">
          <h2>Hola ${recipientName},</h2>
          
          <p>Has sido invitado/a por <strong>${senderName}</strong> a completar una evaluación de Acumen (ACI):</p>
          
          <div class="info-box">
            <h3>🎯 ${evaluationTitle}</h3>
            <p><strong>¿Qué mide esta evaluación?</strong></p>
            <p>Acumen mide tu capacidad de juicio, claridad perceptual y toma de decisiones en 6 dimensiones clave:</p>
            
            <p><strong>🌍 Factores Externos:</strong></p>
            <div class="dimension external">
              <strong>👥 Comprensión de Otros:</strong> Capacidad para percibir y evaluar a las personas
            </div>
            <div class="dimension external">
              <strong>🔧 Pensamiento Práctico:</strong> Habilidad para evaluar situaciones concretas
            </div>
            <div class="dimension external">
              <strong>⚙️ Juicio de Sistemas:</strong> Capacidad para comprender reglas y procesos
            </div>
            
            <p><strong>🧘 Factores Internos:</strong></p>
            <div class="dimension internal">
              <strong>🪞 Sentido de Sí Mismo:</strong> Autoconocimiento y autovaloración
            </div>
            <div class="dimension internal">
              <strong>🎭 Conciencia del Rol:</strong> Comprensión de tu posición y responsabilidades
            </div>
            <div class="dimension internal">
              <strong>🧭 Auto-dirección:</strong> Capacidad para establecer y perseguir metas
            </div>
          </div>
          
          <p style="text-align: center;">
            <a href="${evaluationLink}" class="button" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Comenzar Evaluación Acumen</a>
          </p>
          
          <div class="warning">
            ⚠️ <strong>Importante:</strong> Este enlace es válido por ${expiryDays} días. Asegúrate de completar la evaluación antes de que expire.
          </div>
          
          <h3>📋 Instrucciones:</h3>
          <ol>
            <li>La evaluación contiene 30 preguntas</li>
            <li>Tiempo estimado: 15-20 minutos</li>
            <li>Cada pregunta usa una escala de frecuencia:
              <ul>
                <li><strong>1:</strong> Nunca</li>
                <li><strong>2:</strong> Raramente</li>
                <li><strong>3:</strong> A veces</li>
                <li><strong>4:</strong> Frecuentemente</li>
                <li><strong>5:</strong> Siempre</li>
              </ul>
            </li>
            <li>Responde de manera honesta y reflexiva</li>
          </ol>
          
          <p><strong>💡 Consejos:</strong></p>
          <ul>
            <li>No hay respuestas correctas o incorrectas</li>
            <li>Piensa en cómo actúas realmente en situaciones cotidianas</li>
            <li>Considera tanto situaciones laborales como personales</li>
            <li>Sé honesto/a para obtener un perfil preciso de tu capacidad de juicio</li>
          </ul>
          
          <p>Una vez completada la evaluación, los resultados estarán disponibles para ${senderName} quien podrá compartir contigo un reporte detallado de tu índice de capacidad de juicio.</p>
          
          <p>Si tienes alguna pregunta, contacta directamente a ${senderName}.</p>
          
          <p>¡Gracias por tu participación!</p>
        </div>
        
        <div class="footer">
          <p><strong>Reclu System</strong></p>
          <p>Sistema Profesional de Evaluaciones de Talento</p>
          <p>Este correo fue enviado automáticamente. Por favor no respondas a esta dirección.</p>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  // Values & Integrity Invitation
  async sendValuesInvitation(options: {
    to: string;
    recipientName: string;
    senderName: string;
    evaluationLink: string;
    expiryDate: Date;
  }): Promise<boolean> {
    const { to, recipientName, senderName, evaluationLink, expiryDate } = options;
    const expiryDays = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    const { subject, html } = this.generateValuesInvitationEmail({
      recipientName,
      senderName,
      evaluationLink,
      expiryDays,
      evaluationTitle: 'Evaluación de Valores e Integridad',
    });

    return this.sendEmail({ to, subject, html });
  }

  generateValuesInvitationEmail(options: {
    recipientName: string;
    senderName: string;
    evaluationLink: string;
    expiryDays: number;
    evaluationTitle: string;
  }) {
    const { recipientName, senderName, evaluationLink, expiryDays, evaluationTitle } = options;

    const subject = `⚖️ Invitación: Evaluación de Valores de ${senderName} - Reclu`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f3f4f6; }
          .header { background: linear-gradient(135deg, #7c3aed, #8b5cf6, #a855f7); padding: 30px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header p { color: #e9d5ff; margin: 10px 0 0 0; }
          .content { padding: 30px 20px; max-width: 600px; margin: 0 auto; background: white; }
          .button { display: inline-block; background: linear-gradient(135deg, #7c3aed, #8b5cf6); color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px; }
          .info-box { background: #f5f3ff; border: 1px solid #7c3aed; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 14px; }
          .dimension { background: #f9fafb; border-radius: 6px; padding: 10px 15px; margin: 8px 0; border-left: 4px solid #7c3aed; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>⚖️ Evaluación de Valores</h1>
          <p>Sistema Reclu - Descubre tus Motivadores Internos</p>
        </div>
        
        <div class="content">
          <h2>Hola ${recipientName},</h2>
          
          <p>Has sido invitado/a por <strong>${senderName}</strong> a completar una evaluación de Valores e Integridad:</p>
          
          <div class="info-box">
            <h3>⚖️ ${evaluationTitle}</h3>
            <p><strong>¿Qué mide esta evaluación?</strong></p>
            <p>Esta evaluación identifica tus valores fundamentales y cómo influyen en tu comportamiento y decisiones. Mide 6 dimensiones de valores:</p>
            
            <div class="dimension">
              <strong>📚 Teórico:</strong> Pasión por el conocimiento y la búsqueda de la verdad
            </div>
            <div class="dimension">
              <strong>💰 Utilitario:</strong> Enfoque en el retorno de inversión y resultados prácticos
            </div>
            <div class="dimension">
              <strong>🎨 Estético:</strong> Apreciación por la forma, armonía y experiencias creativas
            </div>
            <div class="dimension">
              <strong>🤝 Social:</strong> Motivación por ayudar y contribuir al bienestar de otros
            </div>
            <div class="dimension">
              <strong>👑 Individualista:</strong> Búsqueda de poder, reconocimiento e influencia
            </div>
            <div class="dimension">
              <strong>⚖️ Tradicional:</strong> Valoración del orden, sistemas y tradiciones
            </div>
          </div>
          
          <p style="text-align: center;">
            <a href="${evaluationLink}" class="button" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Comenzar Evaluación de Valores</a>
          </p>
          
          <div class="warning">
            ⚠️ <strong>Importante:</strong> Este enlace es válido por ${expiryDays} días. Asegúrate de completar la evaluación antes de que expire.
          </div>
          
          <h3>📋 Instrucciones:</h3>
          <ol>
            <li>La evaluación contiene 30 preguntas</li>
            <li>Tiempo estimado: 10-15 minutos</li>
            <li>Cada pregunta usa una escala de frecuencia:
              <ul>
                <li><strong>1:</strong> Nunca</li>
                <li><strong>2:</strong> Raramente</li>
                <li><strong>3:</strong> A veces</li>
                <li><strong>4:</strong> Frecuentemente</li>
                <li><strong>5:</strong> Siempre</li>
              </ul>
            </li>
            <li>Responde de manera honesta y reflexiva</li>
          </ol>
          
          <p><strong>💡 Consejos:</strong></p>
          <ul>
            <li>No hay respuestas correctas o incorrectas</li>
            <li>Piensa en lo que realmente valoras, no en lo que crees que deberías valorar</li>
            <li>Considera tanto tu vida personal como profesional</li>
            <li>Sé honesto/a para obtener un perfil preciso de tus valores</li>
          </ul>
          
          <p>Una vez completada la evaluación, los resultados estarán disponibles para ${senderName} quien podrá compartir contigo un reporte detallado de tu perfil de valores.</p>
          
          <p>Si tienes alguna pregunta, contacta directamente a ${senderName}.</p>
          
          <p>¡Gracias por tu participación!</p>
        </div>
        
        <div class="footer">
          <p><strong>Reclu System</strong></p>
          <p>Sistema Profesional de Evaluaciones de Talento</p>
          <p>Este correo fue enviado automáticamente. Por favor no respondas a esta dirección.</p>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  async sendStressInvitation(options: {
    to: string;
    recipientName: string;
    senderName: string;
    evaluationLink: string;
    expiryDate: Date;
  }): Promise<boolean> {
    const { to, recipientName, senderName, evaluationLink, expiryDate } = options;
    const expiryDays = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    
    const { subject, html } = this.generateStressInvitationEmail({
      recipientName,
      senderName,
      evaluationLink,
      expiryDays,
      evaluationTitle: 'Evaluación de Estrés y Resiliencia',
    });

    return this.sendEmail({ to, subject, html });
  }

  generateStressInvitationEmail(options: {
    recipientName: string;
    senderName: string;
    evaluationLink: string;
    expiryDays: number;
    evaluationTitle: string;
  }) {
    const { recipientName, senderName, evaluationLink, expiryDays, evaluationTitle } = options;

    const subject = `🧘 Invitación: Evaluación de Estrés y Resiliencia de ${senderName} - Reclu`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f3f4f6; }
          .header { background: linear-gradient(135deg, #e11d48, #f97316, #f59e0b); padding: 30px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header p { color: #fecdd3; margin: 10px 0 0 0; }
          .content { padding: 30px 20px; max-width: 600px; margin: 0 auto; background: white; }
          .button { display: inline-block; background: linear-gradient(135deg, #e11d48, #f97316); color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px; }
          .info-box { background: #fff1f2; border: 1px solid #e11d48; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 14px; }
          .dimension { background: #f9fafb; border-radius: 6px; padding: 10px 15px; margin: 8px 0; border-left: 4px solid #e11d48; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🧘 Evaluación de Estrés y Resiliencia</h1>
          <p>Sistema Reclu - Descubre tu Perfil de Bienestar</p>
        </div>
        
        <div class="content">
          <h2>Hola ${recipientName},</h2>
          
          <p>Has sido invitado/a por <strong>${senderName}</strong> a completar una evaluación de Estrés y Resiliencia:</p>
          
          <div class="info-box">
            <h3>🧘 ${evaluationTitle}</h3>
            <p><strong>¿Qué mide esta evaluación?</strong></p>
            <p>Esta evaluación analiza tu relación con el estrés y tu capacidad de recuperación. Mide 5 dimensiones clave:</p>
            
            <div class="dimension">
              <strong>⚡ Estrés Laboral:</strong> Nivel de presión y tensión relacionada con el trabajo
            </div>
            <div class="dimension">
              <strong>🛟 Capacidad de Recuperación:</strong> Habilidad para descansar y recargar energías
            </div>
            <div class="dimension">
              <strong>💜 Manejo Emocional:</strong> Control y expresión saludable de emociones
            </div>
            <div class="dimension">
              <strong>⚖️ Equilibrio Vida-Trabajo:</strong> Balance entre lo personal y profesional
            </div>
            <div class="dimension">
              <strong>🛡️ Resiliencia General:</strong> Capacidad de adaptación ante adversidades
            </div>
          </div>
          
          <p style="text-align: center;">
            <a href="${evaluationLink}" class="button" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Comenzar Evaluación de Estrés</a>
          </p>
          
          <div class="warning">
            ⚠️ <strong>Importante:</strong> Este enlace es válido por ${expiryDays} días. Asegúrate de completar la evaluación antes de que expire.
          </div>
          
          <h3>📋 Instrucciones:</h3>
          <ol>
            <li>La evaluación contiene 30 preguntas</li>
            <li>Toma aproximadamente 10-12 minutos</li>
            <li>Responde honestamente según cómo te has sentido últimamente</li>
            <li>No hay respuestas correctas o incorrectas</li>
            <li>Busca un ambiente tranquilo para completarla</li>
          </ol>
          
          <p style="margin-top: 20px;">Esta evaluación te ayudará a:</p>
          <ul>
            <li>Identificar tus niveles actuales de estrés</li>
            <li>Conocer tu capacidad de resiliencia</li>
            <li>Descubrir factores de riesgo y protección</li>
            <li>Recibir recomendaciones personalizadas</li>
          </ul>
          
          <p style="margin-top: 20px; color: #666;">
            Si tienes alguna duda, contacta a ${senderName} directamente.
          </p>
        </div>
        
        <div class="footer">
          <p><strong>Reclu System</strong></p>
          <p>Sistema Profesional de Evaluaciones de Talento</p>
          <p>Este correo fue enviado automáticamente. Por favor no respondas a esta dirección.</p>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  // Método para generar email combinado con múltiples evaluaciones
  generateCombinedEvaluationsEmail(options: {
    recipientName: string;
    senderName: string;
    evaluations: Array<{
      type: string;
      name: string;
      description: string;
      link: string;
      questions: number;
      time: string;
      icon: string;
      color: string;
    }>;
    expiryDays: number;
  }): { subject: string; html: string } {
    const { recipientName, senderName, evaluations, expiryDays } = options;

    const subject = `🎯 ${evaluations.length} Evaluaciones de Talento - Reclu`;

    const evaluationCards = evaluations.map(eval_ => `
      <div style="background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-radius: 12px; padding: 20px; margin: 15px 0; border-left: 4px solid ${eval_.color};">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <span style="font-size: 24px;">${eval_.icon}</span>
          <div>
            <h3 style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${eval_.name}</h3>
            <p style="margin: 4px 0 0 0; color: #64748b; font-size: 13px;">${eval_.description}</p>
          </div>
        </div>
        <div style="display: flex; gap: 16px; font-size: 12px; color: #64748b; margin-bottom: 12px;">
          <span>📝 ${eval_.questions} preguntas</span>
          <span>⏱️ ${eval_.time}</span>
        </div>
        <a href="${eval_.link}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
          Comenzar ${eval_.name}
        </a>
      </div>
    `).join('');

    const totalQuestions = evaluations.reduce((sum, e) => sum + e.questions, 0);
    const totalTime = evaluations.length * 12;

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Evaluaciones Reclu</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f3f4f6;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 16px 16px 0 0;">
          <h1 style="margin: 0; font-size: 26px;">🎯 Evaluaciones de Talento</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Sistema Reclu - Evaluación Integral</p>
        </div>
        
        <!-- Content -->
        <div style="background: white; padding: 30px; border: 1px solid #e1e5e9; border-top: none;">
          <h2 style="color: #1e293b; margin-top: 0;">Hola ${recipientName},</h2>
          
          <p style="color: #475569;">
            <strong>${senderName}</strong> te ha invitado a completar <strong>${evaluations.length} evaluaciones</strong> de talento. 
            Estas evaluaciones te ayudarán a conocer mejor tus fortalezas, motivaciones y competencias.
          </p>
          
          <!-- Stats Summary -->
          <div style="display: flex; gap: 16px; background: linear-gradient(135deg, #f0fdf4, #dcfce7); padding: 16px; border-radius: 12px; margin: 20px 0; border: 1px solid #86efac;">
            <div style="flex: 1; text-align: center;">
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: #16a34a;">${evaluations.length}</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #166534;">Evaluaciones</p>
            </div>
            <div style="flex: 1; text-align: center; border-left: 1px solid #86efac;">
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: #16a34a;">${totalQuestions}</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #166534;">Preguntas totales</p>
            </div>
            <div style="flex: 1; text-align: center; border-left: 1px solid #86efac;">
              <p style="margin: 0; font-size: 24px; font-weight: bold; color: #16a34a;">~${totalTime}</p>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #166534;">Minutos aprox.</p>
            </div>
          </div>
          
          <h3 style="color: #1e293b; margin-bottom: 16px;">📋 Tus Evaluaciones:</h3>
          
          ${evaluationCards}
          
          <!-- Instructions -->
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-weight: 600; color: #92400e;">⚠️ Importante:</p>
            <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #a16207;">
              <li>Los enlaces son <strong>personales e intransferibles</strong></li>
              <li>Válidos por <strong>${expiryDays} días</strong></li>
              <li>Puedes completar las evaluaciones <strong>en el orden que prefieras</strong></li>
              <li>No necesitas terminarlas todas el mismo día</li>
            </ul>
          </div>
          
          <h3 style="color: #1e293b;">💡 Consejos para completar las evaluaciones:</h3>
          <ul style="color: #475569;">
            <li>Busca un lugar tranquilo sin distracciones</li>
            <li>No hay respuestas correctas o incorrectas</li>
            <li>Responde de manera honesta y espontánea</li>
            <li>Piensa en tu comportamiento habitual, no en cómo te gustaría ser</li>
          </ul>
          
          <p style="color: #475569;">
            Una vez completadas, los resultados estarán disponibles para <strong>${senderName}</strong>, 
            quien podrá compartir contigo reportes detallados de tu perfil.
          </p>
          
          <p style="color: #475569;">
            Si tienes alguna pregunta, contacta directamente a ${senderName}.
          </p>
          
          <p style="color: #475569; font-weight: 500;">¡Gracias por tu participación!</p>
        </div>
        
        <!-- Footer -->
        <div style="background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; border-radius: 0 0 16px 16px; font-size: 14px;">
          <p style="margin: 0; font-weight: 600; color: white;">Reclu System</p>
          <p style="margin: 4px 0 0 0;">Sistema Profesional de Evaluaciones de Talento</p>
          <p style="margin: 8px 0 0 0; font-size: 12px;">Este correo fue enviado automáticamente. Por favor no respondas a esta dirección.</p>
        </div>
      </body>
      </html>
    `;

    return { subject, html };
  }

  // Technical Evaluation Invitation Email
  async sendTechnicalInvitationEmail(
    recipientEmail: string,
    recipientName: string,
    token: string,
    jobPositionTitle: string,
    senderName: string
  ): Promise<boolean> {
    const baseUrl = getAppBaseUrl();
    const evaluationUrl = `${baseUrl}/external-technical-evaluation/${token}`;

    const subject = `Evaluación Técnica - ${jobPositionTitle} | Reclu`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f3f4f6; }
          .header { background: linear-gradient(135deg, #0ea5e9, #0284c7); padding: 30px 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 28px; }
          .header p { color: #e0f2fe; margin: 10px 0 0 0; }
          .content { padding: 30px 20px; max-width: 600px; margin: 0 auto; background: white; }
          .info-box { background: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px; padding: 20px; margin: 20px 0; }
          .info-box h3 { color: #0369a1; margin: 0 0 10px 0; }
          .info-box ul { margin: 0; padding-left: 20px; }
          .info-box li { margin: 8px 0; color: #0c4a6e; }
          .button { display: inline-block; background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white !important; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px; }
          .position-badge { display: inline-block; background: #0ea5e9; color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>💼 Evaluación Técnica</h1>
          <p>Reclu - Sistema de Evaluación de Competencias</p>
        </div>
        
        <div class="content">
          <p>Hola <strong>${recipientName}</strong>,</p>
          
          <p><strong>${senderName}</strong> te ha invitado a completar una evaluación técnica para el cargo de:</p>
          
          <p style="text-align: center;">
            <span class="position-badge">${jobPositionTitle}</span>
          </p>
          
          <div class="info-box">
            <h3>📋 Sobre esta evaluación</h3>
            <ul>
              <li>20 preguntas de opción múltiple</li>
              <li>Evalúa conocimientos técnicos específicos del cargo</li>
              <li>Tiempo estimado: 25-35 minutos</li>
              <li>Lee cada pregunta cuidadosamente antes de responder</li>
            </ul>
          </div>
          
          <p style="text-align: center;">
            <a href="${evaluationUrl}" class="button" style="color: #ffffff !important;">Iniciar Evaluación Técnica</a>
          </p>
          
          <p style="color: #6b7280; font-size: 14px;">
            <strong>📌 Importante:</strong>
          </p>
          <ul style="color: #6b7280; font-size: 14px;">
            <li>Este enlace es personal y válido por 30 días</li>
            <li>Asegúrate de tener una conexión estable</li>
            <li>Podrás ver tus resultados al finalizar</li>
          </ul>
          
          <p style="color: #9ca3af; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
            <a href="${evaluationUrl}" style="color: #0ea5e9;">${evaluationUrl}</a>
          </p>
        </div>
        
        <div class="footer">
          <p><strong>Reclu System</strong></p>
          <p>Sistema Profesional de Evaluaciones de Talento</p>
          <p>Este correo fue enviado automáticamente. Por favor no respondas a esta dirección.</p>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({ to: recipientEmail, subject, html });
  }
}

export const emailService = new EmailService();

// Team invitation email function
interface TeamInvitationOptions {
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  company: string;
  jobTitle: string;
  inviteToken: string;
}

export async function sendTeamInvitationEmail(options: TeamInvitationOptions): Promise<boolean> {
  const { recipientEmail, recipientName, senderName, company, jobTitle, inviteToken } = options;
  
  const inviteLink = `${getAppBaseUrl()}/team/invite/${inviteToken}`;

  const subject = `🎉 Invitación para unirte al equipo de ${company} - Reclu`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f3f4f6; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7); padding: 30px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .header p { color: #e0e7ff; margin: 10px 0 0 0; }
        .content { padding: 30px 20px; max-width: 600px; margin: 0 auto; background: white; }
        .button { display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px; }
        .info-box { background: #eef2ff; border: 1px solid #6366f1; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 14px; }
        .feature { background: #f9fafb; border-radius: 6px; padding: 10px 15px; margin: 8px 0; border-left: 4px solid #6366f1; }
        .detail { display: flex; margin: 10px 0; }
        .detail-label { font-weight: bold; min-width: 100px; color: #4b5563; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Invitación al Equipo</h1>
        <p>${company} - Reclu</p>
      </div>
      
      <div class="content">
        <h2>¡Hola ${recipientName}!</h2>
        
        <p><strong>${senderName}</strong> te ha invitado a unirte al equipo de <strong>${company}</strong> en Reclu.</p>
        
        <div class="info-box">
          <h3>📋 Detalles de tu cuenta</h3>
          <div class="detail">
            <span class="detail-label">Nombre:</span>
            <span>${recipientName}</span>
          </div>
          <div class="detail">
            <span class="detail-label">Correo:</span>
            <span>${recipientEmail}</span>
          </div>
          <div class="detail">
            <span class="detail-label">Cargo:</span>
            <span>${jobTitle}</span>
          </div>
          <div class="detail">
            <span class="detail-label">Empresa:</span>
            <span>${company}</span>
          </div>
        </div>
        
        <p style="text-align: center;">
          <a href="${inviteLink}" class="button" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">Crear mi Contraseña y Acceder</a>
        </p>
        
        <div class="warning">
          ⚠️ <strong>Importante:</strong> Este enlace es válido por 7 días. Si expira, solicita una nueva invitación a ${senderName}.
        </div>
        
        <h3>🚀 ¿Qué podrás hacer en Reclu?</h3>
        
        <div class="feature">
          <strong>📊 Enviar Evaluaciones:</strong> Evalúa talento con 8 módulos científicos (DISC, EQ, DNA-25, etc.)
        </div>
        <div class="feature">
          <strong>📈 Ver Análisis:</strong> Accede a reportes detallados y análisis integrados
        </div>
        <div class="feature">
          <strong>👥 Gestionar Perfiles:</strong> Visualiza y compara perfiles de evaluados
        </div>
        <div class="feature">
          <strong>📄 Exportar Reportes:</strong> Genera PDFs profesionales para compartir
        </div>
        
        <p style="margin-top: 20px; color: #666;">
          Solo necesitas crear tu contraseña para empezar. Tu correo (${recipientEmail}) ya está registrado en el sistema.
        </p>
        
        <p style="color: #666;">
          Si tienes alguna duda, contacta a ${senderName} directamente.
        </p>
      </div>
      
      <div class="footer">
        <p><strong>Reclu System</strong></p>
        <p>Sistema Profesional de Evaluaciones de Talento</p>
        <p>Este correo fue enviado automáticamente. Por favor no respondas a esta dirección.</p>
      </div>
    </body>
    </html>
  `;

  return emailService.sendEmail({
    to: recipientEmail,
    subject,
    html
  });
}

// Función para enviar factura de compra de créditos
interface PurchaseInvoiceData {
  to: string;
  userName: string;
  invoiceNumber: string;
  creditAmount: number;
  pricePerCredit: number;
  totalAmount: number;
  paymentProvider: 'PayPal' | 'Stripe';
  paymentReference: string;
  purchaseDate: Date;
}

export async function sendPurchaseInvoiceEmail(data: PurchaseInvoiceData): Promise<boolean> {
  const { to, userName, invoiceNumber, creditAmount, pricePerCredit, totalAmount, paymentProvider, paymentReference, purchaseDate } = data;
  
  const formattedDate = purchaseDate.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const subject = `Factura de Compra de Créditos - ${invoiceNumber}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f3f4f6; }
        .header { background: linear-gradient(135deg, #10b981, #059669); padding: 30px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .header p { color: #d1fae5; margin: 10px 0 0 0; }
        .content { padding: 30px 20px; max-width: 600px; margin: 0 auto; background: white; }
        .invoice-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .invoice-header { display: flex; justify-content: space-between; border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 15px; }
        .invoice-title { font-size: 24px; font-weight: bold; color: #10b981; }
        .invoice-number { color: #6b7280; font-size: 14px; }
        .line-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
        .line-item:last-child { border-bottom: none; }
        .item-label { color: #4b5563; }
        .item-value { font-weight: 600; color: #1f2937; }
        .total-row { display: flex; justify-content: space-between; padding: 15px 0; margin-top: 10px; border-top: 2px solid #10b981; font-size: 18px; }
        .total-label { font-weight: bold; color: #1f2937; }
        .total-value { font-weight: bold; color: #10b981; }
        .success-badge { display: inline-block; background: #d1fae5; color: #059669; padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; margin: 20px 0; }
        .footer { background: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px; }
        .info-note { background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 15px; margin: 20px 0; font-size: 14px; color: #065f46; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✅ Compra Confirmada</h1>
        <p>Reclu - Factura de Créditos</p>
      </div>
      
      <div class="content">
        <p>¡Hola <strong>${userName}</strong>!</p>
        
        <p>Tu compra de créditos ha sido procesada exitosamente. A continuación encontrarás los detalles de tu transacción:</p>
        
        <div style="text-align: center;">
          <span class="success-badge">✓ Pago Completado</span>
        </div>
        
        <div class="invoice-box">
          <div class="invoice-header">
            <div>
              <div class="invoice-title">FACTURA</div>
              <div class="invoice-number">No. ${invoiceNumber}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: bold; color: #6b7280;">Fecha</div>
              <div>${formattedDate}</div>
            </div>
          </div>
          
          <div class="line-item">
            <span class="item-label">Descripción</span>
            <span class="item-value">Créditos Reclu</span>
          </div>
          
          <div class="line-item">
            <span class="item-label">Cantidad de créditos</span>
            <span class="item-value">${creditAmount.toLocaleString('es-ES')}</span>
          </div>
          
          <div class="line-item">
            <span class="item-label">Precio por crédito</span>
            <span class="item-value">$${pricePerCredit.toFixed(2)} USD</span>
          </div>
          
          <div class="line-item">
            <span class="item-label">Referencia de Transacción ${paymentProvider}</span>
            <span class="item-value" style="font-size: 12px;">${paymentReference}</span>
          </div>
          
          <div class="total-row">
            <span class="total-label">TOTAL PAGADO</span>
            <span class="total-value">$${totalAmount.toFixed(2)} USD</span>
          </div>
        </div>
        
        <div class="info-note">
          <strong>📊 Tus créditos ya están disponibles</strong><br>
          Los ${creditAmount.toLocaleString('es-ES')} créditos han sido añadidos a tu cuenta y puedes utilizarlos inmediatamente para enviar evaluaciones.
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">
          Guarda este correo como comprobante de tu compra. Si tienes alguna pregunta sobre tu transacción, no dudes en contactarnos.
        </p>
      </div>
      
      <div class="footer">
        <p><strong>Reclu System</strong></p>
        <p>Sistema Profesional de Evaluaciones de Talento</p>
        <p>Este correo fue enviado automáticamente. Por favor no respondas a esta dirección.</p>
      </div>
    </body>
    </html>
  `;

  return emailService.sendEmail({ to, subject, html });
}
