# InputFileMetadata.js

**InputFileMetadata.js** es una librería ligera en Vanilla JavaScript que transforma los campos de subida de archivos (`<input type="file">`) estándar en una interfaz moderna y estilizada. Su principal objetivo es capturar de forma inteligente metadatos asociados al archivo (como Título, Descripción, Nombre Original, Extensión, Peso y Fecha de subida) y adjuntarlos automáticamente para su fácil envío.

## Características Principales

*   **Sin dependencias:** Escrita totalmente en Vanilla JS (no requiere jQuery, Bootstrap, etc.).
*   **Estilos automáticos:** El diseño (parecido a Bootstrap) se inyecta directamente, evitando conflictos con CSS existente en tus proyectos.
*   **Campos ocultos generados:** Genera de manera automática `<input type="hidden">` con todos los metadatos para que se envíen con `FormData` de manera nativa sin código extra.
*   **Validaciones integradas:** Obliga a que los metadatos necesarios sean completados (en el modo Modal).
*   **Dos modos de funcionamiento:** Modal emergente o lectura dinámica desde inputs externos.

---

## Instalación y Uso

Solo necesitas incluir el script en tu HTML y luego llamar a su función de inicialización:

```html
<!-- Incluye la librería al final del body -->
<script src="InputFileMetadata.js"></script>
<script>
    // Inicializar la librería en todos los inputs que tengan la clase correspondiente
    InputFileMetadata.init();
</script>
```

---

## Modos de Funcionamiento y Ejemplos

Existen dos formas de utilizar esta librería en tus formularios dependiendo de si quieres que aparezca un *Modal* para pedir los datos, o si prefieres que los lea de *otros campos* ya existentes en el formulario.

### Modo 1: Ventana Modal (Por Defecto)

Este es el comportamiento predeterminado. Al hacer clic en el recuadro, se abrirá un modal pidiendo el **Título**, la **Descripción** y el **Archivo**.

**¿Cómo usarlo?**
Simplemente agrega la clase `inputFileMetadata` a tu `<input type="file">`.

```html
<form>
    <div style="margin-bottom: 20px;">
        <label>Contrato Firmado:</label>
        <!-- Con solo poner la clase, la librería hace el resto -->
        <input type="file" name="contrato" class="inputFileMetadata">
    </div>
    
    <button type="submit">Enviar</button>
</form>
```

**Resultado interno:**
Cuando el usuario llene el modal y le dé a Aceptar, la librería inyectará en el HTML:
```html
<input type="hidden" name="contrato_title" value="...texto...">
<input type="hidden" name="contrato_desc" value="...texto...">
<input type="hidden" name="contrato_fecha" value="...fecha...">
<input type="hidden" name="contrato_nombreOriginal" value="...nombre...">
<input type="hidden" name="contrato_extension" value="...extensión...">
<input type="hidden" name="contrato_size" value="...tamaño...">
```

### Modo 2: Sin Modal (Sincronizado con Inputs Externos)

Este modo es ideal si en tu formulario ya tienes los campos de "Título" o "Asunto" a la vista del usuario y no quieres interrumpirlo con una ventana emergente. 

Al hacer clic, se abrirá el explorador de archivos nativo directamente. Luego de seleccionar el archivo, la librería "escuchará" lo que el usuario escriba en los inputs externos y sincronizará los metadatos ocultos.

**¿Cómo usarlo?**
Agrega los atributos `meta-title` y `meta-desc` apuntando al `id` o `name` de los inputs de los cuales debe extraer la información.

```html
<form>
    <div>
        <label>Asunto del Documento:</label>
        <input type="text" name="asunto_documento" id="asunto_doc">
    </div>
    
    <div>
        <label>Detalle:</label>
        <input type="text" name="detalle_documento" id="detalle_doc">
    </div>

    <div>
        <label>Archivo Adjunto:</label>
        <!-- La librería lee meta-title y meta-desc y cancela el Modal automáticamente -->
        <input type="file" name="archivo" class="inputFileMetadata" 
               meta-title="asunto_doc" 
               meta-desc="detalle_doc">
    </div>
    
    <button type="submit">Enviar</button>
</form>
```

*Nota: También puedes forzar este comportamiento (cancelar el modal) agregando el atributo `meta-modal="false"`.*

---

## Recuperar Metadatos desde JavaScript

Además de inyectar los `<input type="hidden">` para envío tradicional, la librería inyecta un objeto completo en la propiedad `.fileMetadata` del elemento del DOM (tu input original). Esto es sumamente útil si haces envíos usando Fetch/Axios y requieres los datos ordenados en un JSON.

```javascript
const miInput = document.querySelector('input[name="contrato"]');

// Verificar si hay archivo cargado y metadatos disponibles
if (miInput.files.length > 0 && miInput.fileMetadata) {
    console.log(miInput.fileMetadata);
    
    /* Retornará un objeto como este:
    {
        file: File, // El objeto binario nativo del archivo
        titulo: "Título ingresado",
        descripcion: "Descripción ingresada",
        fecha: "2026-07-22T11:45:00.000Z",
        nombreOriginal: "documento.pdf",
        extension: "pdf",
        size: 10240
    }
    */
}
```

## Autor

* **Jack E. Charalla Cutipa** 
  * GitHub: [@JackCharalla](https://github.com/JackCharalla)