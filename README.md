# Conversor de Texto - Binario y Hexadecimal

Una aplicación web interactiva que permite convertir texto a formato binario y hexadecimal en tiempo real, además de proporcionar un diccionario de caracteres numerado personalizable.

## 🚀 Características Principales

### 📚 Diccionario de Caracteres Numerado
- **Alfabeto en mayúsculas**: A=0 hasta Z=25 (base fija)
- **Opciones personalizables**:
  - Minúsculas: a=26 hasta z=51
  - Números: 0=52 hasta 9=61
  - Espacio: =62
- **Caracteres especiales**: Selección visual con click simple
- **Exclusión automática**: Las letras ñ y Ñ se excluyen del conteo
- **Numeración consistente**: Mantiene el orden secuencial

### 🔄 Conversión en Tiempo Real

#### Texto a Binario
- Conversión instantánea mientras escribes
- Formato: cada carácter se convierte a 8 bits separados por espacios
- Ejemplo: "Hola" → "01001000 01101111 01101100 01100001"

#### Texto a Hexadecimal
- Conversión automática a formato hexadecimal
- Formato: valores en mayúsculas separados por espacios
- Ejemplo: "Hola" → "48 6F 6C 61"

### 🎨 Interfaz de Usuario

#### Controles de Tamaño de Fuente
- Botones A+ y A- para cada sección
- Rango ajustable: 10px a 24px
- Control independiente para:
  - Diccionario de caracteres
  - Salida binaria
  - Salida hexadecimal

#### Selección de Caracteres Especiales
- **Click simple**: Seleccionar carácter
- **Doble click**: Deseleccionar carácter
- **Selección múltiple**: Sin necesidad de Ctrl/Alt
- **Indicador visual**: Caracteres seleccionados en azul

## 📋 Caracteres Especiales Disponibles

### Símbolos Comunes
`! @ # $ % ^ & * ( ) _ + - = [ ] { } | ; : , . < > ?`

### Acentos Españoles
`á é í ó ú ü Á É Í Ó Ú Ü`

### Otros Caracteres
`ç Ç € £ ¥ ¢ © ® ™ ± × ÷ √ ∞ ♠ ♣ ♥ ♦ ★ ☆ ♪ ♫`

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Diseño responsivo con Flexbox
- **JavaScript ES6+**: Lógica de conversión y manejo de eventos
- **Diseño responsivo**: Compatible con dispositivos móviles

## 📱 Compatibilidad

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Dispositivos móviles

## 🚀 Instalación y Uso

### Opción 1: Servidor Local
```bash
# Navegar al directorio del proyecto
cd "Seguridad Web"

# Iniciar servidor HTTP con Python
python -m http.server 8000

# Abrir en el navegador
# http://localhost:8000/index.html
```

### Opción 2: Abrir Directamente
Simplemente abre el archivo `index.html` en tu navegador web.

## 📖 Guía de Uso

### 1. Configurar el Diccionario
1. El alfabeto en mayúsculas (A-Z) siempre está visible
2. Marca las casillas para incluir:
   - ☑️ Mostrar minúsculas
   - ☑️ Mostrar números
   - ☑️ Mostrar espacio
3. Selecciona caracteres especiales haciendo click en ellos
4. Para deseleccionar, haz doble click

### 2. Convertir Texto
1. **Para binario**: Escribe en el primer campo de texto
2. **Para hexadecimal**: Escribe en el segundo campo de texto
3. Los resultados aparecen instantáneamente

### 3. Ajustar Visualización
- Usa los botones **A+** y **A-** para cambiar el tamaño de fuente
- Cada sección tiene controles independientes

## 🎯 Casos de Uso

- **Educación**: Aprender conversiones de texto a binario/hexadecimal
- **Programación**: Verificar codificaciones de caracteres
- **Criptografía**: Análisis de representaciones numéricas
- **Debugging**: Inspeccionar valores de caracteres

## 🔧 Estructura del Proyecto

```
Seguridad Web/
├── index.html          # Archivo principal
├── index.js            # Lógica de JavaScript
├── README.md          # Este archivo
└── styles.css          # Estilos CSS
```

## 🤝 Contribuciones

Este proyecto está abierto a mejoras. Algunas ideas para futuras características:

- [ ] Conversión a octal
- [ ] Exportar resultados a archivo
- [ ] Modo oscuro
- [ ] Historial de conversiones
- [ ] Más conjuntos de caracteres especiales

## 📄 Licencia

Este proyecto es de uso libre para fines educativos y de desarrollo.

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, por favor reporta los issues o contribuye con mejoras al código.

---

**Desarrollado con ❤️ para facilitar el aprendizaje de conversiones de texto**