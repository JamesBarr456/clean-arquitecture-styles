
## 📅 2025-06-24

### 🧠 Pensamientos del día
- Tener que hacer una memoria de los avances respecto al clean arquithecture

### 🛠️ Lo que hice
- Empecé a registrar mis ideas con estructura.
- Vi que Markdown es más útil que `.txt` puro.
- En el domain cree la carpeta entities donde tengo alojado la entidad de `user` 
- En dicha entidad tengo un metodo para el registro que verifica los campos necesarios (proximo paso seria quitar esta responsabilidad y darselo a un DTO)
- En `infraestructure` --> tengo la carpeta de mongo donde alojé el modelo de user.
- Cree el `repository` de domain para user, los repository serian `contratos` que pueden ser interfaces o abstract class definiendo qué métodos existen, qué parámetros aceptan y qué devuelven.
- `use-cases/**`: Acciones que se pueden ejecutar dentro del sistema (crear usuario, registrar producto, etc.).
- Ya se encuentra implementado el repositorio de presentation.
- Se encuentra funcionando las rutas de auth y controladores.
### 💡 Tareas a realizar
- 
---