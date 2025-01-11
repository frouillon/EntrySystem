# Sistema de Acceso con Tarjetas - ESP32 + Node.js + React

Este proyecto consiste en un sistema de acceso controlado mediante tarjetas RFID que utiliza un **ESP32** como dispositivo principal para leer las tarjetas, un **backend** desarrollado con **Node.js** y **Express** para gestionar la autenticación, y un **frontend** interactivo desarrollado con **React** para la administración de usuarios y el monitoreo del sistema.

## Descripción

El sistema permite a los usuarios registrarse y acceder a áreas controladas mediante el uso de tarjetas RFID. El **ESP32** se encarga de leer las tarjetas y enviar los datos al servidor backend. El backend procesa la solicitud y devuelve una respuesta que se refleja en el frontend en tiempo real, indicando si el acceso ha sido concedido o denegado.

### Características principales:
- **Lectura de tarjetas RFID** mediante el ESP32.
- **Backend con Node.js y Express** para la gestión de autenticación y control de acceso.
- **Frontend con React** para la visualización y gestión del sistema y usuarios.
- Almacenamiento de datos de acceso y registros de usuarios.
- Seguridad básica para controlar los accesos mediante tarjetas válidas.

## Diagrama de Arquitectura

```plaintext
[Tarjeta RFID] → [ESP32] → [Backend (Node.js + Express)] → [Frontend (React)]
                                       ↑
                                Base de datos (MySQL)
