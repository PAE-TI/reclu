# Reclu - Documento Maestro de Replica

## 1. Proposito del documento

Este documento es la base oficial para desarrollar `Reclu`, una replica funcional, visual y estructural de la plataforma original analizada en `motivaiq.abacusai.app`.

La regla principal de este proyecto es simple:

**Reclu debe construirse teniendo siempre como referencia obligatoria el sitio original, sus flujos, su estructura de navegacion, sus funcionalidades, su logica de producto, su sistema de evaluaciones, su diseño visual y su experiencia de uso.**

Este archivo debe servir como:

- fuente unica de verdad para el desarrollo;
- checklist de implementacion;
- guia de priorizacion;
- referencia para futuras decisiones de producto, diseño y arquitectura;
- documento vivo que iremos actualizando durante toda la replica.

---

## 2. Objetivo general

Construir `Reclu` como una plataforma SaaS de reclutamiento y evaluacion de talento basada en ciencia, tomando como base el producto original y replicando:

- la propuesta de valor;
- la estructura general del producto;
- el dashboard empresarial;
- el sistema de campañas;
- las evaluaciones psicometricas;
- las pruebas tecnicas por cargo;
- los analytics individuales, globales y comparativos;
- la gestion de equipo;
- la administracion de usuarios, creditos y configuraciones;
- la identidad visual y patrones de interfaz del producto original.

---

## 3. Principio rector de la replica

Durante todo el desarrollo de `Reclu`, cualquier decision debe validarse contra esta pregunta:

**"Esto conserva fielmente la esencia, funcionalidad, logica y experiencia del sitio original?"**

Si la respuesta es no, entonces:

- se corrige;
- se posterga;
- o se documenta como mejora posterior, pero no debe reemplazar la base original sin justificacion clara.

### Reglas de fidelidad

`Reclu` debe replicar:

- la arquitectura de paginas;
- la jerarquia visual;
- los modulos;
- los textos y microcopys clave adaptados al nuevo nombre;
- el sistema de creditos;
- los estados de campañas, evaluaciones y candidatos;
- el sistema de envio por email;
- el enfoque 360 del perfil de talento;
- el patron de UI: sidebar fija, topbar, tarjetas KPI, tablas/listados, modales, tabs, badges, paneles de ayuda y onboarding.

`Reclu` puede mejorar:

- consistencia de copy;
- claridad del scoring;
- robustez tecnica;
- organizacion del codigo;
- escalabilidad del banco de preguntas;
- experiencia del tour guiado;
- rendimiento y calidad responsive.

Pero toda mejora debe partir del original, no ignorarlo.

---

## 4. Nombre del producto

- Nombre nuevo: `Reclu`
- Base conceptual: replica del producto original auditado
- Posicionamiento esperado: plataforma de reclutamiento, evaluacion y analisis de talento con enfoque 360

---

## 5. Vision de producto de Reclu

`Reclu` debe permitir que una empresa:

- cree campañas de seleccion;
- defina cargos y perfiles ideales;
- invite candidatos a completar evaluaciones;
- aplique modulos psicometricos y tecnicos;
- centralice resultados;
- compare candidatos;
- identifique el mejor fit para un cargo;
- administre creditos, equipo y configuraciones;
- opere todo desde un portal empresarial moderno y claro.

---

## 6. Mapa general del producto a replicar

### 6.1 Landing publica

Debe incluir:

- hero principal;
- propuesta de valor;
- metricas destacadas;
- explicacion del problema;
- explicacion del proceso;
- seccion de modulos;
- beneficios;
- testimonios;
- FAQ;
- llamados a la accion para registro e inicio de sesion.

### 6.2 Portal autenticado

Modulos principales identificados:

- `Dashboard`
- `Analytics`
- `Campaigns`
- `Campaign Detail`
- `Campaign Create`
- `Team`
- `Admin`
- `Technical Questions Admin`
- `External Evaluations by Module`
- `Batch Evaluations`
- `Technical External Evaluations`
- `Evaluations Guide`
- `Platform Guide`
- `Profile`
- `Settings`
- `Credits Purchase`

---

## 7. Rutas funcionales detectadas en el original

Estas rutas deben tomarse como referencia directa para la arquitectura de `Reclu`:

