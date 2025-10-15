package com.panscience.taskmanagement.service;

import com.panscience.taskmanagement.dto.DocumentDTO;
import com.panscience.taskmanagement.dto.TaskDTO;
import com.panscience.taskmanagement.model.Document;
import com.panscience.taskmanagement.model.Task;
import com.panscience.taskmanagement.model.User;
import com.panscience.taskmanagement.repository.DocumentRepository;
import com.panscience.taskmanagement.repository.TaskRepository;
import com.panscience.taskmanagement.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import jakarta.persistence.criteria.Predicate;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    public Page<TaskDTO> getAllTasks(String status, String priority, LocalDate dueDate, 
                                      int page, int size, String sortBy, String sortDir, String userEmail, String role) {
        
        Specification<Task> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (!"ADMIN".equals(role)) {
                User user = userRepository.findByEmail(userEmail)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                predicates.add(criteriaBuilder.equal(root.get("createdBy"), user));
            }
            
            if (status != null && !status.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }
            
            if (priority != null && !priority.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("priority"), priority));
            }
            
            if (dueDate != null) {
                predicates.add(criteriaBuilder.equal(root.get("dueDate"), dueDate));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
        
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return taskRepository.findAll(spec, pageable).map(this::convertToDTO);
    }
    
    public TaskDTO getTaskById(Long id, String userEmail, String role) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        if (!"ADMIN".equals(role) && !task.getCreatedBy().getEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied");
        }
        
        return convertToDTO(task);
    }
    
    public TaskDTO createTask(TaskDTO taskDTO, MultipartFile[] files, String userEmail) throws IOException {
        User createdBy = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Task task = new Task();
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setStatus(taskDTO.getStatus());
        task.setPriority(taskDTO.getPriority());
        task.setDueDate(taskDTO.getDueDate());
        task.setCreatedBy(createdBy);
        
        if (taskDTO.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(taskDTO.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            task.setAssignedTo(assignedTo);
        }
        
        task = taskRepository.save(task);
        
        if (files != null && files.length > 0) {
            if (files.length > 3) {
                throw new RuntimeException("Maximum 3 documents allowed");
            }
            
            for (MultipartFile file : files) {
                if (!file.getContentType().equals("application/pdf")) {
                    throw new RuntimeException("Only PDF files are allowed");
                }
                
                String fileName = fileStorageService.storeFile(file);
                
                Document document = new Document();
                document.setFileName(file.getOriginalFilename());
                document.setFilePath(fileName);
                document.setFileType(file.getContentType());
                document.setFileSize(file.getSize());
                document.setTask(task);
                
                documentRepository.save(document);
            }
        }
        
        return convertToDTO(taskRepository.findById(task.getId()).get());
    }
    
    public TaskDTO updateTask(Long id, TaskDTO taskDTO, MultipartFile[] files, String userEmail, String role) throws IOException {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        if (!"ADMIN".equals(role) && !task.getCreatedBy().getEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied");
        }
        
        task.setTitle(taskDTO.getTitle());
        task.setDescription(taskDTO.getDescription());
        task.setStatus(taskDTO.getStatus());
        task.setPriority(taskDTO.getPriority());
        task.setDueDate(taskDTO.getDueDate());
        
        if (taskDTO.getAssignedToId() != null) {
            User assignedTo = userRepository.findById(taskDTO.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("Assigned user not found"));
            task.setAssignedTo(assignedTo);
        }
        
        if (files != null && files.length > 0) {
            int existingDocs = task.getDocuments().size();
            if (existingDocs + files.length > 3) {
                throw new RuntimeException("Maximum 3 documents allowed");
            }
            
            for (MultipartFile file : files) {
                if (!file.getContentType().equals("application/pdf")) {
                    throw new RuntimeException("Only PDF files are allowed");
                }
                
                String fileName = fileStorageService.storeFile(file);
                
                Document document = new Document();
                document.setFileName(file.getOriginalFilename());
                document.setFilePath(fileName);
                document.setFileType(file.getContentType());
                document.setFileSize(file.getSize());
                document.setTask(task);
                
                documentRepository.save(document);
            }
        }
        
        task = taskRepository.save(task);
        return convertToDTO(task);
    }
    
    public void deleteTask(Long id, String userEmail, String role) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        if (!"ADMIN".equals(role) && !task.getCreatedBy().getEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied");
        }
        
        for (Document doc : task.getDocuments()) {
            try {
                fileStorageService.deleteFile(doc.getFilePath());
            } catch (IOException e) {
            }
        }
        
        taskRepository.deleteById(id);
    }
    
    public byte[] downloadDocument(Long documentId, String userEmail, String role) throws IOException {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        Task task = document.getTask();
        if (!"ADMIN".equals(role) && !task.getCreatedBy().getEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied");
        }
        
        return fileStorageService.loadFile(document.getFilePath());
    }
    
    public void deleteDocument(Long documentId, String userEmail, String role) throws IOException {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
        
        Task task = document.getTask();
        if (!"ADMIN".equals(role) && !task.getCreatedBy().getEmail().equals(userEmail)) {
            throw new RuntimeException("Access denied");
        }
        
        fileStorageService.deleteFile(document.getFilePath());
        documentRepository.deleteById(documentId);
    }
    
    private TaskDTO convertToDTO(Task task) {
        TaskDTO dto = new TaskDTO();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        
        if (task.getAssignedTo() != null) {
            dto.setAssignedToId(task.getAssignedTo().getId());
            dto.setAssignedToEmail(task.getAssignedTo().getEmail());
        }
        
        if (task.getCreatedBy() != null) {
            dto.setCreatedById(task.getCreatedBy().getId());
            dto.setCreatedByEmail(task.getCreatedBy().getEmail());
        }
        
        List<DocumentDTO> documentDTOs = task.getDocuments().stream()
                .map(doc -> new DocumentDTO(doc.getId(), doc.getFileName(), doc.getFileType(), doc.getFileSize()))
                .collect(Collectors.toList());
        dto.setDocuments(documentDTOs);
        
        return dto;
    }
}
