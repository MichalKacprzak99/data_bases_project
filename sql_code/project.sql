-- polecenia tworzące tabele

CREATE TABLE Kategoria_przepis (
                id_kategoria_przepis SERIAL NOT NULL,
                nazwa VARCHAR NOT NULL UNIQUE,
                CONSTRAINT kategoria_przepis_pk PRIMARY KEY (id_kategoria_przepis)
);


CREATE TABLE Kategoria_produkt (
                id_kategoria_produkt SERIAL NOT NULL,
                nazwa VARCHAR NOT NULL UNIQUE,
                CONSTRAINT kategoria_produkt_pk PRIMARY KEY (id_kategoria_produkt)
);


CREATE TABLE Produkt (
                id_produkt SERIAL NOT NULL,
                id_kategoria_produkt INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL UNIQUE,
                CONSTRAINT produkt_pk PRIMARY KEY (id_produkt, id_kategoria_produkt)
);


CREATE TABLE Admin (
                Id_admin SERIAL NOT NULL,
                pseudonim VARCHAR DEFAULT 'admin' NOT NULL,
                haslo VARCHAR NOT NULL,
                CONSTRAINT admin_pk PRIMARY KEY (Id_admin)
);


CREATE TABLE Temat_forum (
                id_temat SERIAL NOT NULL,
                Id_admin INTEGER NOT NULL,
                temat VARCHAR NOT NULL,
                data_dodania TIMESTAMP NOT NULL,
                opis VARCHAR NOT NULL,
                CONSTRAINT temat_forum_pk PRIMARY KEY (id_temat, Id_admin)
);


CREATE TABLE Uzytkownik (
                id_uzytkownika SERIAL NOT NULL,
                pseudonim VARCHAR NOT NULL UNIQUE,
                imie VARCHAR NOT NULL,
                nazwisko VARCHAR NOT NULL,
                email VARCHAR NOT NULL UNIQUE,
                haslo VARCHAR NOT NULL,
                zablokowany BOOLEAN DEFAULT false NOT NULL,
                CONSTRAINT uzytkownik_pk PRIMARY KEY (id_uzytkownika)
);


CREATE INDEX uzytkownik_idx
 ON Uzytkownik
 ( pseudonim );

CREATE TABLE Wiadomosc_do_administracji (
                id_wiadomosc SERIAL NOT NULL,
                id_uzytkownika INTEGER NOT NULL,
                data_dodania TIMESTAMP NOT NULL,
                tresc VARCHAR NOT NULL,
                CONSTRAINT wiadomosc_do_administracji_pk PRIMARY KEY (id_wiadomosc, id_uzytkownika)
);


CREATE TABLE Wpis (
                id_wpis SERIAL NOT NULL,
                id_temat INTEGER NOT NULL,
                Id_admin INTEGER NOT NULL,
                id_uzytkownika INTEGER NOT NULL,
                tresc VARCHAR NOT NULL,
                data_dodania TIMESTAMP NOT NULL,
                CONSTRAINT wpis_pk PRIMARY KEY (id_wpis, id_temat, Id_admin, id_uzytkownika)
);


CREATE TABLE Sledzone_produkty (
                id_uzytkownika INTEGER NOT NULL,
                id_produkt INTEGER NOT NULL,
                id_kategoria_produkt INTEGER NOT NULL,
                data_dodania TIMESTAMP,
                data_dopasowania TIMESTAMP,
                pasujacy_przepis INTEGER,
                CONSTRAINT sledzone_produkty_pk PRIMARY KEY (id_uzytkownika, id_produkt, id_kategoria_produkt)
);


CREATE TABLE Przepis (
                id_przepis SERIAL NOT NULL,
                id_uzytkownika INTEGER NOT NULL,
                nazwa VARCHAR NOT NULL UNIQUE,
                opis VARCHAR NOT NULL,
                data_dodania TIMESTAMP NOT NULL,
                CONSTRAINT przepis_pk PRIMARY KEY (id_przepis, id_uzytkownika)
);


CREATE TABLE Przepis_produkt (
                id_produkt INTEGER NOT NULL,
                id_kategoria_produkt INTEGER NOT NULL,
                id_przepis INTEGER NOT NULL,
                id_uzytkownika INTEGER NOT NULL,
                ilosc NUMERIC NOT NULL,
                jednostka VARCHAR NOT NULL,
                CONSTRAINT przepis_produkt_pk PRIMARY KEY (id_produkt, id_kategoria_produkt, id_przepis, id_uzytkownika)
);


CREATE TABLE Polubione_przepisy (
                id_przepis INTEGER NOT NULL,
                id_uzytkownika INTEGER NOT NULL,
                id_likujacego INTEGER NOT NULL,
                data_dodania TIMESTAMP NOT NULL,
                notatka VARCHAR NOT NULL,
                CONSTRAINT polubione_przepisy_pk PRIMARY KEY (id_przepis, id_uzytkownika, id_likujacego)
);


CREATE TABLE Asocjacja_kategoria_przepis (
                id_przepis INTEGER NOT NULL,
                id_uzytkownika INTEGER NOT NULL,
                id_kategoria_przepis INTEGER NOT NULL,
                CONSTRAINT asocjacja_kategoria_przepis_pk PRIMARY KEY (id_przepis, id_uzytkownika, id_kategoria_przepis)
);


CREATE TABLE Akceptacja_przepisu (
                id_przepis INTEGER NOT NULL,
                id_uzytkownika INTEGER NOT NULL,
                Id_admin INTEGER NOT NULL,
                status VARCHAR NOT NULL,
                CONSTRAINT akceptacja_przepisu_pk PRIMARY KEY (id_przepis, id_uzytkownika, Id_admin)
);