- `/`
- `/auth/signin`
- `/auth/signup`
- `/dashboard`
- `/analytics`
- `/analytics?mode=compare`
- `/analytics?mode=individual`
- `/campaigns`
- `/campaigns/new`
- `/campaigns/:id`
- `/team`
- `/admin`
- `/admin/technical-questions`
- `/external-evaluations`
- `/external-driving-forces-evaluations`
- `/external-eq-evaluations`
- `/external-dna-evaluations`
- `/external-acumen-evaluations`
- `/external-values-evaluations`
- `/external-stress-evaluations`
- `/external-technical-evaluations`
- `/batch-evaluations`
- `/evaluations-guide`
- `/guia-plataforma`
- `/profile`
- `/profile/edit`
- `/settings`
- `/credits/purchase`
- `/terms`

En `Reclu` podemos mantener estas rutas o adaptarlas, pero la arquitectura funcional debe conservarse.

---

## 8. Modulos de evaluacion a replicar

El producto original gira alrededor de 8 modulos.

### 8.1 DISC

- objetivo: medir comportamiento observable;
- preguntas: 24;
- duracion: 10-15 min;
- dimensiones: Dominancia, Influencia, Estabilidad, Cumplimiento.

### 8.2 Fuerzas Motivadoras

- objetivo: medir motivaciones internas;
- preguntas: 36;
- duracion: 15-20 min;
- valor principal: explicar el "por que" detras del comportamiento.

### 8.3 Inteligencia Emocional

- objetivo: medir gestion emocional;
- preguntas: 25;
- duracion: 12-18 min.

### 8.4 DNA-25

- objetivo: medir competencias profesionales;
- preguntas: 25;
- duracion: 20-25 min;
- enfoque: competencias agrupadas por categorias.

### 8.5 Acumen (ACI)

- objetivo: medir claridad de juicio y capacidad de evaluacion;
- preguntas: 30;
- duracion: 15-20 min;
- enfoque: mundo interno y externo.

### 8.6 Valores e Integridad

- objetivo: medir valores y consistencia etica;
- preguntas: 30;
- duracion: 12-15 min.

### 8.7 Estres y Resiliencia

- objetivo: medir bienestar, estres, resiliencia y factores protectores;
- preguntas: 30;
- duracion: 12-15 min.

### 8.8 Pruebas Tecnicas

- objetivo: evaluar conocimiento tecnico por cargo;
- cobertura detectada: 225+ cargos;
- banco detectado: 13,700+ preguntas;
- dificultad: facil, media, dificil;
- estructura: preguntas por cargo, categoria y nivel.

---

## 9. Funcionalidades clave por area

## 9.1 Dashboard

Debe replicar:

- sidebar fija con modulos y navegacion;
- topbar con buscador, idioma, creditos y notificaciones;
- KPIs de candidatos, evaluaciones completadas, pendientes y perfiles 360;
- accesos rapidos;
- actividad reciente;
- mosaico de modulos;
- tips y consejos;
- accesos a guias;
- tour onboarding.

## 9.2 Campañas

Debe permitir:

- listar campañas;
- ver estado;
- ver candidatos;
- ver score promedio;
- ver progreso;
- filtrar campañas por estado;
- crear nuevas campañas;
- abrir detalle de campaña.

### Estados detectados

- Activa
- Analizando
- Completada
- Archivada

### Campos funcionales identificados

- nombre de campaña;
- cargo a buscar;
- visibilidad;
- permisos del equipo;
- modulos seleccionados;
- costo en creditos por candidato;
- listado de candidatos;
- score por candidato;
- resumen del top candidato.

## 9.3 Creacion de campañas

La pantalla debe incluir:

- nombre de campaña;
- cargo a buscar;
- descripcion opcional;
- visibilidad publica/privada;
- permisos del equipo;
- seleccion de modulos;
- seleccion total / deseleccion total;
- costo total por candidato;
- CTA para crear campaña.

## 9.4 Detalle de campaña

Debe mostrar:

- nombre y estado;
- cargo asociado;
- total de candidatos;
- completadas y pendientes;
- progreso general;
- modulos aplicados;
- creditos por candidato;
- tabla o cards de candidatos;
- score por candidato;
- top candidato;
- resumen de ajuste general;
- botones para agregar candidatos y analizar resultados.

