# Contexto de la problematica
Proyecto de Hackatón
AgroGuardian AI
Sistema inteligente para el uso responsable de pesticidas con trazabilidad y funcionamiento offline en zonas rurales de Huánuco.
## 1. Problemática

En la región Huánuco, numerosos pequeños agricultores utilizan pesticidas de forma inadecuada debido a la falta de asistencia técnica permanente, registros de aplicación y herramientas tecnológicas adaptadas a zonas rurales.

Diversos estudios han encontrado que aproximadamente el 46 % de las verduras comercializadas en Huánuco presentan residuos de pesticidas por encima de los límites permitidos, lo que representa un riesgo para la salud pública, afecta el medio ambiente y disminuye la competitividad de los productos agrícolas.

A ello se suma otro problema importante: muchas zonas agrícolas tienen baja o nula conectividad a Internet, por lo que la mayoría de aplicaciones agrícolas existentes no pueden utilizarse en el campo.

## 2. Objetivo

Desarrollar una plataforma inteligente que ayude a los agricultores a registrar y controlar el uso de pesticidas, promoviendo buenas prácticas agrícolas mediante un sistema de trazabilidad, funcionamiento sin conexión a Internet y un mecanismo de incentivos basado en el cumplimiento de estándares.

## Justificación de adopción 

Los agricultores adoptarán AgroGuardian porque el uso de la plataforma les permitirá acceder a incentivos económicos y comerciales otorgados por las autoridades y entidades aliadas. Mediante el registro de las aplicaciones de pesticidas y la validación de buenas prácticas agrícolas, el sistema generará un historial verificable que permitirá identificar a los productores que cumplen los estándares establecidos. Estos agricultores podrán acceder a beneficios como bonos, capacitaciones, certificaciones o programas de apoyo. Además, cada lote producido contará con un código QR que permitirá a compradores y consumidores consultar la trazabilidad del cultivo, incrementando la confianza y el valor comercial de sus productos. Para asegurar su uso en zonas rurales, la aplicación funcionará sin conexión a Internet y sincronizará la información cuando exista cobertura, eliminando la principal barrera tecnológica de las comunidades agrícolas de Huánuco. De esta manera, el software no solo contribuye a reducir el uso inadecuado de pesticidas, sino que también genera beneficios económicos directos para los agricultores, incentivando su adopción sostenida.

## Retorno economico
El proyecto adopta un modelo SaaS (Software como Servicio) orientado a instituciones, donde el uso de la aplicación móvil será gratuito para los agricultores con el fin de maximizar su adopción. La sostenibilidad económica provendrá de licencias institucionales dirigidas a la Dirección Regional de Agricultura, municipalidades, cooperativas y organizaciones agrarias que requieran herramientas de monitoreo y análisis. Adicionalmente, empresas compradoras y cadenas de comercialización podrán contratar módulos de trazabilidad y certificación digital mediante códigos QR para verificar el cumplimiento de buenas prácticas agrícolas. Este enfoque permite mantener el acceso gratuito para el productor, mientras los actores que obtienen mayor valor estratégico financian la operación y evolución del sistema.

### Modelos
Agricultor

Gratis.

No paga absolutamente nada.

Dirección Regional de Agricultura

Licencia anual.

Incluye:

Dashboard.
Estadísticas.
Reportes.
Mapas.
Gestión de agricultores.
Municipalidades

Cada municipalidad puede adquirir su propio panel.

Cooperativas agrícolas

También podrían contratar el servicio.

Empresas privadas

Por ejemplo:

supermercados
exportadoras
asociaciones

Ellas pueden verificar mediante QR que los productos cumplen estándares.

Modelo SaaS

Podrían poner algo así:

Cliente	Pago
Agricultores	Gratuito
Cooperativas	Suscripción mensual
Municipalidades	Licencia anual
DRA	Licencia institucional
Empresas compradoras	Suscripción Premium
También existe otra fuente

Las empresas que compran productos certificados podrían pagar por acceder a:

historial
trazabilidad
reportes
cumplimiento ambiental

No por ver un QR.

Sino por usar la plataforma empresarial.

## Usuarios
Usuario principal

Pequeños y medianos agricultores de Huánuco.

Usuarios secundarios
Dirección Regional de Agricultura (DRA)
MIDAGRI
Cooperativas
Municipalidades
Ingenieros Agrónomos
Empresas compradoras
Consumidores
## Propuesta de valor

No es simplemente una aplicación agrícola.

Es una plataforma que:

