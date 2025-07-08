INSERT INTO emociones (nombre, intensidad, polaridad) VALUES
('Alegría', 8, 'positiva'),
('Tristeza', 7, 'negativa'),
('Miedo', 6, 'negativa'),
('Enojo', 7, 'negativa'),
('Sorpresa', 5, 'neutra'),
('Asco', 4, 'negativa'),
('Confianza', 7, 'positiva'),
('Vergüenza', 5, 'negativa'),
('Culpa', 6, 'negativa'),
('Esperanza', 7, 'positiva'),
('Gratitud', 8, 'positiva'),
('Serenidad', 6, 'positiva'),
('Nostalgia', 5, 'neutra'),
('Euforia', 9, 'positiva'),
('Desesperación', 8, 'negativa'),
('Frustración', 6, 'negativa'),
('Curiosidad', 5, 'neutra'),
('Admiración', 6, 'positiva'),
('Celos', 7, 'negativa'),
('Envidia', 6, 'negativa'),
('Compasión', 7, 'positiva'),
('Remordimiento', 6, 'negativa'),
('Orgullo', 7, 'positiva'),
('Humillación', 7, 'negativa'),
('Inspiración', 8, 'positiva'),
('Desprecio', 5, 'negativa'),
('Paz', 9, 'positiva'),
('Ansiedad', 7, 'negativa'),
('Éxtasis', 9, 'positiva'),
('Melancolía', 6, 'neutra');

INSERT INTO cartas (nombre, descripcion, elemento, polaridad) VALUES
('El Fénix', 'Renacimiento desde las cenizas. Indica que un ciclo termina para dar paso a algo nuevo, incluso si duele.', 'fuego', 'positiva'),
('La Antorcha', 'Ilumina caminos ocultos. En sueños, es guía interna o advertencia de verdad que no puedes ignorar.', 'fuego', 'neutra'),
('El Dragón', 'Fuerza poderosa pero indomable. Representa tu poder personal o miedos que te controlan si no los enfrentas.', 'fuego', 'neutra'),
('El Espejo del Lago', 'Refleja lo que niegas. Si el agua está turbia, habla de autoengaño; si está clara, de autoconocimiento.', 'agua', 'neutra'),
('El Naufragio', 'Pérdida de control emocional. Sugiere rendirse a lo que no puedes cambiar para encontrar paz.', 'agua', 'negativa'),
('La Sirena', 'Seducción y voces internas. Puede simbolizar deseos ocultos o llamados a escuchar tu intuición.', 'agua', 'neutra'),
('El Bosque Enraizado', 'Conexión con tus orígenes. Raíces familiares o hábitos que te sostienen o limitan.', 'tierra', 'neutra'),
('La Montaña Hueca', 'Apariencia sólida con vacío interior. Advierte sobre metas que parecen sólidas pero no te llenan.', 'tierra', 'negativa'),
('El Jardín Secreto', 'Abundancia interna. Representa talentos ocultos o espacios emocionales que necesitan cuidado.', 'tierra', 'positiva'),
('El Viento Norte', 'Cambios abruptos. Anuncia transformaciones inevitables que requieren adaptación.', 'aire', 'neutra'),
('El Libro Abierto', 'Conocimiento o secretos revelados. Páginas en blanco hablan de potencial; escritas, de destino.', 'aire', 'positiva'),
('La Torre de Cristal', 'Fragilidad intelectual. Ideas rígidas que pueden romperse para dejar paso a nuevas perspectivas.', 'aire', 'negativa'),
('El Puente de Niebla', 'Transiciones confusas entre etapas. Confía en el proceso aunque no veas el final.', 'agua', 'neutra'),
('El Relámpago', 'Inspiración repentina o conflicto inminente. Energía que corta a través de la oscuridad.', 'fuego', 'neutra'),
('La Espiral', 'Ciclos infinitos. Puede ser crecimiento o estancamiento, según la dirección que percibas.', 'tierra', 'neutra'),
('El Ojo Durmiente', 'Vista interna. Verdad que tu inconsciente conoce pero tu mente consciente ignora.', 'aire', 'positiva'),
('El Laberinto', 'Búsqueda de propósito. Cada vuelta representa lecciones, no errores.', 'tierra', 'neutra'),
('El Cáliz Roto', 'Desilusión emocional. Pérdida que enseña a valorar lo intangible.', 'agua', 'negativa'),
('Las Alas Atadas', 'Libertad reprimida. Miedos o compromisos que pesan más que tus sueños.', 'aire', 'negativa'),
('La Corona de Espinas', 'Sacrificio o dolor autoimpuesto. Poder que ganas al renunciar a lo que te daña.', 'fuego', 'neutra'),
('El Reloj de Arena', 'Tiempo y mortalidad. Urge a actuar o sugiere paciencia, según el contexto.', 'tierra', 'neutra'),
('La Máscara Dorada', 'Falsedad o protección. Lo que muestras al mundo vs. tu verdadero yo.', 'aire', 'negativa'),
('El Huracán', 'Caos que purifica. Destruye lo viejo para dejar espacio a lo nuevo.', 'aire', 'neutra'),
('La Luna Partida', 'Dualidad emocional. Conflictos entre razón y corazón que buscan equilibrio.', 'agua', 'neutra'),
('El Umbral', 'Decisiones irrevocables. Puertas que se cierran para que otras se abran.', 'tierra', 'neutra'),
('El Caldero', 'Transformación forzada. Crisis que cocina tu esencia hasta revelar tu fuerza.', 'fuego', 'positiva'),
('El Susurro', 'Verdades calladas. Mensajes del subconsciente o de voces que temes escuchar.', 'aire', 'neutra'),
('El Espejo Roto', 'Autoimagen fragmentada. Miedo a no ser suficiente o a múltiples identidades.', 'agua', 'negativa'),
('La Estrella Fugaz', 'Oportunidades efímeras. Actúa antes de que el momento pase.', 'fuego', 'positiva'),
('El Silencio', 'Verdad oculta o paz interior. Ausencia de ruido externo para escuchar tu voz.', 'aire', 'neutra');

