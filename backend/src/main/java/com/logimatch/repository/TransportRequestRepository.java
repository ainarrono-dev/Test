package com.logimatch.repository;

import com.logimatch.domain.TransportRequest;
import com.logimatch.domain.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransportRequestRepository extends JpaRepository<TransportRequest, Long> {
    long countByRequesterAndStatusIn(UserAccount requester, List<TransportRequest.Status> statuses);
}
