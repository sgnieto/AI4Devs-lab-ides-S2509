#Log de trabajo

## Tu enfoque de trabajo con IA

Primero analizo las distintas tecnologías y arquitectura a utilizar en el proyecto, me apoyo en chatgpt para hacer el trabajo más de research hasta que tengo una idea clara, después utilizo prompting para hacer el scafolding del proyecto con las configuraciones iniciales. Suelo tener un conjunto de agentes predefinidos que utilizo para realizar tareas de distinto tipo, seguridad, arquitectura, producto.... Que uso en modo planificación y ejecución, o ejecución directa con one-shot-prompting cuando no tengo una idea preconcebida de lo que quiero.

* Delegación
    - Scaffolding: metaprompting en base a un documento de arquitectura y estructura de repositorio y tecnologías a utilizar.
    - Propuesta de historias de usuario: Utilizando one shot prompting con restricciones, ejemplos y especificación de formato de salida, uso la IA para definir las epics e historias de usuario con sus criterios de aceptación que luego reviso y completo con los aspectos que considero oportunos.
    - Auditoría del repositorio: Utilizando un prompt enfocado en el pensamiento analítico y paso a paso, audito el cumplimiento de reglas o arquitectura.
    - Generación del plan de implementación desde distintos puntos de vista. Utilizando prompts estructurados y enfocados en distintos ámbitos de expertise para cubrir distintos puntos de vista como arquitectura, ui/ux, seguridad... Suelo usar metaprompts y customGPTs para hacer los system prompts de los agentes. https://chatgpt.com/g/g-a1p0cEAlK-gpt-muse-v2 este me ha dado buenos resultados.
    - Generación de reglas para agentes IA e IDEs. 
    - Generación de documentación a partir del codebase y plantillas de documentos.
    - Generación de código y pruebas. Prompts para desarrollar los planes de implementación, o bien realizando one shot prompting, dependiendo del tipo de desarrollo que esté realizando.
    - Mejora continua del proceso. Usando prompts enfocados en el pensamiento crítico y en el analisis de la interacción de la IA

Por mi posición laboral, tengo poco tiempo para prestar atención a grandes análisis y desarrollos (esto último no suele estar en mi ámbito del puesto) y mis equipos de desarrollo están saturados con código legacy. Estamos involucrados en un proceso de transformación, así que yo estoy más centrado en evaluar puntos de dolor de la compañía y mis equipos para liberar capacidad de trabajo y poder abordar más cosas, y el análisis detallado supervisado y el desarrollo de prototipos se lo dejo a la IA.

Dependiendo de la característica de la tarea suelo dar más o menos información. En algunos casos, hasta la información de la que yo dispongo es muy vaga. Según voy teniendo más nivel de detalle voy proporcionando más contexto. Me apoyo mucho en chatGPT para las más de exploración, puesto que el consumo de preguntas al IDE reducen drásticamente la productividad de la licencia.

He aprendido que la delegación de tareas muy pequeñas o triviales, a no ser que sean automatizables y puedas hacer un script, es mejor realizarlas tú directamente puesto que vas directo al punto y evitas posibles alucinaciones de la IA o efectos no deseados (a veces es complicado ser muy explícito con lo que necesitas y tardas menos en hacerlo tú). Si lo delegas en la IA consumes peticiones innecesarias y dependiendo del modelo, puedes tardar más en realizarlas, sobre todo si usas un modelo de pensamiento.

## Aplicación práctica de lo aprendido en sesiones pasadas

Creo que he probado un poco de todo: zero, one y few shot prompting, chain of thougts, metaprompting, división en subtareas, uso de plantillas, resolución de dudas. 

Según voy utilizando más la IA (y sufriendola) voy sacando una especie de "buenas prácticas" para la generación de prompts, en base al tipo de actividad y complejidad asocuada, tamaño del resultado esperado.

