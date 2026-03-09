-- Ajout du mode de matching sur les demandes de transport
-- OUTSOURCED : l'admin trouve la bonne offre pour l'utilisateur
-- SELF_SERVE  : on affiche les offres correspondantes, l'utilisateur choisit

ALTER TABLE transport_request
    ADD COLUMN matching_mode VARCHAR(20) NOT NULL DEFAULT 'SELF_SERVE';
