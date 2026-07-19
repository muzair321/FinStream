package finstream.server.service;

import finstream.server.model.DepartmentalOpex;
import finstream.server.repository.DepartmentalOpexRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DepartmentalOpexService {

    private final DepartmentalOpexRepository opexRepository;

    public DepartmentalOpexService(DepartmentalOpexRepository opexRepository) {
        this.opexRepository = opexRepository;
    }

    public List<DepartmentalOpex> getAll() {
        return opexRepository.findAll();
    }

    public List<DepartmentalOpex> saveAll(List<DepartmentalOpex> opexList) {
        return opexRepository.saveAll(opexList);
    }
}