## 9.5 Evaluaciones externas por modulo

Cada modulo debe tener su propia pagina con:

- estadisticas de enviadas/completadas/pendientes/expiradas;
- formulario de envio;
- historial;
- acciones por evaluacion;
- notas;
- eliminar;
- ver resultados;
- descargar PDF si aplica.

## 9.6 Envio masivo

Debe permitir:

- enviar varias evaluaciones a una sola persona desde un solo formulario;
- seleccionar nombre y correo;
- elegir formato de envio:
  - un solo correo;
  - un correo por evaluacion;
- seleccionar modulos;
- calcular creditos en tiempo real;
- calcular tiempo estimado;
- mostrar cantidad de preguntas.

## 9.7 Evaluaciones tecnicas

Debe permitir:

- enviar pruebas tecnicas por cargo;
- filtrar o navegar categorias;
- seleccionar cargo especifico;
- generar prueba segun cargo;
- mostrar estadisticas;
- gestionar historial.

## 9.8 Analytics

Debe tener 3 modos:

- Vista General
- Individual
- Comparar

### Vista General

Debe mostrar:

- numero total de personas evaluadas;
- numero de perfiles completos;
- modulos completados;
- promedios del equipo;
- distribucion DISC;
- motivadores del equipo;
- niveles EQ;
- niveles DNA;
- Acumen promedio;
- Valores e Integridad;
- bienestar y resiliencia;
- listado de personas evaluadas.

### Vista Individual

Debe permitir:

- seleccionar una persona;
- ver perfil 360;
- ver modulos disponibles de esa persona;
- ver graficas;
- ver interpretaciones;
- ver analisis integrado.

### Vista Comparar

Debe permitir:

- seleccionar entre 2 y 4 personas;
- comparacion lado a lado;
- dinamica de equipo;
- matriz de compatibilidad;
- fortalezas y brechas;
- sinergias y tensiones.

## 9.9 Team

Debe permitir:

- ver miembros activos;
- ver pendientes;
- invitar facilitadores;
- definir nivel de acceso;
- listar miembros;
- diferenciar admin/facilitador;
- mostrar numero de evaluaciones enviadas.

### Niveles detectados

- acceso completo;
- solo sus evaluaciones.

## 9.10 Admin

Debe incluir:

- configuracion de registro;
- activacion automatica;
- creditos iniciales;
- costo por evaluacion;
- configuracion PayPal;
- modo sandbox/live;
- configuracion de precios;
- ventas de creditos;
- usuarios registrados;
- roles;
- estado;
- creditos;
- evaluaciones enviadas.

## 9.11 Banco tecnico administrativo

Debe permitir:

- listar preguntas;
- filtrar por cargo;
- filtrar por tipo;
- ver dificultad;
- ver respuesta correcta;
- ver categoria;
- paginacion;
- crear preguntas nuevas;
- editar y eliminar en fases posteriores si no esta en MVP.

## 9.12 Profile

Debe incluir:

- informacion personal;
- informacion de empresa;
- rol;
- estado;
- equipo asociado;
- accesos a editar perfil;
- cambiar contraseña.

## 9.13 Settings

Debe incluir:

- creditos disponibles;
- historial de transacciones;
- reglas de creditos;
- compra de creditos;
- notificaciones;
- configuracion de cuenta;
- idioma.

## 9.14 Compra de creditos

Debe incluir:

- selector de cantidad;
- precio por credito;
- total;
- integracion de pago;
- explicacion de uso de creditos.

## 9.15 Guias

Debe existir:

- guia de evaluaciones;
- guia general de plataforma;
- contenido educativo;
- CTA contextual a envio y analytics.

---

## 10. Sistema de creditos

El sistema de creditos es parte central del producto y debe modelarse desde el inicio.

### Reglas detectadas

- cada evaluacion consume creditos;
- en el original se observa `2 creditos por evaluacion`;
- el costo de una campaña depende del numero de modulos;
- el ledger debe mostrar recargas y consumos;
- los creditos deben poder comprarse;
- los facilitadores consumen creditos de la cuenta principal.

