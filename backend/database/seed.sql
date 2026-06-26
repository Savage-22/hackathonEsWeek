-- AgroGuardian AI — Datos semilla del catálogo agrícola
--
-- Cultivos clave de Huánuco (papa, maíz, tomate) con sus pesticidas y
-- recomendaciones (dosis, frecuencia y días de carencia).
--
-- NOTA: los valores agronómicos son REFERENCIALES para la demo del hackathon
-- y deben validarse con un ingeniero agrónomo antes de uso real.

-- Idempotente: limpia el catálogo antes de re-sembrar
TRUNCATE crop_recommendations, pesticides RESTART IDENTITY CASCADE;

INSERT INTO pesticides (name, active_ingredient) VALUES
    ('Mancozeb 80% WP',        'Mancozeb'),
    ('Clorpirifos 48% EC',     'Clorpirifos'),
    ('Cipermetrina 25% EC',    'Cipermetrina'),
    ('Lambda-cihalotrina 5% EC','Lambda-cihalotrina'),
    ('Metalaxil + Mancozeb',   'Metalaxil-M + Mancozeb');

-- Recomendaciones por cultivo (dosis por hectárea)
INSERT INTO crop_recommendations (crop, id_pesticide, recommended_dose, dose_unit, frequency_days, withdrawal_days)
SELECT 'Papa', id_pesticide, 2.50, 'kg/ha', 7, 14  FROM pesticides WHERE name = 'Mancozeb 80% WP';
INSERT INTO crop_recommendations (crop, id_pesticide, recommended_dose, dose_unit, frequency_days, withdrawal_days)
SELECT 'Papa', id_pesticide, 1.00, 'L/ha', 14, 21  FROM pesticides WHERE name = 'Clorpirifos 48% EC';
INSERT INTO crop_recommendations (crop, id_pesticide, recommended_dose, dose_unit, frequency_days, withdrawal_days)
SELECT 'Papa', id_pesticide, 2.00, 'kg/ha', 7, 14  FROM pesticides WHERE name = 'Metalaxil + Mancozeb';

INSERT INTO crop_recommendations (crop, id_pesticide, recommended_dose, dose_unit, frequency_days, withdrawal_days)
SELECT 'Maíz', id_pesticide, 0.30, 'L/ha', 10, 21  FROM pesticides WHERE name = 'Cipermetrina 25% EC';
INSERT INTO crop_recommendations (crop, id_pesticide, recommended_dose, dose_unit, frequency_days, withdrawal_days)
SELECT 'Maíz', id_pesticide, 0.20, 'L/ha', 12, 14  FROM pesticides WHERE name = 'Lambda-cihalotrina 5% EC';

INSERT INTO crop_recommendations (crop, id_pesticide, recommended_dose, dose_unit, frequency_days, withdrawal_days)
SELECT 'Tomate', id_pesticide, 2.00, 'kg/ha', 7, 7  FROM pesticides WHERE name = 'Mancozeb 80% WP';
INSERT INTO crop_recommendations (crop, id_pesticide, recommended_dose, dose_unit, frequency_days, withdrawal_days)
SELECT 'Tomate', id_pesticide, 0.25, 'L/ha', 10, 3  FROM pesticides WHERE name = 'Cipermetrina 25% EC';
