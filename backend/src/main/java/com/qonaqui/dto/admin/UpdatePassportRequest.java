package com.qonaqui.dto.admin;

import java.time.LocalDate;

public record UpdatePassportRequest(
        String series,
        String number,
        String issuedBy,
        LocalDate issueDate,
        String photo
) {}
