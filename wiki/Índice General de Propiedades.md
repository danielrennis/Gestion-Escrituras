---
tipo: moc
---
# 🗺️ Índice General de Propiedades

Este es un panel de control automatizado (MoC) de todas las propiedades procesadas y registradas en el sistema.

## 📊 Propiedades por Estado Legal

```dataview
TABLE localidad, titulares, estado_legal, superficie
FROM "wiki/propiedades"
WHERE tipo = "inmueble" or tipo = "Lote"
SORT localidad ASC
```

## 👥 Red de Titulares

```dataview
TABLE length(rows) as Cantidad_Propiedades
FROM "wiki/propiedades"
FLATTEN titulares
GROUP BY titulares
```

## 📂 Enlaces Rápidos
- [[Hugo Daniel Rennis]]
- [[Judith Esther Núñez]]


## 📁 Índice Estático de Propiedades
### Colonia Popular
- [[Colonia Popular - Chacra 95 - Parcela 04, Manzana 46]]
- [[Colonia Popular - Chacra 95 - Parcela 05, Manzana 46]]
- [[Colonia Popular - Chacra 95 - Parcela 06, Manzana 45]]
- [[Colonia Popular - Chacra 95 - Parcela 07, Manzana 45]]
### Machagai - Rural (Chacra 30)
- [[Machagai - Ruta 16 - Chacra 30 - Parcela 10]]
- [[Machagai - Ruta 16 - Chacra 30 - Parcela 11]]
- [[Machagai - Ruta 16 - Chacra 30 - Parcela 7]]
- [[Machagai - Ruta 16 - Chacra 30 - Parcela 8]]
- [[Machagai - Ruta 16 - Chacra 30 - Parcela 9]]
### Machagai - Urbano
- [[Machagai - Alberdi]]
- [[Machagai - Carlitos]]
- [[Machagai - Donacion Angel la Gata]]
- [[Machagai - Donacion Benchu]]
- [[Machagai - Encina]]
- [[Machagai - Farmacia]]
### Resistencia
- [[La California - Lotes 287 y 288]]
- [[Resistencia - Domicilio]]
