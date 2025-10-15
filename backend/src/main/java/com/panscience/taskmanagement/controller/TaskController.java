package com.panscience.taskmanagement.controller;

import com.panscience.taskmanagement.dto.TaskDTO;
import com.panscience.taskmanagement.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @GetMapping
    public ResponseEntity<Page<TaskDTO>> getAllTasks(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            Authentication authentication) {
        
        String userEmail = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("")
                .replace("ROLE_", "");
        
        return ResponseEntity.ok(taskService.getAllTasks(status, priority, dueDate, page, size, sortBy, sortDir, userEmail, role));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("")
                .replace("ROLE_", "");
        
        return ResponseEntity.ok(taskService.getTaskById(id, userEmail, role));
    }
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TaskDTO> createTask(
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam String status,
            @RequestParam String priority,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDate,
            @RequestParam(required = false) Long assignedToId,
            @RequestParam(required = false) MultipartFile[] files,
            Authentication authentication) throws IOException {
        
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setTitle(title);
        taskDTO.setDescription(description);
        taskDTO.setStatus(status);
        taskDTO.setPriority(priority);
        taskDTO.setDueDate(dueDate);
        taskDTO.setAssignedToId(assignedToId);
        
        String userEmail = authentication.getName();
        return ResponseEntity.ok(taskService.createTask(taskDTO, files, userEmail));
    }
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<TaskDTO> updateTask(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam(required = false) String description,
            @RequestParam String status,
            @RequestParam String priority,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dueDate,
            @RequestParam(required = false) Long assignedToId,
            @RequestParam(required = false) MultipartFile[] files,
            Authentication authentication) throws IOException {
        
        TaskDTO taskDTO = new TaskDTO();
        taskDTO.setTitle(title);
        taskDTO.setDescription(description);
        taskDTO.setStatus(status);
        taskDTO.setPriority(priority);
        taskDTO.setDueDate(dueDate);
        taskDTO.setAssignedToId(assignedToId);
        
        String userEmail = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("")
                .replace("ROLE_", "");
        
        return ResponseEntity.ok(taskService.updateTask(id, taskDTO, files, userEmail, role));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id, Authentication authentication) {
        String userEmail = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("")
                .replace("ROLE_", "");
        
        taskService.deleteTask(id, userEmail, role);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/documents/{documentId}")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long documentId, Authentication authentication) throws IOException {
        String userEmail = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("")
                .replace("ROLE_", "");
        
        byte[] fileContent = taskService.downloadDocument(documentId, userEmail, role);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment")
                .contentType(MediaType.APPLICATION_PDF)
                .body(fileContent);
    }
    
    @DeleteMapping("/documents/{documentId}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long documentId, Authentication authentication) throws IOException {
        String userEmail = authentication.getName();
        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("")
                .replace("ROLE_", "");
        
        taskService.deleteDocument(documentId, userEmail, role);
        return ResponseEntity.noContent().build();
    }
}
