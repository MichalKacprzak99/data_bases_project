import express from 'express';
import { userController } from '../controllers/index.js';

const router = express.Router();

/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *          type: object
 *          required:
 *              - user_name
 *              - name
 *              - surname
 *              - email
 *              - password
 *          properties:
 *              user_name:
 *                  type: string
 *                  description: Pseudonim użytkownika podany przy rejestracji
 *              name:
 *                  type: string
 *                  description: Imie użytkownika podany przy rejestracji
 *              surname:
 *                  type: string
 *                  description: Nazwisko użytkownika podany przy rejestracji
 *              email:
 *                  type: string
 *                  description: Mail użytkownika podany przy rejestracji
 *              password:
 *                  type: string
 *                  description: Hasło użytkownika podany przy rejestracji
 *          example:
 *              user_name: janek01
 *              name: Jan
 *              surname: Kowalski
 *              email: test@gmail.com
 *              password: haslo1234
 *              
 *    
 */
/**
 * @swagger
 *  components:
 *    schemas:
 *      ServerResponse:
 *          type: object
 *          required:
 *              - status
 *              - message
 *          properties:
 *               status:
 *                      type: string
 *                      description: String reprezentujący status odpowiedzi od servera
 *               message:
 *                      type: string
 *                      description: String reprezentujący treść wiadomości odpowiedzi od servera             
 */

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: API do zarządzania użytkownikami
 */


/**
 * @swagger
 * /users/register:
 *  post:
 *      summary: rejestracja uzytkownika
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      responses:
 *          "200":
 *              description: Uzytkownik zarejestrowany
 *              content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                          status:
 *                              type: string
 *                              description: String reprezentujący status odpowiedzi od servera
 *                          message:
 *                              type: string
 *                              description: String reprezentujący treść wiadomości odpowiedzi od servera
 *                          example:
 *                             status: success
 *                             message: Użytkownik dodany
 *              
 *          "409":
 *              description: Odmowa zarejestrowania użytkownika
 *              content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                          status:
 *                              type: string
 *                              description: String reprezentujący status odpowiedzi od servera
 *                          message:
 *                              type: string
 *                              description: String reprezentujący treść wiadomości odpowiedzi od servera
 *                          example:
 *                             status: failed
 *                             message: ten email juz został użyty
 *       
 */

router.post('/register', userController.registerUser);


/**
 * @swagger
 * /users/login:
 *  post:
 *      summary: logowanie uzytkownika
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *              email:
 *                  type: string
 *                  description: Email podany przez użytkownika
 *              password:
 *                   type: string
 *                   decription: Hasło podane przez uzytkownika
 *              example:
 *                  email: test@gmail.com
 *                  password: haslo1234
 *      responses:
 *          "200":
 *              description: Uzytkownik zarejestrowany
 *              content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                          token:
 *                              type: string
 *                              decription: token jwt wygenerowany przy logowaniu
 *                          example:
 *                              token: wygenerowany jwt token
 *              
 *          "409":
 *              description: Niezidentyfikowany błąd
 *              content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                          status:
 *                              type: string
 *                              description: String reprezentujący status odpowiedzi od servera
 *                          message:
 *                              type: string
 *                              description: String reprezentujący treść wiadomości odpowiedzi od servera
 *                          example:
 *                             status: failed
 *                             message: error.stack wygenerowany przez postresql
 *          "400":
 *              description: Dane podane przez uzytkownika są nieprawidłowe są nieprawidłowe
 *              content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                          status:
 *                              type: string
 *                              description: String reprezentujący status odpowiedzi od servera
 *                          message:
 *                              type: string
 *                              description: String reprezentujący treść wiadomości odpowiedzi od servera
 *                          example:
 *                             status: failed
 *                             message: Błędny email lub hasło
 *       
 */

router.post('/login',userController.loginUser);


/**
 * @swagger
 * /users/user:
 *  post:
 *      summary: pobranie danych użytkownika
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *               schema:
 *                  type: object
 *                  properties:
 *                      token:
 *                          type: string
 *                          description: token wygenerowany przez jwt
 *                  example:
 *                       token: jwt token
 *      responses:
 *          "200":
 *              description: Zwrócenie danych uzytkownika pobranych z bazy danych
 *              content:
 *                 application/json:
 *                     schema:
 *                     $ref: '#/components/schemas/User'
 *          "409":
 *              description: Odmowa zwrócenia danych
 *              content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                          status:
 *                              type: string
 *                              description: String reprezentujący status odpowiedzi od servera
 *                          message:
 *                              type: string
 *                              description: String reprezentujący treść wiadomości odpowiedzi od servera
 *                          example:
 *                             status: failed
 *                             message: error.stack wygenerowany przez jwt lub postresql
 *       
 */


router.post('/user', userController.getUserInfo);


/**
 * @swagger
 * /users/sent_message:
 *  post:
 *      summary: dodawanie wiadomości
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *              token:
 *                  type: string
 *                  description: jwt token użytkownika
 *              message:
 *                   type: string
 *                   decription: Wiadomość, którą chce wysłać użytkownik
 *              example:
 *                  token: jwt token
 *                  message: bardzo ważna wiadomość
 *      responses:
 *          "200":
 *              description: Zapisanie wiadomości do bazy
 *              content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                          status:
 *                              type: string
 *                              description: String reprezentujący status odpowiedzi od servera
 *                          message:
 *                              type: string
 *                              description: String reprezentujący treść wiadomości odpowiedzi od servera
 *                          example:
 *                             status: success
 *                             message: Wiadomość została wysłana
 *          "409":
 *              description: Odmowa zapisania wiadomości do bazy
 *              content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                          status:
 *                              type: string
 *                              description: String reprezentujący status odpowiedzi od servera
 *                          message:
 *                              type: string
 *                              description: String reprezentujący treść wiadomości odpowiedzi od servera
 *                          example:
 *                             status: failed
 *                             message: error.stack wygenerowany przez jwt lub postresql

 */