### Requisitos para Reclu

- saldo visible permanentemente;
- historial completo;
- entradas y salidas trazables;
- soporte para compras;
- reglas claras de consumo;
- soporte multiusuario por organizacion.

---

## 11. Sistema de scoring y ranking

Debe existir una capa de compatibilidad para:

- puntuar candidatos;
- ordenarlos;
- detectar top candidato;
- mostrar fit excelente, alto, moderado o bajo;
- comparar candidatos entre si;
- construir el perfil integrado 360.

### Regla importante

El sistema no debe basarse solo en "cantidad de modulos completados". Debe considerar:

- peso por modulo;
- cobertura del perfil;
- ajuste al cargo;
- coincidencia con competencias esperadas;
- resultados tecnicos;
- integracion de señales psicometricas.

### Decision

La formula exacta puede cambiar durante implementacion, pero el comportamiento esperado debe sentirse coherente con el original:

- ranking claro;
- top candidato visible;
- interpretacion util para seleccion.

---

## 12. Estructura de datos propuesta

Estas entidades son necesarias para una replica completa.

### Core

- `User`
- `Organization`
- `TeamMember`
- `Role`
- `Permission`

### Reclutamiento

- `Campaign`
- `CampaignModule`
- `Candidate`
- `CampaignCandidate`
- `CandidateNote`

### Evaluaciones

- `EvaluationType`
- `EvaluationInvite`
- `EvaluationResult`
- `EvaluationAnswer`
- `EvaluationReport`
- `EvaluationStatus`

### Tecnicas

- `TechnicalCategory`
- `TechnicalRole`
- `TechnicalQuestion`
- `TechnicalQuestionOption`
- `TechnicalTestTemplate`
- `TechnicalTestAttempt`
- `TechnicalTestResult`

### Creditos y compras

- `CreditTransaction`
- `CreditPackage`
- `Purchase`
- `PaymentProviderTransaction`

### Plataforma

- `Notification`
- `AuditLog`
- `OnboardingTourState`
- `AppSetting`

---

## 13. Roles y permisos

### 13.1 Usuario principal / administrador

Puede:

- crear campañas;
- enviar evaluaciones;
- comprar creditos;
- ver todos los resultados;
- administrar equipo;
- acceder a admin si corresponde;
- configurar la cuenta;
- ver analytics globales.

### 13.2 Facilitador con acceso completo

Puede:

- ver campañas;
- agregar candidatos;
- enviar evaluaciones;
- usar creditos de la cuenta principal;
- ver evaluaciones del equipo segun alcance definido.

### 13.3 Facilitador restringido

Puede:

- enviar evaluaciones;
- ver solo las evaluaciones que el mismo envio;
- consumir creditos del dueño.

### 13.4 Admin de plataforma

Puede:

- administrar usuarios;
- configurar pricing;
- revisar ventas;
- manejar banco de preguntas tecnicas;
- activar registros;
- configurar sistema de pagos.

---

## 14. Arquitectura sugerida para Reclu

Como referencia tecnica, la app original parece seguir un enfoque cercano a:

- `Next.js App Router`
- `React`
- `Tailwind CSS`
- `shadcn/ui`
- `Lucide`
- backend full-stack con rutas server y persistencia SQL

### Decisiones de infraestructura ya definidas

Estas decisiones quedan establecidas desde este momento y deben respetarse durante la preparacion del proyecto:

- el codigo fuente de `Reclu` vivira en un repositorio `git`;
- el despliegue principal se realizara con `Vercel`;
- la base de datos estara en `DigitalOcean`;
- este documento debe asumir esa arquitectura como base operativa del proyecto.

### Recomendacion para la replica

- frontend: `Next.js`
- UI: `Tailwind + shadcn/ui`
- base de datos: `PostgreSQL` en `DigitalOcean`
- ORM: `Prisma`
- auth: `NextAuth` o autenticacion propia robusta
- email: `Resend`, `Postmark` o similar
- pagos: `PayPal` como fase compatible con el original
- almacenamiento de PDFs/reportes: `S3` o equivalente

### Implicaciones tecnicas de estas decisiones

