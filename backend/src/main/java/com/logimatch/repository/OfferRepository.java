package com.logimatch.repository;

import com.logimatch.domain.Offer;
import com.logimatch.domain.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByOwnerAndStatus(UserAccount owner, Offer.Status status);
    long countByOwnerAndStatus(UserAccount owner, Offer.Status status);
}
