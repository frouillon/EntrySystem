#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include "CTBot.h"
#include "token.h"

// Pin Definitions
#define SS_PIN 5
#define RST_PIN 15
#define BUZZER_PIN 14
#define LED_PIN 2
#define PIR_PIN 13  // Pin del sensor PIR

// LCD Configuration
#define LCD_ADDRESS 0x27
#define LCD_COLUMNS 16
#define LCD_ROWS 2
LiquidCrystal_I2C lcd(LCD_ADDRESS, LCD_COLUMNS, LCD_ROWS);

// Telegram Bot
CTBot miBot;
TBMessage msg;

// RFID and WiFi Configuration
MFRC522 mfrc522(SS_PIN, RST_PIN);

// Melody Notes
int happyNotes[] = {1047, 1175, 1319, 1397};
int noteDuration = 150;
int alertNotes[] = {523, 440, 349};
int alertDuration = 400;

// Variables de control
bool rfidEnabled = true; // El sistema comienza activado
bool pirEnabled = false; // El sensor PIR comienza desactivado
unsigned long lastScanTime = 0;
unsigned long lastPirMessageTime = 0;
const unsigned long resetLCDDelay = 5000; // 5 segundos
const unsigned long pirCooldown = 10000; // 10 segundos entre mensajes de PIR

void setup() {
  // Inicialización de componentes
  Serial.begin(115200);
  lcd.init();
  lcd.backlight();
  initializeRFID();
  connectToWiFi();
  initializeBuzzer();
  initializeTelegram();

  // Configuración del LED y estado inicial
  pinMode(LED_PIN, OUTPUT);
  pinMode(PIR_PIN, INPUT);
  digitalWrite(LED_PIN, HIGH); // LED encendido al iniciar
  Serial.println("Sistema RFID Activado");

  displaySystemActiveMessage();
}

void loop() {
  // Revisar mensajes de Telegram
  checkTelegramMessages();

  // Si RFID está habilitado, detectar tarjetas
  if (rfidEnabled) {
    if (detectNewCard()) {
      String uidString = getCardUID();
      Serial.print("Card UID: ");
      Serial.println(uidString);

      if (WiFi.status() == WL_CONNECTED) {
        handleCard(uidString);
      }

      lastScanTime = millis(); // Registrar tiempo del último escaneo
    }
  }

  // Mostrar mensaje "Pase tarjeta" después de 5 segundos
  if (rfidEnabled && millis() - lastScanTime >= resetLCDDelay) {
    displayWaitingMessage();
  }

  // Si el PIR está habilitado, revisar detección de movimiento
  if (pirEnabled && digitalRead(PIR_PIN) == HIGH) {
    unsigned long currentTime = millis();
    if (currentTime - lastPirMessageTime >= pirCooldown) {
      Serial.println("Movimiento detectado");
      miBot.sendMessage(msg.sender.id, "Movimiento detectado por el sensor PIR!");
      lastPirMessageTime = currentTime;
    }
  }

  delay(500);
}

void initializeRFID() {
  SPI.begin();
  mfrc522.PCD_Init();
  lcd.setCursor(0, 0);
  lcd.print("RFID Iniciado");
}

void connectToWiFi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi conectado!");
}

void initializeBuzzer() {
  pinMode(BUZZER_PIN, OUTPUT);
}

void initializeTelegram() {
  Serial.println("Iniciando Bot de Telegram...");
  miBot.wifiConnect(ssid, password);
  miBot.setTelegramToken(token);

  if (miBot.testConnection()) {
    Serial.println("Conectado al Bot de Telegram!");
  } else {
    Serial.println("Error al conectar con el Bot!");
    while (true);
  }
}