router.post('/sent_message', userController.sendMessage);

/**
 * @swagger
 * /users/get_info:
 *  post:
 *      summary: pobieranie informacji o kategoriach przepisu lub dostępnych produktach
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *              token:
 *                  type: string
 *                  description: Email podany przez użytkownika
 *              category:
 *                   type: string
 *                   decription: parametr, który określa czy potrzebne są informacje o kategoriach przepisu czy o dostępnych produktach
 *              example:
 *                  token: jwt token
 *                  category: produkty
 *      responses:
 *          "200":
 *              description: Pobranie danych z bazy
 *              content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                              options:
 *                                  type: array
 *                                  items:
 *                                     type: object
 *                                     properties:
 *                                          id_produkt:
 *                                               type: number
 *                                               decription: id produktu/ kategorii przpeisu
 *                                          id_kategoria_produkt:
 *                                               type: number
 *                                               decription: id
 *                                          nazwa:
 *                                               type: string
 *                                               decription: nazwa produktu/ kategorii przpeisu
 *                          example:
 *                             [{id_produkt: 20, id_kategoria_produkt: 4, nazwa: jabłko}]
 *          "409":
 *              description: Odmowa zwrócenia danych z bazy
 *              content:
 *                 application/json:
 *                     schemas:
 *                          Response:
 *                          type: object
 *                          properties:
 *                          status:
 *                              type: string
 *                              description: String reprezentujący status odpowiedzi od servera
 *                          message:
 *                              type: string
 *                              description: String reprezentujący treść wiadomości odpowiedzi od servera
 *                          example:
 *                             status: failed
 *                             message: error.stack wygenerowany przez jwt lub postresql

 */

router.post('/get_info', userController.getInfo);

/**
 * @swagger
 * /users/sent_message:
 *  post:
 *      summary: dodawanie wiadomości
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *              token:
 *                  type: string
 *                  description: jwt token użytkownika
 *              product:
 *                   type: string
 *                   decription: Nazwa produktu, który użytkownik chce zacząć śledzić
 *              example:
 *                  token: jwt token
 *                  message: jabłko
 *      responses:
 *          "200":
 *              description: rozpoczęcie śledzenia produktu
 *              content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                          status:
 *                              type: string
 *                              description: String reprezentujący status odpowiedzi od servera
 *                          message:
 *                              type: string
 *                              description: String reprezentujący treść wiadomości odpowiedzi od servera
 *                          example:
 *                             status: done
 *                             message: Rozpoczęto śledzenie produktu
 *          "409":
 *              description: Odmowa zapisania wiadomości do bazy
 *              content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                          status:
 *                              type: string
 *                              description: String reprezentujący status odpowiedzi od servera
 *                          message:
 *                              type: string
 *                              description: String reprezentujący treść wiadomości odpowiedzi od servera
 *                          example:
 *                             status: failed
 *                             message: error.stack wygenerowany przez jwt lub postresql

 */


router.post('/add_tracked_product', userController.addTrackedProduct);

/**
 * @swagger
 * /users/get_tracked_products:
 *  post:
 *      summary: pobieranie informacji o śledzonych produktach
 *      tags: [Users]
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *              token:
 *                  type: string
 *                  description: Email podany przez użytkownika
 *              example:
 *                  token: jwt token
 *      responses:
 *          "200":
 *              description: Pobranie danych z bazy
 *              content:
 *                 application/json:
 *                     schema:
 *                          type: object
 *                          properties:
 *                              options:
 *                                  type: array
 *                                  items:
 *                                     type: object
 *                                     properties:
 *                                          nazwa:
 *                                               type: string
 *                                               decription: nazwa śledzonego produktu
 *                                          pasujacy przepis:
 *                                               type: number
 *                                               decription: id pasującego przepisu
 *                                          data_dodania:
 *                                               type: string
 *                                               decription: data rozpoczęcia śledzenia
 *                                          data_dopasowania:
 *                                               type: string
 *                                               decription: data znalezienia ostatniego pasującego przepisu
 *                          example:
 *                             [{nazwa: jabłko, pasujacy_przepis: 48, data_dodania: 2021-01-19 12:30:04 +0000, data_dopasowania: 2021-01-20 20:32:52 +0000}]
 *          "409":
 *              description: Odmowa zwrócenia danych z bazy
 *              content:
 *                 application/json:
 *                     schemas:
 *                          Response:
 *                          type: object
 *                          properties:
 *                          status:
 *                              type: string
 *                              description: String reprezentujący status odpowiedzi od servera
 *                          message:
 *                              type: string
 *                              description: String reprezentujący treść wiadomości odpowiedzi od servera
 *                          example:
 *                             status: failed
 *                             message: error.stack wygenerowany przez jwt lub postresql

 */

router.post('/get_tracked_products', userController.getTrackedProducts);



export default router;