INSERT INTO cartas_emociones (id_carta, id_emocion) VALUES
-- 1. El Fénix (renacimiento)
(1, 14),  -- Euforia
(1, 10),  -- Esperanza
(1, 2),   -- Tristeza

-- 2. La Antorcha (iluminación)
(2, 17),  -- Curiosidad
(2, 7),   -- Confianza
(2, 5),   -- Sorpresa

-- 3. El Dragón (poder)
(3, 4),   -- Enojo
(3, 23),  -- Orgullo
(3, 3),   -- Miedo

-- 4. El Espejo del Lago (reflexión)
(4, 12),  -- Serenidad
(4, 13),  -- Nostalgia
(4, 3),   -- Miedo

-- 5. El Naufragio (pérdida de control)
(5, 2),   -- Tristeza
(5, 16),  -- Desesperación
(5, 28),  -- Ansiedad

-- 6. La Sirena (intuición/deseos)
(6, 21),  -- Compasión
(6, 18),  -- Admiración
(6, 19),  -- Celos

-- 7. El Bosque Enraizado (orígenes)
(7, 13),  -- Nostalgia
(7, 22),  -- Remordimiento
(7, 27),  -- Paz

-- 8. La Montaña Hueca (vacío)
(8, 9),   -- Culpa
(8, 24),  -- Humillación
(8, 16),  -- Desesperación

-- 9. El Jardín Secreto (abundancia)
(9, 11),  -- Gratitud
(9, 25),  -- Inspiración
(9, 1),   -- Alegría

-- 10. El Viento Norte (cambio)
(10, 5),  -- Sorpresa
(10, 28), -- Ansiedad
(10, 10), -- Esperanza

-- 11. El Libro Abierto (conocimiento)
(11, 7),   -- Confianza
(11, 25),  -- Inspiración
(11, 17),  -- Curiosidad

-- 12. La Torre de Cristal (rigidez)
(12, 6),   -- Asco
(12, 26),  -- Desprecio
(12, 28),  -- Ansiedad

-- 13. El Puente de Niebla (transición)
(13, 13),  -- Nostalgia
(13, 30),  -- Melancolía
(13, 10),  -- Esperanza

-- 14. El Relámpago (inspiración/conflicto)
(14, 14),  -- Euforia
(14, 4),   -- Enojo
(14, 5),   -- Sorpresa

-- 15. La Espiral (ciclos)
(15, 30),  -- Melancolía
(15, 10),  -- Esperanza
(15, 22),  -- Remordimiento

-- 16. El Ojo Durmiente (verdad interna)
(16, 7),   -- Confianza
(16, 17),  -- Curiosidad
(16, 25),  -- Inspiración

-- 17. El Laberinto (búsqueda)
(17, 17),  -- Curiosidad
(17, 28),  -- Ansiedad
(17, 10),  -- Esperanza

-- 18. El Cáliz Roto (desilusión)
(18, 2),   -- Tristeza
(18, 9),   -- Culpa
(18, 16),  -- Desesperación

-- 19. Las Alas Atadas (libertad reprimida)
(19, 28),  -- Ansiedad
(19, 19),  -- Celos
(19, 24),  -- Humillación

-- 20. La Corona de Espinas (sacrificio)
(20, 23),  -- Orgullo
(20, 9),   -- Culpa
(20, 27),  -- Paz

-- 21. El Reloj de Arena (tiempo)
(21, 13),  -- Nostalgia
(21, 28),  -- Ansiedad
(21, 10),  -- Esperanza

-- 22. La Máscara Dorada (falsedad)
(22, 20),  -- Envidia
(22, 26),  -- Desprecio
(22, 8),   -- Vergüenza

-- 23. El Huracán (caos transformador)
(23, 4),   -- Enojo
(23, 5),   -- Sorpresa
(23, 14),  -- Euforia

-- 24. La Luna Partida (dualidad)
(24, 15),  -- Desesperación
(24, 12),  -- Serenidad
(24, 30),  -- Melancolía

-- 25. El Umbral (decisiones)
(25, 3),   -- Miedo
(25, 7),   -- Confianza
(25, 25),  -- Inspiración

-- 26. El Caldero (transformación)
(26, 14),  -- Euforia
(26, 4),   -- Enojo
(26, 11),  -- Gratitud

-- 27. El Susurro (verdades ocultas)
(27, 3),   -- Miedo
(27, 17),  -- Curiosidad
(27, 21),  -- Compasión

-- 28. El Espejo Roto (autoimagen)
(28, 8),   -- Vergüenza
(28, 24),  -- Humillación
(28, 22),  -- Remordimiento

-- 29. La Estrella Fugaz (oportunidad)
(29, 14),  -- Euforia
(29, 5),   -- Sorpresa
(29, 10),  -- Esperanza

-- 30. El Silencio (paz interior)
(30, 12),  -- Serenidad
(30, 27),  -- Paz
(30, 1);   -- Alegría