void checkTelegramMessages() {
  if (miBot.getNewMessage(msg) == CTBotMessageText) {
    Serial.print("Mensaje recibido: ");
    Serial.println(msg.text);

    if (msg.text.equalsIgnoreCase("activar")) {
      rfidEnabled = true;
      digitalWrite(LED_PIN, HIGH);
      miBot.sendMessage(msg.sender.id, "Sistema RFID Activado");
      lcd.clear();
      lcd.print("RFID Activado");
      displayWaitingMessage();
    } else if (msg.text.equalsIgnoreCase("desactivar")) {
      rfidEnabled = false;
      digitalWrite(LED_PIN, LOW);
      miBot.sendMessage(msg.sender.id, "Sistema RFID Desactivado");
      lcd.clear();
      lcd.print("RFID Desactivado");
    } else if (msg.text.equalsIgnoreCase("activar pir")) {
      pirEnabled = true;
      miBot.sendMessage(msg.sender.id, "Sensor PIR Activado");
    } else if (msg.text.equalsIgnoreCase("desactivar pir")) {
      pirEnabled = false;
      miBot.sendMessage(msg.sender.id, "Sensor PIR Desactivado");
    } else if (msg.text.equalsIgnoreCase("activar modo seguro")) {
      rfidEnabled = false; // Desactiva RFID
      pirEnabled = true;  // Activa PIR

      digitalWrite(LED_PIN, LOW); // Apaga el LED como indicativo de que RFID está desactivado
      miBot.sendMessage(msg.sender.id, "Modo Seguro Activado: RFID Desactivado y PIR Activado");

      // Muestra el mensaje en el LCD
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Modo Seguro");
      lcd.setCursor(0, 1);
      lcd.print("PIR Activado");
    } else if (msg.text.equalsIgnoreCase("desactivar modo seguro")) {
      rfidEnabled = true;  // Activa RFID
      pirEnabled = false; // Desactiva PIR

      digitalWrite(LED_PIN, HIGH); // Enciende el LED como indicativo de que RFID está activado
      miBot.sendMessage(msg.sender.id, "Modo Seguro Desactivado: RFID Activado y PIR Desactivado");

      // Muestra el mensaje en el LCD
      lcd.clear();
      lcd.setCursor(0, 0);
      lcd.print("Modo Seguro");
      lcd.setCursor(0, 1);
      lcd.print("Desactivado");
    } else {
      miBot.sendMessage(msg.sender.id, "Comandos disponibles:\n- activar\n- desactivar\n- activar pir\n- desactivar pir\n- activar modo seguro\n- desactivar modo seguro");
    }
  }
}
bool detectNewCard() {
  if (!mfrc522.PICC_IsNewCardPresent() || !mfrc522.PICC_ReadCardSerial()) {
    return false;
  }
  return true;
}

String getCardUID() {
  String uidString = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    if (i > 0) uidString += " ";
    if (mfrc522.uid.uidByte[i] < 0x10) uidString += "0";
    uidString += String(mfrc522.uid.uidByte[i], HEX);
  }
  uidString.toUpperCase();
  return uidString;
}

void handleCard(const String& uidString) {
  HTTPClient http;
  String url = "https://backendproyectoarquitectura.onrender.com/users/" + uidString;

  http.begin(url);
  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {
    processServerResponse(http.getString());
  } else {
    Serial.print("HTTP request error: ");
    Serial.println(httpResponseCode);
    lcd.clear();
    lcd.print("Error de red");
  }

  http.end();
}

void processServerResponse(const String& payload) {
  Serial.println("Server response:");
  Serial.println(payload);

  DynamicJsonDocument doc(2048);
  deserializeJson(doc, payload);

  const char* nombre = doc[0][0]["nombre"];
  if (nombre != nullptr && strlen(nombre) > 0) {
    displayWelcomeMessage(nombre);
    playHappyTune();
  } else {
    displayAccessDenied();
    playAlertTune();
  }
}

void displayWelcomeMessage(const char* nombre) {
  Serial.print("Welcome! ");
  Serial.println(nombre);

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Bienvenido:");
  lcd.setCursor(0, 1);
  lcd.print(nombre);
}

void displayAccessDenied() {
  Serial.println("User not found");
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Acceso denegado");
}

void displaySystemActiveMessage() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("RFID Activado");
  lcd.setCursor(0, 1);
  lcd.print("Pase tarjeta...");
}

void displayWaitingMessage() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Pase tarjeta...");
}

void playHappyTune() {
  for (int i = 0; i < 4; i++) {
    tone(BUZZER_PIN, happyNotes[i]);
    delay(noteDuration);
    noTone(BUZZER_PIN);
    delay(50);
  }
}

void playAlertTune() {
  for (int i = 0; i < 3; i++) {
    tone(BUZZER_PIN, alertNotes[i]);
    delay(alertDuration);
    noTone(BUZZER_PIN);
    delay(100);
  }
}