funciona sin Internet
registra el uso de pesticidas
ayuda a reducir la contaminación
mejora la confianza del consumidor
genera trazabilidad mediante QR
permite crear programas de incentivos para agricultores responsables

## Nombre

AgroGuardian

Eslogan: "Cultivando tecnología, cosechando calidad"

## aspectos tecnicos
6. Arquitectura general
                    Dashboard Web
                 (DRA / Municipalidades)

                         ▲
                         │
                 API + Base de datos
                    (Cloud Server)

                         ▲
             Sincronización automática
          (cuando existe conexión Internet)

                         ▲
                         │

              Aplicación móvil Android

       Funciona completamente Offline

      SQLite / Room Database (Local)

                         ▲

                 Agricultor
7. Funcionamiento Offline

Esta será la característica principal del proyecto.

Toda la aplicación funciona sin Internet.

El agricultor podrá:

registrar cultivos
registrar fumigaciones
tomar fotografías
consultar recomendaciones
revisar historial
generar QR

Todo se guarda localmente.

Cuando el celular detecta Internet:

sincroniza automáticamente
8. Módulos del software
Módulo 1
Registro de agricultores

Información:

Nombre
DNI
Comunidad
Distrito
Provincia
Número telefónico
Asociación (opcional)
Módulo 2
Registro de parcelas

Campos

Nombre de parcela
Área
Ubicación GPS
Cultivo
Fecha de siembra
Fecha estimada de cosecha
Módulo 3
Registro de pesticidas

Cada aplicación queda registrada.

Información:

Fecha
Hora
Producto utilizado
Dosis aplicada
Cantidad
Fotografía
Observaciones
Módulo 4
Calendario inteligente

La aplicación recuerda:

próxima fumigación
tiempo de carencia
tiempo máximo permitido
próxima cosecha
Módulo 5
Recomendaciones

Según el cultivo

Ejemplo

Papa

↓

Pesticidas recomendados

↓

Cantidad recomendada

↓

Frecuencia

↓

Tiempo de espera

Módulo 6
Alertas inteligentes

Ejemplo

"No puede cosechar todavía."

"La dosis supera la recomendada."

"Han pasado demasiados días desde la última aplicación."

Módulo 7
Historial

Todo queda almacenado.

Cada cultivo tendrá:

historial
fotografías
fumigaciones
fechas
observaciones
Módulo 8
Trazabilidad mediante QR

Cuando el agricultor termina la producción

Se genera un QR.

El comprador podrá ver:

agricultor
ubicación
cultivo
fechas
pesticidas utilizados
dosis
fotografías
certificación
Módulo 9
Sistema de puntuación

Este será uno de los diferenciales.

Cada agricultor obtiene puntos.

Ejemplo

Registrar fumigación

+10

No exceder dosis

+20

Cumplir tiempo de carencia

+30

Registrar evidencia

+10

Completar historial

+20

Capacitación

+30

Según el puntaje

🥉 Bronce

🥈 Plata

🥇 Oro

Ese nivel aparecerá en el QR.

Módulo 10
Dashboard institucional

Solo para:

DRA
Municipalidades
Cooperativas

Funciones

Dashboard

Estadísticas

Mapa

Reportes

Ranking agricultores

Pesticidas más usados

Cantidad de aplicaciones

Cumplimiento por distrito

Agricultores certificados

9. Inteligencia Artificial

Puede implementarse de dos maneras.

Primera versión (Hackatón)

IA Generativa

El agricultor escribe:

"Tengo manchas negras en las hojas."

La IA responde:

Posible enfermedad.

Recomendaciones.

Precauciones.

Segunda versión

Visión artificial

Fotografía

↓

Modelo TensorFlow Lite

↓

Detecta enfermedad

↓

Recomienda tratamiento

10. Flujo del agricultor
Inicia sesión

↓

Registra parcela

↓

Registra cultivo

↓

Registra fumigación

↓

La aplicación verifica dosis

↓

Genera alertas

↓

Se almacena localmente

↓

Cuando hay Internet

↓

Sincroniza

↓

Se actualiza Dashboard

↓

Genera QR

↓

Comprador verifica
11. Tecnologías sugeridas
Aplicación

Flutter

Base local

SQLite

Backend

Node.js

NestJS

o

Laravel

Base nube

PostgreSQL

API

REST

Autenticación

JWT

Dashboard

React

Mapas

OpenStreetMap

Leaflet

IA

Gemini API (para el MVP)

TensorFlow Lite (evolución futura)