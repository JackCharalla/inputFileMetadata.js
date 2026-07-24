/*!
  * inputFileMetadata v1.0 (https://github.com/JackCharalla/inputFileMetadata.js)
  * Copyright 2026 - Jack Charalla
  * Gobierno Regional del Cusco - Proyecto de Modernización
  */

const InputFileMetadata = (function() {
    let modal = null;
    let currentInputWrapper = null;
    
    function createModal() {
        if (modal) return;
        
        // Modal Container
        modal = document.createElement('div');
        modal.style.cssText = "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: none; align-items: center; justify-content: center; z-index: 99999; font-family: system-ui, -apple-system, sans-serif;";
        
        // Modal Dialog
        const dialog = document.createElement('div');
        dialog.style.cssText = "background: #fff; border-radius: 8px; width: 90%; max-width: 500px; box-shadow: 0 4px 15px rgba(0,0,0,0.2); display: flex; flex-direction: column;";
        
        // Header
        const header = document.createElement('div');
        header.style.cssText = "padding: 16px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;";
        
        const title = document.createElement('h5');
        title.innerText = "Detalles del Archivo";
        title.style.cssText = "margin: 0; font-size: 1.25rem; font-weight: 500; color: #212529;";
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = "&times;";
        closeBtn.style.cssText = "background: transparent; border: none; font-size: 1.5rem; cursor: pointer; line-height: 1; color: #6c757d;";
        closeBtn.onclick = closeModal;
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // Body
        const body = document.createElement('div');
        body.style.cssText = "padding: 16px; display: flex; flex-direction: column; gap: 16px;";
        
        const createGroup = (labelText) => {
            const group = document.createElement('div');
            group.style.cssText = "display: flex; flex-direction: column; gap: 6px;";
            const label = document.createElement('label');
            label.innerText = labelText;
            label.style.cssText = "font-weight: 500; font-size: 0.9rem; color: #212529;";
            group.appendChild(label);
            return group;
        };
        
        const titleGroup = createGroup("Título:");
        const titleInput = document.createElement('input');
        titleInput.type = "text";
        titleInput.id = "ifm-title";
        titleInput.placeholder = "Ingrese un título...";
        titleInput.style.cssText = "padding: 8px 12px; border: 1px solid #ced4da; border-radius: 4px; font-size: 1rem; width: 100%; box-sizing: border-box; outline: none;";
        titleInput.onfocus = () => titleInput.style.borderColor = '#86b7fe';
        titleInput.onblur = () => titleInput.style.borderColor = '#ced4da';
        titleGroup.appendChild(titleInput);
        
        const descGroup = createGroup("Descripción:");
        const descInput = document.createElement('textarea');
        descInput.id = "ifm-desc";
        descInput.rows = 3;
        descInput.placeholder = "Ingrese una descripción...";
        descInput.style.cssText = "padding: 8px 12px; border: 1px solid #ced4da; border-radius: 4px; font-size: 1rem; width: 100%; box-sizing: border-box; resize: vertical; outline: none;";
        descInput.onfocus = () => descInput.style.borderColor = '#86b7fe';
        descInput.onblur = () => descInput.style.borderColor = '#ced4da';
        descGroup.appendChild(descInput);
        
        const fileGroup = createGroup("Archivo:");
        const fileInput = document.createElement('input');
        fileInput.type = "file";
        fileInput.id = "ifm-file";
        fileInput.style.cssText = "font-size: 0.95rem; padding: 4px 0;";
        fileGroup.appendChild(fileInput);
        
        body.appendChild(titleGroup);
        body.appendChild(descGroup);
        body.appendChild(fileGroup);
        
        const errorLabel = document.createElement('div');
        errorLabel.id = "ifm-error";
        errorLabel.innerText = "Todos los campos son obligatorios.";
        errorLabel.style.cssText = "color: #dc3545; font-size: 0.875rem; margin-top: 5px; display: none; text-align: center; font-weight: 500;";
        body.appendChild(errorLabel);
        
        // Footer
        const footer = document.createElement('div');
        footer.style.cssText = "padding: 16px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 10px;";
        
        const cancelBtn = document.createElement('button');
        cancelBtn.innerText = "Cancelar";
        cancelBtn.style.cssText = "padding: 6px 14px; border: 1px solid #6c757d; background: transparent; border-radius: 4px; cursor: pointer; color: #6c757d; font-size: 1rem; transition: background 0.2s;";
        cancelBtn.onmouseover = () => { cancelBtn.style.background = '#6c757d'; cancelBtn.style.color = '#fff'; };
        cancelBtn.onmouseout = () => { cancelBtn.style.background = 'transparent'; cancelBtn.style.color = '#6c757d'; };
        cancelBtn.onclick = closeModal;
        
        const acceptBtn = document.createElement('button');
        acceptBtn.innerText = "Aceptar";
        acceptBtn.style.cssText = "padding: 6px 14px; border: 1px solid #0d6efd; background: #0d6efd; color: #fff; border-radius: 4px; cursor: pointer; font-size: 1rem; transition: background 0.2s;";
        acceptBtn.onmouseover = () => { acceptBtn.style.background = '#0b5ed7'; };
        acceptBtn.onmouseout = () => { acceptBtn.style.background = '#0d6efd'; };
        acceptBtn.onclick = handleAccept;
        
        footer.appendChild(cancelBtn);
        footer.appendChild(acceptBtn);
        
        dialog.appendChild(header);
        dialog.appendChild(body);
        dialog.appendChild(footer);
        
        modal.appendChild(dialog);
        document.body.appendChild(modal);
    }
    
    function openModal(wrapper) {
        currentInputWrapper = wrapper;
        
        // cargamos los datos de los input hidden en caso existan
        document.getElementById('ifm-title').value = wrapper.dataset.title || '';
        document.getElementById('ifm-desc').value = wrapper.dataset.desc || '';
        document.getElementById('ifm-file').value = ''; // Reset file input to prevent path issues, files can't be set programmatically
        
        // Reseteamos los estilos de valiación
        document.getElementById('ifm-title').style.borderColor = '#ced4da';
        document.getElementById('ifm-desc').style.borderColor = '#ced4da';
        document.getElementById('ifm-file').style.color = 'inherit';
        document.getElementById('ifm-error').style.display = 'none';
        
        modal.style.display = 'flex';
    }
    
    function closeModal() {
        if(modal) modal.style.display = 'none';
        currentInputWrapper = null;
    }
    
    function handleAccept() {
        if (!currentInputWrapper) return;
        
        const titleInput = document.getElementById('ifm-title');
        const descInput = document.getElementById('ifm-desc');
        const modalFileInput = document.getElementById('ifm-file');
        const errorLabel = document.getElementById('ifm-error');
        
        const title = titleInput.value.trim();
        const desc = descInput.value.trim();
        
        const originalInput = currentInputWrapper.querySelector('input[type="file"].inputFileMetadata');
        const hasNewFile = modalFileInput.files.length > 0;
        const hasExistingFile = originalInput.files.length > 0;
        
        let isValid = true;
        
        if (!title) {
            titleInput.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            titleInput.style.borderColor = '#ced4da';
        }
        
        if (!desc) {
            descInput.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            descInput.style.borderColor = '#ced4da';
        }
        
        if (!hasNewFile && !hasExistingFile) {
            modalFileInput.style.color = '#dc3545';
            isValid = false;
        } else {
            modalFileInput.style.color = 'inherit';
        }
        
        if (!isValid) {
            errorLabel.style.display = 'block';
            return;
        }
        
        errorLabel.style.display = 'none';
        
        // verificamos si existe un archivo nuevo en el input file
        if (hasNewFile) {
            const file = modalFileInput.files[0];
            
            // Transferimos los metadatos a los input hidden
            const dt = new DataTransfer();
            dt.items.add(file);
            originalInput.files = dt.files;
            
            // Preparamos los metadatos
            const date = new Date().toISOString();
            const originalName = file.name;
            const extension = originalName.includes('.') ? originalName.split('.').pop() : '';
            const size = file.size;
            
            // Almacenamos los metadatos en el contenedor para volver a mostrarlos si se hace clic
            currentInputWrapper.dataset.title = title;
            currentInputWrapper.dataset.desc = desc;
            
            // Exponemos el objeto de metadatos al desarrollador a través de la propiedad de entrada original
            originalInput.fileMetadata = {
                file: file,
                titulo: title,
                descripcion: desc,
                fecha: date,
                nombreOriginal: originalName,
                extension: extension,
                size: size
            };
            
            // Actualizamos el texto a mostrar
            const display = currentInputWrapper.querySelector('.ifm-display');
            display.innerHTML = '📄 ' + originalName;
            display.style.color = '#0d6efd';
            
            updateHiddenInputs(currentInputWrapper, originalInput);
        } else {
            // Si no se seleccionó ningún archivo nuevo, actualizamos los metadatos si ya existe un archivo
            if(originalInput.files.length > 0) {
                currentInputWrapper.dataset.title = title;
                currentInputWrapper.dataset.desc = desc;
                
                if(originalInput.fileMetadata) {
                    originalInput.fileMetadata.titulo = title;
                    originalInput.fileMetadata.descripcion = desc;
                }
                
                updateHiddenInputs(currentInputWrapper, originalInput);
            }
        }
        
        closeModal();
    }
    
    function updateHiddenInputs(wrapper, originalInput) {
        if (!originalInput.fileMetadata) return;
        const meta = originalInput.fileMetadata;
        
        const fields = [
            { key: 'titulo', suffix: '_title' },
            { key: 'descripcion', suffix: '_desc' },
            { key: 'fecha', suffix: '_fecha' },
            { key: 'nombreOriginal', suffix: '_nombreOriginal' },
            { key: 'extension', suffix: '_extension' },
            { key: 'size', suffix: '_size' }
        ];

        fields.forEach(field => {
            let hiddenInput = wrapper.querySelector('.ifm-hidden-' + field.key);
            if(!hiddenInput) {
                hiddenInput = document.createElement('input');
                hiddenInput.type = 'hidden';
                hiddenInput.className = 'ifm-hidden-' + field.key;
                hiddenInput.name = originalInput.name ? originalInput.name + field.suffix : 'file' + field.suffix;
                wrapper.appendChild(hiddenInput);
            }
            hiddenInput.value = meta[field.key];
        });
    }
    
    function init() {
        if(document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupInputs);
        } else {
            setupInputs();
        }
    }
    
    function setupInputs() {
        createModal();
        
        const inputs = document.querySelectorAll('input[type="file"].inputFileMetadata');
        
        inputs.forEach(input => {
            if (input.dataset.ifmInitialized) return;
            
            const metaTitleId = input.getAttribute('meta-title');
            const metaDescId = input.getAttribute('meta-desc');
            const metaModal = input.getAttribute('meta-modal');
            
            const useModal = !(metaModal === 'false' || (metaTitleId && metaDescId));
            
            // Creamos un contenedor que actúe como el botón
            const wrapper = document.createElement('div');
            wrapper.style.cssText = "display: inline-flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid #ced4da; padding: 10px 20px; border-radius: 6px; background-color: #f8f9fa; min-width: 150px; width:100%; text-align: center; font-family: system-ui, -apple-system, sans-serif; transition: all 0.2s;";
            wrapper.onmouseover = () => { wrapper.style.backgroundColor = '#e9ecef'; wrapper.style.borderColor = '#adb5bd'; };
            wrapper.onmouseout = () => { wrapper.style.backgroundColor = '#f8f9fa'; wrapper.style.borderColor = '#ced4da'; };
            
            // Reemplazamos el elemento de entrada con un contenedor y coloca el elemento de entrada dentro del contenedor (div modal)
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            
            // Ocultamos visualmente el campo de entrada de archivo real
            input.style.display = 'none';
            
            // Mostramos el texto para el contendor input modificado
            const display = document.createElement('span');
            display.className = 'ifm-display';
            display.innerText = "🔗 Cargar archivo";
            display.style.cssText = "color: #495057; font-size: 1rem;";
            wrapper.appendChild(display);
            
            if (!useModal) {
                let titleEl = null;
                let descEl = null;
                
                if (metaTitleId) {
                    titleEl = document.getElementById(metaTitleId) || document.querySelector(`[name="${metaTitleId}"]`);
                }
                if (metaDescId) {
                    descEl = document.getElementById(metaDescId) || document.querySelector(`[name="${metaDescId}"]`);
                }
                
                const syncMetadata = () => {
                    if (input.files.length > 0) {
                        if (!input.fileMetadata) {
                            const file = input.files[0];
                            const originalName = file.name;
                            input.fileMetadata = {
                                file: file,
                                fecha: new Date().toISOString(),
                                nombreOriginal: originalName,
                                extension: originalName.includes('.') ? originalName.split('.').pop() : '',
                                size: file.size
                            };
                        }
                        
                        input.fileMetadata.titulo = titleEl ? titleEl.value : '';
                        input.fileMetadata.descripcion = descEl ? descEl.value : '';
                        
                        updateHiddenInputs(wrapper, input);
                    }
                };

                // Escuchamos cuando el usuario escribe en los inputs externos
                if (titleEl) titleEl.addEventListener('input', syncMetadata);
                if (descEl) descEl.addEventListener('input', syncMetadata);

                // Si no usamos el modal, escuchamos el evento change de los inputs
                input.addEventListener('change', (e) => {
                    if (input.files.length > 0) {
                        // Forzamos a regenerar el objeto al cambiar de archivo
                        input.fileMetadata = null;
                        syncMetadata();
                        
                        // ACtualizamos el contenedor con el nombre del archivo
                        const originalName = input.files[0].name;
                        display.innerHTML = '📄 ' + originalName;
                        display.style.color = '#0d6efd';
                    } else {
                        // en caso no se haya cargado el archivo, se muestra el texto del contendor original
                        display.innerHTML = "🔗 Cargar archivo";
                        display.style.color = '#495057';
                        display.style.fontWeight = 'normal';
                    }
                });
            }
            
            // validamos el clic en el contenedor para abrir el modal o activar el diálogo nativo de archivos
            wrapper.addEventListener('click', (e) => {
                // Evitar un bucle infinito de clics si el objetivo era el propio campo de entrada
                if(e.target === input) return;
                
                if (useModal) {
                    e.preventDefault();
                    openModal(wrapper);
                } else {
                    // Permitimos que se abra el cuadro de diálogo de archivos nativo haciendo clic en el campo de entrada de archivos oculto
                    input.click();
                }
            });
            
            input.dataset.ifmInitialized = "true";
        });
    }

    return {
        init: init
    };
})();
