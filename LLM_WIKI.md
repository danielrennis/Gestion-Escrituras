# LLM Wiki: Gestión de Propiedades y Legales

Este documento define las reglas de operación para este repositorio de conocimiento. La IA debe seguir estas convenciones para mantener la coherencia de la base de datos.

## 1. Misión
Organizar de forma estructurada toda la documentación sobre inmuebles (escrituras, planos, impuestos) y procesos legales asociados para permitir consultas rápidas, análisis de riesgos y recomendaciones judiciales.

## 2. Estructura de la Wiki
- `raw/`: Archivos fuente inmutables (PDFs, Imágenes).
- `wiki/propiedades/`: Un archivo por inmueble. Título: `[Dirección] - [Localidad].md`.
- `wiki/entidades/`: Información de personas o empresas. Título: `[Nombre/CUIT].md`.
- `wiki/legal/`: Seguimiento de juicios o trámites. Título: `[Carátula/Expediente].md`.

## 3. Campos Mandatorios por Inmueble (Metadata)
Cada página de propiedad en `wiki/propiedades/` debe contener este YAML inicial:
```yaml
---
tipo: inmueble
direccion: ""
localidad: ""
matricula_folio_real: ""
nomenclatura_castastral: ""
partida_inmobiliaria: ""
titulares: []
estado_legal: "Limpio | Embargado | Litigio"
ultima_actualizacion: 2026-05-01
---
```

## 4. Instrucciones de Procesamiento (Ingesta)
Al recibir un documento nuevo:
1. **Identificar**: Tipo de documento (Escritura, Informe de Dominio, Cédula Judicial).
2. **Extraer**: Fechas clave, montos, nombres de Escribanos, Tomo/Folio/Finca o Matrícula.
3. **Actualizar**: 
   - Crear o modificar la página de la propiedad.
   - Si hay un cambio de titularidad, actualizar las páginas de `entidades`.
   - Si es una notificación judicial, crear entrada en `wiki/legal/`.
4. **Loguear**: Añadir entrada a `log.md`.
5. **Limpieza (REGLA DE ORO)**: Vaciar siempre el contenido de la carpeta `raw/` (`rm -rf raw/*`) inmediatamente después de procesar y mover los archivos.

## 5. Tono y Contexto
- **Idioma**: Español (Argentina).
- **Enfoque**: Técnico, legal, ejecutivo.
- **Prioridad**: Alertar sobre inconsistencias (ej: diferencia de metros cuadrados entre planos y escritura) o riesgos judiciales.
