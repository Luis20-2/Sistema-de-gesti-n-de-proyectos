// Modelo de datos para proyectos
class Project {
    constructor(id, name, description, priority, status) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.status = status;
    }
}

// Clase principal de la aplicación
class ProjectManager {
    constructor() {
        this.projects = [];
        this.nextId = 1;
        this.currentView = 'table';
        
        // Inicializar la aplicación
        this.init();
    }
    
    // Inicializar la aplicación
    init() {
        this.loadProjects();
        this.setupEventListeners();
        this.renderProjects();
    }
    
    // Cargar proyectos desde localStorage
    loadProjects() {
        const savedProjects = localStorage.getItem('projects');
        if (savedProjects) {
            this.projects = JSON.parse(savedProjects);
            // Encontrar el ID más alto para continuar la numeración
            if (this.projects.length > 0) {
                this.nextId = Math.max(...this.projects.map(p => p.id)) + 1;
            }
        }
        
        // Agregar algunos proyectos de ejemplo si no hay ninguno
        if (this.projects.length === 0) {
            this.addExampleProjects();
        }
    }
    
    // Guardar proyectos en localStorage
    saveProjects() {
        localStorage.setItem('projects', JSON.stringify(this.projects));
    }
    
    // Agregar proyectos de ejemplo
    addExampleProjects() {
        const exampleProjects = [
            new Project(this.nextId++, 'Sistema de Inventario', 'Desarrollar un sistema para gestionar el inventario de la empresa', 'alta', 'en-progreso'),
            new Project(this.nextId++, 'Portal del Cliente', 'Crear un portal web para que los clientes accedan a sus datos', 'media', 'pendiente'),
            new Project(this.nextId++, 'App Móvil', 'Desarrollar aplicación móvil para iOS y Android', 'alta', 'pendiente'),
            new Project(this.nextId++, 'Migración a la Nube', 'Migrar servidores locales a infraestructura cloud', 'media', 'completado')
        ];
        
        this.projects.push(...exampleProjects);
        this.saveProjects();
    }
    
    // Configurar event listeners
    setupEventListeners() {
        // Formulario para agregar proyectos
        document.getElementById('projectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProject();
        });
        
