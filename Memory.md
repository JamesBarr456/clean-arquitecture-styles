
## 📅 2025-06-24

### 🧠 Pensamientos del día
- Tener que hacer una memoria de los avances respecto al clean arquithecture

### 🛠️ Lo que hice
- Empecé a registrar mis ideas con estructura.
- Vi que Markdown es más útil que `.txt` puro.
- En el domain cree la carpeta entities donde tengo alojado la entidad de *user* 
- En *dicha* entidad tengo un metodo para el registro que verifica los campos necesarios (proximo paso seria quitar esta responsabilidad y darselo a un DTO)
- En *infraestructure* --> tengo la carpeta de mongo donde alojé el modelo de user.
- Cree el *repository* de domain para user, los repository serian *contratos* que pueden ser interfaces o abstract class definiendo qué métodos existen, qué parámetros aceptan y qué devuelven.

### 💡 Tareas a realizar
- Falta escribir los repositorios de domain y presentation
- Falta crear la ruta
- Falta los controllers
- Falta los casos de usos / *use-cases* 

---