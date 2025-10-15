package com.panscience.taskmanagement;

import com.panscience.taskmanagement.dto.TaskDTO;
import com.panscience.taskmanagement.model.Task;
import com.panscience.taskmanagement.model.User;
import com.panscience.taskmanagement.repository.TaskRepository;
import com.panscience.taskmanagement.repository.UserRepository;
import com.panscience.taskmanagement.service.FileStorageService;
import com.panscience.taskmanagement.service.TaskService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class TaskServiceTest {
    
    @Mock
    private TaskRepository taskRepository;
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private FileStorageService fileStorageService;
    
    @InjectMocks
    private TaskService taskService;
    
    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }
    
    @Test
    public void testGetAllTasks() {
        User user = new User(1L, "test@example.com", "password", "USER");
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setStatus("TODO");
        task.setPriority("HIGH");
        task.setDueDate(LocalDate.now());
        task.setCreatedBy(user);
        task.setDocuments(new ArrayList<>());
        
        List<Task> tasks = List.of(task);
        Page<Task> taskPage = new PageImpl<>(tasks);
        
        when(userRepository.findByEmail(any())).thenReturn(Optional.of(user));
        when(taskRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(taskPage);
        
        Page<TaskDTO> result = taskService.getAllTasks(null, null, null, 0, 10, "id", "asc", "test@example.com", "USER");
        
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        verify(taskRepository, times(1)).findAll(any(Specification.class), any(Pageable.class));
    }
    
    @Test
    public void testGetTaskById() {
        User user = new User(1L, "test@example.com", "password", "USER");
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Test Task");
        task.setStatus("TODO");
        task.setPriority("HIGH");
        task.setDueDate(LocalDate.now());
        task.setCreatedBy(user);
        task.setDocuments(new ArrayList<>());
        
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        
        TaskDTO result = taskService.getTaskById(1L, "test@example.com", "USER");
        
        assertNotNull(result);
        assertEquals("Test Task", result.getTitle());
        verify(taskRepository, times(1)).findById(1L);
    }
}