Aspectos que me no termino de encajar del todo son:
- Es dificil encontrar el punto exacto en el que la tarea se le empieza a hacer bola a la IA. Sobre todo en temas de desarrollo, en el momento que el agente tiene que manejar muchos ficheros, además de que el IDE se vuelve más lento, el agente es posible que empiece a alucinar y a obviar reglas definidas.
- El nivel y complejidad de las reglas. Creo que esto es lo que más loco me trae. Cómo hacer que las reglas definidas sean útiles y la IA no se las salte, bien por falta de ventana de contexto o bien por no ser obligatorias... la cuestión es que a veces me he encontrado con iteraciones que me han duplicado toda una funcionalidad compleja que ya me solucionaba una librería incluida en las dependencias, o bien se ha saltado SOLID, DDD u otros aspectos.
- Para refactoring de código legacy con muy malas prácticas de desarrollo, también he encontrado un problema. Los agentes suelen costarle manejar ficheros fuentes muy grandes y proponen ejemplos de refactorización muy grandes y con mucha probabilidad de romper la funcionalidad.
- Documentación del proyecto. A veces cuando propongo a los agentes que actualicen la documentación del proyecto, empiezan a generar miles de documentos que solo aportan mayor confusión y dificulta el mantenimiento.
- Bank memory. El flujo de actualización de bank-memory de los agentes, para registrar estados de tareas y otros aspectos, creo que tienen el mismo problema que las reglas, que a veces los agentes no lo cumplen en detalle, no sé si por ser bank memories demasiado ambiciosos, o por deficits de los prompts de los agentes. También he intentado incluir una regla específica para esto, pero tampoco me ha funcionado.
- Manejo de powershell para ejecutar los comandos. Creo que no hay ejecución que se realice bien a la primera. Esto es una pesadilla.

Lo que si he mejorado es intentar refinar las reglas, agentes, etc., ejecutando un prompt de pensamiento crítico para analizar la interacción con el agente y detectar posibles mejoras en el flujo o en la interacción con él. Intento ajustar cada vez más el tamaño de las peticiones para evitar alucinaciones y voy integrando distintas formas de uso que veo en tutoriales y eventos que proporcionan buenos resultados, tras probarlo previamente. En esta práctica por ejemplo, he optado por incluir los AGENT.MD por proyecto en lugar de reglas, y el resultado ha sido bastante más óptimo que el que suelo obtener.

## Tu colaboración con la IA durante este ejercicio

Una de las cosas más complejas de arrancar ya con una tecnología y enlazarla con lo que quieres usar es la pesadilla de las dependencias y las versiones de librería. En concreto he perdido mucho tiempo con TailwindCSS porque tenía un conflicto de librerías que no sacaban los estilos del proyecto. Y del manejo de powershell por parte de los agentes, mejor ni hablamos...

Lo que sí que me ha funcionado bastante bien y que me ha sorprendido grátamente es el uso de AGENT.md en lugar de reglas, así como la generación de un plan completo desde los distintos puntos de vista antes de realizar la implementación. Al principio requiere más tiempo de arrancar en el trabajo efectivo, pero luego va todo más rápido, sobre todo en peticiones más complejas. Otra cosa que he probado ha sido el MCP de shadcn para la generación de UIs y aunque me ha gustado bastante, me hubiera gustado otro tipo de MCP más alineado con Figma make (oro puro).

La IA no ha entendido bien el contexto cuando he estado tratando el problema de conflicto de versiones de TailwindCSS. De hecho, a veces me decía que había detectado cosas que no eran verdad, con que tenía ::root en lugar de :root en el fichero index.css. Yo no soy experto en esta tecnología y me ha costado sangre, sudor y lágrimas. Finalmente opté por consultar chatGPT, sin contexto, más allá de los errores y ficheros involucrados, y el conseguí resolver el problema, más rápido y de forma más eficiente. Parece que a veces el contexto puede ser tu enemigo.

Los ajustes que he realizado ha sido analizar la iteracción en busca de mejoras de reglas y flujos de los agentes. Utilizar chats nuevos sin contexto previos para la resolución de incidencias, de esta forma no contamino la interacción principal, ni confundo al que revisa la incidencia. Lo comentado de AGENT.md y generar este fichero específico para cada área del proyecto, he leido que esto ayuda a reducir el contexto y parece que la solución es más efectiva, además he tratado de apoyarme en los README.md para generar ese fichero.

## Decisiones técnicas y de diseño

### Decisiones tomadas en backend, frontend y base de datos.
**Backend**:
- Rate limiting y hasheo de contraseñas.
- Gestión de sesión a través de token JWT con datos de usuario encriptado.
- Documentación OpenAPI. (No me ha dado tiempo a probar el UI de swagger)
- Inyección de dependencia del cliente de prisma.