CREATE TABLE Komentarz (
                id_komentarz SERIAL NOT NULL,
                id_uzytkownika INTEGER NOT NULL,
                id_przepis INTEGER NOT NULL,
                id_komentujacego INTEGER NOT NULL,
                tresc VARCHAR NOT NULL,
                data_dodania TIMESTAMP NOT NULL,
                CONSTRAINT komentarz_pk PRIMARY KEY (id_uzytkownika, id_komentarz, id_przepis,id_komentujacego)
);


ALTER TABLE Asocjacja_kategoria_przepis ADD CONSTRAINT kategoria_przepis_asocjacja_kategoria_przepis_fk
FOREIGN KEY (id_kategoria_przepis)
REFERENCES Kategoria_przepis (id_kategoria_przepis)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Produkt ADD CONSTRAINT kategoria_produkt_produkt_fk
FOREIGN KEY (id_kategoria_produkt)
REFERENCES Kategoria_produkt (id_kategoria_produkt)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Sledzone_produkty ADD CONSTRAINT sledzone_produkty_produkt_fk
FOREIGN KEY (id_produkt, id_kategoria_produkt)
REFERENCES Produkt (id_produkt, id_kategoria_produkt)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Przepis_produkt ADD CONSTRAINT produkt_przepis_produkt_fk
FOREIGN KEY (id_produkt, id_kategoria_produkt)
REFERENCES Produkt (id_produkt, id_kategoria_produkt)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Akceptacja_przepisu ADD CONSTRAINT przepis_do_akceptacji_admin_fk
FOREIGN KEY (Id_admin)
REFERENCES Admin (Id_admin)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Temat_forum ADD CONSTRAINT admin_temat_fk
FOREIGN KEY (Id_admin)
REFERENCES Admin (Id_admin)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Wpis ADD CONSTRAINT temat_wpis_fk
FOREIGN KEY (id_temat, Id_admin)
REFERENCES Temat_forum (id_temat, Id_admin)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Przepis ADD CONSTRAINT uzytkownik_przepis_fk
FOREIGN KEY (id_uzytkownika)
REFERENCES Uzytkownik (id_uzytkownika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Komentarz ADD CONSTRAINT uzytkownik_komentarz_fk
FOREIGN KEY (id_komentujacego)
REFERENCES Uzytkownik (id_uzytkownika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Sledzone_produkty ADD CONSTRAINT uzytkownik_sledzone_produkty_fk
FOREIGN KEY (id_uzytkownika)
REFERENCES Uzytkownik (id_uzytkownika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Polubione_przepisy ADD CONSTRAINT uzytkownik_polubione_przepisy_fk
FOREIGN KEY (id_likujacego)
REFERENCES Uzytkownik (id_uzytkownika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Wpis ADD CONSTRAINT uzytkownik_wpis_fk
FOREIGN KEY (id_uzytkownika)
REFERENCES Uzytkownik (id_uzytkownika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Wiadomosc_do_administracji ADD CONSTRAINT uzytkownik_wiadomosc_do_administracji_fk
FOREIGN KEY (id_uzytkownika)
REFERENCES Uzytkownik (id_uzytkownika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Komentarz ADD CONSTRAINT przepis_komentarz_fk
FOREIGN KEY (id_przepis, id_uzytkownika)
REFERENCES Przepis (id_przepis, id_uzytkownika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Akceptacja_przepisu ADD CONSTRAINT przepis_przepis_do_akceptacji_fk
FOREIGN KEY (id_uzytkownika, id_przepis)
REFERENCES Przepis (id_uzytkownika, id_przepis)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Asocjacja_kategoria_przepis ADD CONSTRAINT przepis_asocjacja_kategoria_przepis_fk
FOREIGN KEY (id_przepis, id_uzytkownika)
REFERENCES Przepis (id_przepis, id_uzytkownika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Polubione_przepisy ADD CONSTRAINT przepis_polubione_przepisy_fk
FOREIGN KEY (id_przepis, id_uzytkownika)
REFERENCES Przepis (id_przepis, id_uzytkownika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

ALTER TABLE Przepis_produkt ADD CONSTRAINT przepis_przepis_produkt_fk
FOREIGN KEY (id_przepis, id_uzytkownika)
REFERENCES Przepis (id_przepis, id_uzytkownika)
ON DELETE NO ACTION
ON UPDATE NO ACTION
NOT DEFERRABLE;

-- polecenia tworzace widoki

CREATE VIEW recipes AS SELECT 
akceptacja_przepisu.id_admin,
przepis.id_przepis,
przepis.id_uzytkownika,
przepis.nazwa,
przepis.opis,
przepis.data_dodania,
akceptacja_przepisu.status
FROM przepis
JOIN akceptacja_przepisu USING (id_przepis);

CREATE VIEW recipe_products AS SELECT 
przepis_produkt.id_produkt,
kategoria_produkt.nazwa AS kategoria,
produkt.nazwa,
przepis_produkt.id_przepis,
przepis_produkt.ilosc,
przepis_produkt.jednostka
FROM przepis_produkt
JOIN produkt USING (id_produkt)
JOIN kategoria_produkt ON produkt.id_kategoria_produkt = kategoria_produkt.id_kategoria_produkt;

CREATE VIEW recipe_category AS SELECT 
kategoria_przepis.nazwa,
asocjacja_kategoria_przepis.id_przepis
FROM asocjacja_kategoria_przepis
JOIN kategoria_przepis USING (id_kategoria_przepis);

CREATE VIEW comments AS SELECT
komentarz.id_uzytkownika,
komentarz.id_komentarz,
komentarz.id_komentujacego
uzytkownik.pseudonim,
komentarz.tresc,
komentarz.id_przepis
FROM komentarz
JOIN uzytkownik ON komentarz.id_komentujacego =  uzytkownik.id_uzytkownika;