        // Formulario para editar proyectos
        document.getElementById('editProjectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProject();
        });
        
        // Búsqueda y filtros
        document.getElementById('searchInput').addEventListener('input', () => {
            this.renderProjects();
        });
        
        document.getElementById('statusFilter').addEventListener('change', () => {
            this.renderProjects();
        });
        
        document.getElementById('priorityFilter').addEventListener('change', () => {
            this.renderProjects();
        });
        
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearFilters();
        });
        
        // Cambio de vista
        document.getElementById('tableViewBtn').addEventListener('click', () => {
            this.switchView('table');
        });
        
        document.getElementById('cardViewBtn').addEventListener('click', () => {
            this.switchView('card');
        });
        
        // Modal
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });
        
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('editModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }
    
    // Agregar un nuevo proyecto
    addProject() {
        const name = document.getElementById('projectName').value;
        const description = document.getElementById('projectDescription').value;
        const priority = document.getElementById('projectPriority').value;
        const status = document.getElementById('projectStatus').value;
        
        // Validar que todos los campos estén completos
        if (!name || !description || !priority || !status) {
            alert('Por favor, complete todos los campos');
            return;
        }
        
        // Crear y agregar el proyecto
        const project = new Project(this.nextId++, name, description, priority, status);
        this.projects.push(project);
        this.saveProjects();
        
        // Limpiar el formulario
        document.getElementById('projectForm').reset();
        
        // Actualizar la visualización
        this.renderProjects();
        
        // Mostrar mensaje de éxito
        alert('Proyecto agregado exitosamente');
    }
    
    // Eliminar un proyecto
    deleteProject(id) {
        if (confirm('¿Está seguro de que desea eliminar este proyecto?')) {
            this.projects = this.projects.filter(project => project.id !== id);
            this.saveProjects();
            this.renderProjects();
        }
    }
    
    // Abrir modal para editar proyecto
    editProject(id) {
        const project = this.projects.find(p => p.id === id);
        if (!project) return;
        
        // Llenar el formulario con los datos del proyecto
        document.getElementById('editProjectId').value = project.id;
        document.getElementById('editProjectName').value = project.name;
        document.getElementById('editProjectDescription').value = project.description;
        document.getElementById('editProjectPriority').value = project.priority;
        document.getElementById('editProjectStatus').value = project.status;
        
        // Mostrar el modal
        document.getElementById('editModal').style.display = 'block';
    }
    
    // Actualizar un proyecto
    updateProject() {
        const id = parseInt(document.getElementById('editProjectId').value);
        const name = document.getElementById('editProjectName').value;
        const description = document.getElementById('editProjectDescription').value;
        const priority = document.getElementById('editProjectPriority').value;
        const status = document.getElementById('editProjectStatus').value;
        
        // Validar que todos los campos estén completos
        if (!name || !description || !priority || !status) {
            alert('Por favor, complete todos los campos');
            return;
        }
        
        // Actualizar el proyecto
        const projectIndex = this.projects.findIndex(p => p.id === id);
        if (projectIndex !== -1) {
            this.projects[projectIndex].name = name;
            this.projects[projectIndex].description = description;
            this.projects[projectIndex].priority = priority;
            this.projects[projectIndex].status = status;
            
            this.saveProjects();
            this.renderProjects();
            this.closeModal();
            
            alert('Proyecto actualizado exitosamente');
        }
    }
    
    // Cerrar modal
    closeModal() {
        document.getElementById('editModal').style.display = 'none';
    }
    
    // Cambiar entre vista de tabla y tarjetas
    switchView(view) {
        this.currentView = view;
        
        // Actualizar botones
        document.getElementById('tableViewBtn').classList.toggle('active', view === 'table');
        document.getElementById('cardViewBtn').classList.toggle('active', view === 'card');
        
        // Mostrar/ocultar contenedores
        document.getElementById('tableView').classList.toggle('active', view === 'table');
        document.getElementById('cardView').classList.toggle('active', view === 'card');
        
        // Renderizar proyectos en la vista actual
        this.renderProjects();
    }
    
    // Limpiar filtros
    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('statusFilter').value = '';
        document.getElementById('priorityFilter').value = '';
        this.renderProjects();
    }
    
    // Filtrar proyectos según los criterios de búsqueda
    getFilteredProjects() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const priorityFilter = document.getElementById('priorityFilter').value;
        
        return this.projects.filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(searchTerm) || 
                                 project.description.toLowerCase().includes(searchTerm);
            const matchesStatus = !statusFilter || project.status === statusFilter;
            const matchesPriority = !priorityFilter || project.priority === priorityFilter;
            
            return matchesSearch && matchesStatus && matchesPriority;
        });
    }
    
    // Renderizar proyectos en la vista actual
    renderProjects() {
        const filteredProjects = this.getFilteredProjects();
        
        if (this.currentView === 'table') {
            this.renderTableView(filteredProjects);
        } else {
            this.renderCardView(filteredProjects);
        }
    }
    
    // Renderizar vista de tabla
    renderTableView(projects) {
        const tbody = document.getElementById('projectsTableBody');
        tbody.innerHTML = '';
        
        if (projects.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No se encontraron proyectos</td></tr>';
            return;
        }
        
        projects.forEach(project => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${project.name}</td>
                <td>${project.description}</td>
                <td><span class="priority-badge priority-${project.priority}-badge">${this.capitalizeFirstLetter(project.priority)}</span></td>
                <td><span class="status-badge status-${project.status}">${this.getStatusText(project.status)}</span></td>
                <td>
                    <button class="btn-edit" onclick="projectManager.editProject(${project.id})">Editar</button>
                    <button class="btn-danger" onclick="projectManager.deleteProject(${project.id})">Eliminar</button>
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    // Renderizar vista de tarjetas
    renderCardView(projects) {
        const grid = document.getElementById('projectsGrid');
        grid.innerHTML = '';
        
        if (projects.length === 0) {
            grid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">No se encontraron proyectos</p>';
            return;
        }
        
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = `project-card priority-${project.priority}`;
            
            card.innerHTML = `
                <h4>${project.name}</h4>
                <p>${project.description}</p>
                <div class="project-meta">
                    <span class="status-badge status-${project.status}">${this.getStatusText(project.status)}</span>
                    <span class="priority-badge priority-${project.priority}-badge">${this.capitalizeFirstLetter(project.priority)}</span>
                </div>
                <div class="project-actions">
                    <button class="btn-edit" onclick="projectManager.editProject(${project.id})">Editar</button>
                    <button class="btn-danger" onclick="projectManager.deleteProject(${project.id})">Eliminar</button>
                </div>
            `;
            
            grid.appendChild(card);
        });
    }
    
    // Utilidad: capitalizar primera letra
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Obtener texto del estado
    getStatusText(status) {
        const statusMap = {
            'pendiente': 'Pendiente',
            'en-progreso': 'En Progreso',
            'completado': 'Completado'
        };
        
        return statusMap[status] || status;
    }
}

// Inicializar la aplicación cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.projectManager = new ProjectManager();
});
