
package com.klef.soa.docker.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.soa.docker.dto.PrintRequest;
import com.klef.soa.docker.dto.PrintResponse;
import com.klef.soa.docker.entity.Print;
import com.klef.soa.docker.repository.PrintRepository;
import com.klef.soa.docker.service.PrintService;

@Service
public class PrintServiceImpl implements PrintService {

    @Autowired
    private PrintRepository repo;

    @Override
    public PrintResponse addPrint(PrintRequest request) {

        Print p = Print.builder()
                .serviceName(request.getServiceName())
                .paperType(request.getPaperType())
                .pricePerPage(request.getPricePerPage())
                .colorPrinting(request.getColorPrinting())
                .build();

        Print saved = repo.save(p);

        return convertToResponse(saved);
    }

    @Override
    public List<PrintResponse> displayAll() {

        return repo.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }


@Override
public void deleteById(Long id) {
    repo.deleteById(id);
}


    private PrintResponse convertToResponse(Print p) {

        return PrintResponse.builder()
        		.id(p.getId())
                .serviceName(p.getServiceName())
                .paperType(p.getPaperType())
                .pricePerPage(p.getPricePerPage())
                .colorPrinting(p.isColorPrinting())
                .build();
    }
}