- la arquitectura debe ser compatible con despliegue serverless/hibrido en `Vercel`;
- las variables de entorno deben definirse pensando en entornos `local`, `preview` y `production`;
- la conexion a `PostgreSQL` debe quedar lista para uso remoto desde `Vercel`;
- la estrategia de migraciones debe contemplar una base persistente en `DigitalOcean`;
- el proyecto debe organizarse para que el flujo natural sea:
  - desarrollo local;
  - control de versiones en `git`;
  - despliegue automatico en `Vercel`;
  - persistencia en `DigitalOcean`.

### Restriccion actual

Aunque estas decisiones ya estan definidas, **todavia no se inicia el desarrollo**. Por ahora solo deben quedar documentadas y asumidas como base del proyecto.

---

## 15. Diseño y sistema visual

`Reclu` debe inspirarse directamente en el look and feel del sitio original.

### Rasgos visuales detectados

- sidebar clara y permanente;
- fondo claro;
- tarjetas con bordes suaves;
- `rounded-xl`;
- sombras suaves;
- gradientes cian-indigo para acciones principales;
- badges y chips de estado;
- iconografia tipo Lucide;
- mezcla de panel informativo + producto operativo;
- bloques de ayuda dentro del producto;
- UI estilo SaaS moderno.

### Patrones a preservar

- card-based dashboard;
- accesos rapidos con CTA;
- tablas y listas por tarjeta;
- modales sencillos;
- tabs de analytics;
- KPIs visibles arriba;
- etiquetas por estado;
- guias y ayudas contextuales;
- onboarding tour.

### Mejoras permitidas sin romper fidelidad

- unificar copy;
- mejorar responsive;
- hacer mas consistente el espaciado;
- reducir interferencia del tour;
- aclarar jerarquias visuales secundarias.

---

## 16. Contenido y copy

El producto original mezcla español con ciertos anglicismos. En `Reclu` debemos definir una politica:

- idioma principal: espanol;
- anglicismos permitidos solo cuando sean convencionales;
- tono: profesional, claro, moderno;
- discurso: evaluacion cientifica + reclutamiento basado en datos.

### Regla de copy

Al renombrar a `Reclu`, el contenido debe:

- respetar la propuesta del original;
- conservar el enfoque de talento, evaluacion y compatibilidad;
- evitar alejarse demasiado del lenguaje del producto base.

---

## 17. Roadmap de implementacion

## Fase 0 - Fundacion

- inicializar proyecto;
- definir stack;
- definir sistema de diseño base;
- definir estructura de carpetas;
- definir base de datos inicial;
- preparar autenticacion;
- crear este documento como referencia.

## Fase 1 - Shell del producto

- layout principal;
- sidebar;
- topbar;
- sistema de navegacion;
- landing publica;
- auth;
- placeholders funcionales de todas las rutas principales.

## Fase 2 - Core empresarial

- organizaciones;
- perfil;
- settings;
- creditos;
- miembros del equipo;
- invitaciones;
- roles y permisos.

## Fase 3 - Campañas

- listado de campañas;
- crear campaña;
- detalle de campaña;
- candidatos;
- progreso;
- estados.

## Fase 4 - Evaluaciones psicometricas

- envio individual por modulo;
- historial;
- expiracion;
- resultados;
- notas;
- PDFs.

## Fase 5 - Envio masivo

- seleccion multiple;
- calculo de creditos;
- calculo de tiempo;
- formato de email.

## Fase 6 - Analytics

- vista general;
- vista individual;
- vista comparativa;
- perfil 360;
- ranking y scoring.

## Fase 7 - Pruebas tecnicas

- catalogo de cargos;
- banco de preguntas;
- envio tecnico;
- intento tecnico;
- scoring tecnico;
- admin tecnico.

## Fase 8 - Admin y pagos

- usuarios;
- pricing;
- creditos iniciales;
- compras;
- PayPal;
- ledger de transacciones.

## Fase 9 - Pulido final

- QA funcional;
- QA visual;
- responsive;
- accesibilidad;
- optimizacion;
- consistencia de copy;
- ajustes del tour;
- documentacion final.

---

## 18. MVP recomendado

Para llegar rapido a una replica fuerte sin abarcar todo al inicio:

### MVP 1

