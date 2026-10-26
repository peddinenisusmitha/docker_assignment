
package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.dto.PrintRequest;
import com.klef.soa.docker.dto.PrintResponse;

public interface PrintService {

    PrintResponse addPrint(PrintRequest request);

    List<PrintResponse> displayAll();

    void deleteById(Long id);
}