**Frontend**
- Uso de JWT con datos de rol para evitar consumo de API en backend para obtener datos de perfil de usuario.
- Las decisiones del agente de ui/ux no me han disgustado sobre el papel. Me habría gustado pulir un poco más el estilo. Hay cosas que no están operativas, porque están heredadas de los bloques importados de shadcn (a mejorar)

**BBDD**
- No he tomado ninguna decisión relevante en este ámbito. No he dispuesto de tiempo para iterar en el modelo de datos de los datos de educación y experiencia por falta de tiempo. Aquí la decisión habría sido obvia, los datos de educación y experiencia deben tener su entidad correspondiente relacionada en 0 a N con el candidato, puesto que puede que el candidato no tenga registros de educación ni experiencia.

### Decisión arquítectónica
**Frontend**:
- **Atomic design**: fomenta la generación de interfaces de usuario homogéneos, mejora la reutilización y la experiencia de usuario (el componente UI siempre funciona como se espera)
- **DDD**, **arquitectura hexagonal**, **screaming architecture**, **SOLID**, **DRY**, **KISS**, **YAGNI**. Fomenta el desacoplamiento entre código de UI y lógica de negocio.
- MCP shadcn studio. Para obtener componentes de UI de alta calidad reduciendo el trabajo de generación de componentes en base a componentes ya testados.

**Backend**:
- **DDD**, **arquitectura hexagonal**, **screaming architecture**, **SOLID**, **DRY**, **KISS**, **YAGNI**
- Inyección de dependecias para reducir el acoplamiento de las capas y clases.
- Hasheado de contraseñas y uso de JWT token para gestión de sesiones
- Rate limit en login para reducir ataques de fuerza bruta.
- Scripts de gestión de usuarios y generación de candidatos para entorno de desarrollo.
- Scripts de sincronización de la generación de openapi y los tipos del frontend en base al openapi.

### Tecnologías utilizadas y explicación:

**Frontend**:
- shadcn y (CLI shadcn): genera componentes UI estilados con Tailwind para acelerar la construcción de una librería de componentes.
- TailwindCSS: Manejo de estilos consistente y facil de mantener modificar los temas a través de los tokens.
- openapi-typescript: Generación de tipos a partir de contrato de APIs, facilita la interacción frontend-backend en base al cumplimiento del contrato de API.

**Backend**:
- reflect-metadata y tsyringe para Inyección de dependencias. Desacoplar controladores/servicios/repositorios, facilitar testing/mocks y configuración modular.
- zod y zod-openapi. Para la definición de esquemas y contratos de API. Definición en un único sitio de los esquemas y generar la documentación openapi de forma automática.
- envalid. Validación de variables de entorno en el arranque para evitar sorpresas en fase de ejecución.
- express-rate-limit. Rate limit para mitigar DOS a nivel de ruta y ataques de fuerza bruta en login.
- express-async-errors. captura de excepciones en handlers async sin next(err) manual → middleware de error centralizado efectivo para evitar crash de servidor inesperados.
- jsonwebtoken y bcryptjs. autenticación stateless vía JWT y hashing de contraseñas.
- multer para subida de archivos multipart.

## Aprendizajes y próximos pasos

He detectado que en momentos en los que hay incidencias, el desconocimiento de la tecnología hace que no puedas enfocar a la IA en la resolución de la misma, sobre todo en incidencias complejas como la compatibilidad de dependencias. También he detectado el uso del patrón de copiar la traza de error y soltársela a la IA, en algunos casos con buen resultado y en otro con no tan bueno. Creo que aquí sería interesante tener algún prompt de resolución de los problemas de build o de testing tipo run and fix para que sea más autónomo y sistemático, pero con los problemas que me da con powershell...

Para próximos ejercicios me gustaría mejorar:
- Estrategia de establecimiento de reglas para la IA: donde, cómo y cuando, para que sean efectivas de verdad y reutilizables entre proyectos. Quiero diseñar un SDLC corporativo basado en IA, pero necesito ciertos aspectos genéricos y otros específicos de proyecto. Actualmente no termino de ver cómo hacerlo.
- Optimización de flujo de agentes para trabajo en automático y complementario entre sí. Muy util para arranques de proyecto en un entorno de baja capacidad.
- La parte de UI/UX es uno de mis puntos débiles y me gustaría dar con la tecla para definir un agente UI/UX que me ayude en la generación de prototipos como los que genera figma make (me encanta esta herramienta)


