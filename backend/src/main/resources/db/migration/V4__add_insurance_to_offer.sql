-- Ajout du document d'assurance obligatoire sur les offres de transport/stockage
ALTER TABLE offer_transport_detail
    ADD COLUMN insurance_file_path VARCHAR(500);

ALTER TABLE offer_transport_detail
    ADD COLUMN insurance_original_name VARCHAR(255);
