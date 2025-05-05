# 360FrontendChallenge

## Descripción
Frontend para sistema de evaluaciones 360° desarrollado con REACT. Proporciona interfaz gráfica para gestión completa de usuarios, empleados y evaluaciones de desempeño.

## 🚀 Instalación Rápida

1. **Clonar repositorio**:
```bash
git clone https://github.com/ByronChang/360FrontendChallenge.git
cd 360FrontendChallenge
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar entorno** (crear `.env`):
```bash
cat > .env <<EOL
VITE_API_BASE_URL=http://localhost:2999
EOL
```

## 💻 Comandos Esenciales

| Comando                | Descripción                              |
|------------------------|------------------------------------------|
| `npm run dev`    | Inicia en modo desarrollo (hot reload)   |
| `npm run build`        | Compila a JS para producción            |
| `npm run start`   | Ejecuta la versión compilada            |


## 🔧 Configuración Requerida

### Variables de Entorno Obligatorias
```env
VITE_API_BASE_URL=your_api_url_connection_string
```

## 🔐 Roles del Sistema

| Rol        | Permisos                               | Endpoints clave                     |
|------------|----------------------------------------|-------------------------------------|
| `admin`    | Acceso total                           | POST /auth/register, DELETE /users |
| `manager`  | Gestiona su equipo                     | GET /employees, POST /evaluations  |
| `employee` | Autoevaluación y feedback              | GET /evaluations/employee/:id      |

## 🛠️ Endpoints Principales

### Autenticación
- `POST /auth/register` - Registro (solo admin)
- `POST /auth/login` - Inicio sesión

### Empleados
- `POST /employees` - Crear empleado
- `GET /employees/:id` - Obtener detalle

### Evaluaciones
- `POST /evaluations` - Crear evaluación
- `GET /evaluations/employee/:id` - Listar por empleado

## 📄 Licencia
MIT © Byron Chang 2025
```