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

#### Decimal a Binario
- Conversión de números decimales (0-255) o letras hexadecimales (A-F) a binario
- Formato: resultado en 8 bits
- Ejemplo: "255" → "11111111", "A" → "00001010"

#### Decimal a Octal
- Conversión de números decimales (0-255) a formato octal
- Formato: representación en base 8
- Ejemplo: "64" → "100", "255" → "377"

#### Calculadora de Módulo
- Operación módulo entre dos números enteros
- Formato: x mod y = resultado
- Ejemplo: "17 mod 5" → "2"

#### Conversión de Decimal Fraccionario a Binario
- Conversión de números decimales con parte fraccionaria a binario
- Precisión: Máximo 19 dígitos decimales
- Formato: parte entera.parte fraccionaria en binario
- Ejemplo: "0.00239" → "0.0000000010011100101"

#### Codificación Aritmética
- Análisis completo de mensajes para codificación aritmética
- Tabla automática con:
  - Caracteres únicos en orden de aparición
  - Frecuencia de cada carácter
  - Probabilidad (con alta precisión decimal)
  - Rangos acumulativos
  - Límites inferiores y superiores para codificación
- Consideración completa de espacios
- Ejemplo: "ALESSANDRO" genera tabla con A, L, E, S, N, D, R, O

### 🎨 Interfaz de Usuario

#### Controles de Tamaño de Fuente
- Botones A+ y A- para cada sección
- Rango ajustable: 10px a 24px
- Control independiente para:
  - Diccionario de caracteres
  - Salida binaria
  - Salida hexadecimal
  - Salida decimal a binario
  - Salida decimal a octal
  - Resultado de módulo
  - Salida decimal fraccionario a binario
  - Tabla de codificación aritmética

#### Funcionalidad de Copiado
- Botones de copia (📋) para todas las entradas y salidas
- Copia instantánea al portapapeles
- Feedback visual al copiar

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

### 2. Convertir Texto y Números
1. **Texto a binario**: Escribe en el primer campo de texto
2. **Texto a hexadecimal**: Escribe en el segundo campo de texto
3. **Decimal a binario**: Ingresa números (0-255) o letras hex (A-F)
4. **Decimal a octal**: Ingresa números decimales (0-255)
5. **Módulo**: Ingresa dividendo y divisor para calcular el resto
6. **Decimal fraccionario a binario**: Ingresa números con decimales
7. **Codificación aritmética**: Ingresa cualquier mensaje (incluyendo espacios)
8. Los resultados aparecen instantáneamente

### 3. Ajustar Visualización
- Usa los botones **A+** y **A-** para cambiar el tamaño de fuente
- Cada sección tiene controles independientes

## 🎯 Casos de Uso

- **Educación**: Aprender conversiones de texto a binario/hexadecimal
- **Programación**: Verificar codificaciones de caracteres
- **Criptografía**: Análisis de representaciones numéricas y codificación aritmética
- **Algoritmos de compresión**: Implementación y análisis de codificación aritmética
- **Matemáticas aplicadas**: Conversiones entre sistemas numéricos y fracciones
- **Debugging**: Inspeccionar valores de caracteres

## 🔧 Estructura del Proyecto

```
Seguridad Web/
├── README.md                           # Este archivo
├── index.html                          # Archivo principal HTML
├── styles.css                          # Estilos CSS
└── js/
    ├── const.js                        # Constantes del proyecto
    ├── index.js                        # Lógica principal
    ├── controllers/
    │   └── fontsize_controller.js      # Control de tamaños de fuente
    └── utils/
        ├── clipboard_utils.js          # Utilidades de portapapeles
        ├── conversion_utils.js         # Funciones de conversión
        └── dom_utils.js               # Utilidades del DOM
```

## 🤝 Contribuciones

Este proyecto está abierto a mejoras. Algunas ideas para futuras características:

- [X] Conversión decimal a binario
- [X] Conversión decimal a octal
- [X] Calculadora de módulo
- [X] Conversión de decimal fraccionario a binario
- [X] Tabla de codificación aritmética completa
- [X] Funcionalidad de copiado completa
- [X] Controles de tamaño de fuente para todas las secciones
- [ ] Exportar resultados a archivo
- [ ] Modo oscuro
- [ ] Historial de conversiones
- [ ] Más conjuntos de caracteres especiales
- [ ] Conversión a otras bases numéricas

## 📄 Licencia

Este proyecto es de uso libre para fines educativos y de desarrollo.

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, por favor reporta los issues o contribuye con mejoras al código.

---

**Desarrollado con ❤️ para facilitar el desarrollo de tareas de la materia de Seguridad en el desarrollo de software**