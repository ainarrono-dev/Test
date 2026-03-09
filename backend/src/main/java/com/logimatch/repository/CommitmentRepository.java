package com.logimatch.repository;

import com.logimatch.domain.Commitment;
import com.logimatch.domain.TransportRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CommitmentRepository extends JpaRepository<Commitment, Long> {
    @Query("SELECT COALESCE(SUM(c.quantity), 0) FROM Commitment c WHERE c.request = :request AND c.status = 'ENGAGED'")
    int sumEngagedQuantityByRequest(TransportRequest request);
}
