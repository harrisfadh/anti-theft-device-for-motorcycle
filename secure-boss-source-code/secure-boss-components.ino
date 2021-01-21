#include <ESP8266WiFi.h>         // Include ESP8266 library
#include <FirebaseArduino.h>     // Include Firebase Arduino library
#include <TinyGPS++.h>           // Include TinyGPS++ library
#include <SoftwareSerial.h>      // Include software serial library

#define FIREBASE_HOST "boss-antitheft.firebaseio.com"   //firebase url
#define FIREBASE_AUTH "qd3bwpX3nx47VnX4hjqoxmDEbCNuLOfq1m0o0uNQ"  //firebase database secret key

#define WIFI_SSID "harleyQuinn"  //wifi ssid
#define WIFI_PASSWORD "12345678"   //wifi password

#define VIBRATION_SENSOR D2   // Define vibration sensor signal pin D2
#define S_RX 4                // Define software serial RX pin
#define S_TX 3                // Define software serial TX pin
#define MOTOR D8              // Define motor signal pin D8
#define BUZZER D7              // Define buzzer signal pin D7
#define MOTOR_SWITCH D9       // Define motor switch signal pin D9

TinyGPSPlus gps;    //Create TinyGPSPlus variable
SoftwareSerial SoftSerial(S_RX, S_TX);    // Configure SoftSerial library
SoftwareSerial mySerial(13, 12); //Configure mySerial for GSM

int v_input = 0;    //vibration sensor variable
int motor_value = 0;  //motor digital value variable
int switch_input = 0; //switch digital value variable
 
void setup(void) {
  Serial.begin(9600);     //begin serial
  SoftSerial.begin(9600);   //begin tinygps SoftSerial
  mySerial.begin(9600);   //begin gsm mySerial
  pinMode(VIBRATION_SENSOR, INPUT);
  pinMode(BUZZER, OUTPUT);
  pinMode(MOTOR_SWITCH, INPUT);
  pinMode(MOTOR, OUTPUT);
//  pinMode(LED, OUTPUT);
  digitalWrite(MOTOR, LOW);
  WiFiConnection();  
}

void WiFiConnection(){
  
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);  
  Serial.print("connecting");  
  
  while (WiFi.status() != WL_CONNECTED)
  {  
    Serial.print(".");  
    delay(500);  
  }

  Serial.println();  
  Serial.print("connected: ");  
  Serial.println(WiFi.localIP());  

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH); //firebase initialization
  }

void physical(){
   v_input = digitalRead(VIBRATION_SENSOR);
   switch_input = digitalRead(MOTOR_SWITCH);
   motor_value = digitalRead(MOTOR);
   Serial.print("Vibration sensor: ");
   Serial.println(v_input);

   if(digitalRead(VIBRATION_SENSOR) == 1){
        MakeCall();
        digitalWrite(BUZZER,2000);
   }

   else if(v_input == 0){
    digitalWrite(BUZZER, LOW);
   }

   Firebase.setInt("vibration_sensor", v_input);   //send vibration sensor data to firebase vibration_sensor node
   Firebase.setInt("motor_value", motor_value);   //send motor value data to firebase motor_value node
   int sw = Firebase.getInt("motor_switch");  //retrieve motor_switch node value from database
   Serial.print("Firebase Switch Value: ");
   Serial.println(sw);
   Serial.print("Motor Switch Value: ");
   Serial.println(switch_input);

   if(sw == 1){     //if switch has value of 1(turned on) physical switch can be used to power on and off motor
    if(switch_input == 0){
    digitalWrite(MOTOR, HIGH);
 //   digitalWrite(LED, HIGH);
    }

    else{
      digitalWrite(MOTOR, LOW);
   //   digitalWrite(LED, LOW);
    }
    }

    else{ //if switch value from firebase is 0, physical switch cannot be used to power on and off motor
      digitalWrite(MOTOR, LOW);
//      digitalWrite(LED, LOW);
    }

   delay(1000);
}
 
void loop() {

  while (SoftSerial.available() > 0) {  
 
    if (gps.encode(SoftSerial.read())) {
 
      if (gps.location.isValid()) {
        Serial.print("Latitude   = ");
        Serial.println(gps.location.lat(), 6); //get latitude value
        Firebase.setFloat("latitude", gps.location.lat()); //send latitude value to firebase
        
        Serial.print("Longitude  = ");
        Serial.println(gps.location.lng(), 6);  //get longitude value
        Firebase.setFloat("longitude", gps.location.lng()); //send longitude value to firebase

        physical();
      }
      else
        Serial.println("Location Invalid");
        physical();
        
      delay(3000);
  }
  }
}

void MakeCall()
{
  mySerial.println("ATD+60123137785;"); // mySerial call function
  Serial.println("Calling  "); // print response over serial port
  delay(1000);
}
 