- auth
- dashboard shell
- campañas
- candidatos
- creditos
- DISC
- EQ
- DNA-25
- analytics general basico
- perfil individual basico

### MVP 2

- fuerzas motivadoras
- acumen
- valores
- estres
- envio masivo
- equipo
- notas
- PDFs

### MVP 3

- pruebas tecnicas
- banco admin
- compras de creditos
- admin completo
- comparador avanzado

---

## 19. Criterios de aceptacion globales

Consideraremos que `Reclu` va bien encaminado si cumple esto:

- se reconoce claramente como una replica estructural del original;
- cualquier usuario del original entiende rapidamente `Reclu`;
- las rutas principales ya existen y se conectan coherentemente;
- el flujo de campaña a evaluacion a analytics esta completo;
- el sistema de creditos funciona;
- los modulos principales existen;
- el look and feel conserva la esencia del original;
- el codigo queda listo para seguir iterando sin rehacer la base.

---

## 20. Riesgos del proyecto

### Riesgo funcional

- subestimar la complejidad del scoring y analytics integrado.

### Riesgo de alcance

- intentar construir todo de una sola vez sin fases claras.

### Riesgo de diseño

- alejarse del lenguaje visual original demasiado pronto.

### Riesgo tecnico

- no modelar bien creditos, invitaciones y resultados desde el inicio.

### Riesgo de contenido

- no documentar bien la logica de los modulos.

---

## 21. Decisiones no negociables

- `Reclu` se desarrolla tomando como base el sitio original.
- No se rediseña desde cero ignorando el producto fuente.
- La replica debe cubrir funcionalidad, estructura, UX y diseño.
- Toda nueva mejora debe documentarse como mejora, no confundirse con el core replicado.
- Este documento debe mantenerse actualizado.

---

## 22. Checklist maestro de replica

### Producto

- [ ] Landing publica
- [ ] Auth
- [ ] Dashboard
- [ ] Campañas
- [ ] Crear campaña
- [ ] Detalle de campaña
- [ ] Candidatos
- [ ] Team
- [ ] Settings
- [ ] Profile
- [ ] Credits
- [ ] Admin

### Evaluaciones

- [ ] DISC
- [ ] Fuerzas Motivadoras
- [ ] EQ
- [ ] DNA-25
- [ ] Acumen
- [ ] Valores e Integridad
- [ ] Estres y Resiliencia
- [ ] Tecnicas
- [ ] Envio masivo

### Analitica

- [ ] Vista general
- [ ] Vista individual
- [ ] Vista comparativa
- [ ] Perfil 360
- [ ] Ranking
- [ ] Compatibilidad

### Plataforma

- [ ] Invites por email
- [ ] Expiracion
- [ ] Notas
- [ ] PDFs
- [ ] Notificaciones
- [ ] Tour onboarding
- [ ] Guia de evaluaciones
- [ ] Guia de plataforma

### Negocio

- [ ] Sistema de creditos
- [ ] Ledger
- [ ] Compra de creditos
- [ ] Pricing
- [ ] PayPal

### Calidad

- [ ] Responsive
- [ ] Accesibilidad
- [ ] Consistencia de copy
- [ ] Consistencia visual
- [ ] QA funcional

---

## 23. Proximo uso de este documento

Este archivo debe guiarnos para crear despues:

- el PRD completo;
- la arquitectura de carpetas;
- el esquema Prisma;
- el backlog por sprints;
- los tickets por modulo;
- los criterios de QA;
- el checklist de replica visual;
- el plan de desarrollo incremental de `Reclu`.

---

## 24. Estado actual

Estado del proyecto al crear este documento:

- `Reclu` aun no esta implementado;
- ya se realizo una auditoria funcional del sitio original;
- ya se identificaron modulos, flujos, rutas y elementos clave;
- este documento se crea como base para desarrollar la replica completa.

---

## 25. Instruccion permanente para futuras iteraciones

Cada vez que avancemos en `Reclu`, debemos volver a este documento y verificar:

- que lo construido sigue la base del original;
- que no estamos omitiendo modulos importantes;
- que el diseño conserva la esencia del producto fuente;
- que las decisiones nuevas quedan documentadas aqui.

**Reclu debe crecer sobre la base del sitio original, no separarse de ella.**
