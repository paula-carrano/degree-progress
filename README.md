# Degree Progress

Degree Progress es una aplicación pensada para acompañar a estudiantes durante su carrera y ayudarles a entender de forma sencilla cuánto avanzaron y qué materias pueden cursar.

## Demo

Podés probar la aplicación en:

**[Abrir Degree Progress](https://paula-carrano.github.io/degree-progress/)**

## ¿Qué se puede hacer?

- Consultar las materias del plan de estudios.
- Ver las materias organizadas por módulo.
- Registrar materias aprobadas y su calificación.
- Llevar un seguimiento del avance en la carrera.
- Importar un plan de estudios desde un archivo de Excel.
- Consultar las correlativas de cada materia.
- Conversar con un asistente académico sobre el plan de estudios.

## Asistente académico

La aplicación cuenta con un chat que responde preguntas utilizando la información real del plan de estudios.

Algunas consultas posibles son:

- ¿Cuáles son las correlativas de Matemática I?
- ¿Qué materias no tienen correlativas?
- ¿Qué puedo cursar después de aprobar Programación I?
- ¿Cuántos créditos tiene una materia?

El objetivo es que el estudiante pueda encontrar esta información sin tener que revisar manualmente todo el plan de estudios.

## Importación del plan

Las materias pueden cargarse desde un archivo de Excel. El archivo incluye datos como:

- Código de la materia.
- Nombre.
- Créditos.
- Módulo al que pertenece.
- Códigos de sus correlativas.

Esto permite actualizar el plan completo de una manera rápida y mantener correctamente las relaciones entre las materias.

## Objetivo del proyecto

Degree Progress busca reunir en un solo lugar la información más importante de una carrera. La idea es ofrecer una vista clara del recorrido académico y facilitar la toma de decisiones al momento de elegir qué cursar.

El proyecto se encuentra en desarrollo, por lo que se seguirán incorporando mejoras y nuevas formas de visualizar el progreso.

## Cómo iniciar la aplicación

Con el proyecto descargado y preparado, se puede iniciar con:

```bash
npm run dev
```

Luego se abre desde la dirección que aparece en la terminal, normalmente `http://localhost:5173`.
