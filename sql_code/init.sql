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
komentarz.id_komentujacego,
uzytkownik.pseudonim,
komentarz.tresc,
komentarz.id_przepis
FROM komentarz
JOIN uzytkownik ON komentarz.id_komentujacego =  uzytkownik.id_uzytkownika;



CREATE OR REPLACE FUNCTION random_between(low INT ,high INT) 
   RETURNS INT AS
$$
BEGIN
   RETURN floor(random()* (high-low + 1) + low);
END;
$$ LANGUAGE 'plpgsql';




CREATE OR REPLACE FUNCTION dodaj_przepis(id_u INTEGER,d_dodania TIMESTAMP, nazwa_p VARCHAR, opis_p VARCHAR, produkty JSON, kategorie JSON)
RETURNS BOOLEAN AS
$$
DECLARE
   przepis_id przepis.id_przepis%TYPE;
   produkt_przepisu json;
   kategoria_nazwa text;
   kategoria_wybrana text;
   admin_id INTEGER;
   max_admin_id INTEGER;
   kategoria_przepis_id INTEGER;
   kategoria_produkt_id INTEGER;
   produkt_id INTEGER;
BEGIN


    IF json_array_length(produkty) IS NULL THEN
        RAISE EXCEPTION 'Musisz dodać chociaż jeden produkt'; 
    return false;
    ELSEIF EXISTS (SELECT 1 FROM przepis WHERE nazwa=nazwa_p) THEN
        RAISE EXCEPTION 'przepis z taką nazwą już istnieje';
    END IF; 
   SELECT MAX(id_admin) INTO max_admin_id FROM admin;
   admin_id:=random_between(1, max_admin_id);

   INSERT INTO przepis (id_uzytkownika, nazwa, opis, data_dodania) VALUES (id_u,  nazwa_p, opis_p, d_dodania) RETURNING id_przepis INTO przepis_id;
   INSERT INTO akceptacja_przepisu (id_przepis,id_uzytkownika, id_admin, status) VALUES (przepis_id, id_u, admin_id, 'oczekujący');

   FOR produkt_przepisu IN SELECT * FROM json_array_elements(produkty)
   LOOP
      SELECT id_produkt, id_kategoria_produkt INTO produkt_id, kategoria_produkt_id FROM produkt WHERE nazwa = produkt_przepisu->>'product';
      INSERT INTO przepis_produkt VALUES (produkt_id, kategoria_produkt_id, przepis_id, id_u, CAST(produkt_przepisu->>'quantity' as NUMERIC), produkt_przepisu->>'unit');
   END LOOP;

   FOR kategoria_nazwa, kategoria_wybrana IN
      SELECT * FROM json_each_text(kategorie)
   LOOP
      IF kategoria_wybrana THEN
         SELECT id_kategoria_przepis INTO kategoria_przepis_id FROM kategoria_przepis WHERE nazwa = kategoria_nazwa;
         INSERT INTO Asocjacja_kategoria_przepis (id_przepis, id_uzytkownika, id_kategoria_przepis) VALUES (przepis_id, id_u,kategoria_przepis_id);
      END IF;
   END LOOP;
    return true;
END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION dodaj_sledzony_produkt(id_u INTEGER ,id_p INTEGER) 
   RETURNS VOID AS
$$
DECLARE
    id_kat_p INTEGER;
    id_prz INTEGER;
    data_dopasowania TIMESTAMP;
BEGIN
    SELECT id_kategoria_produkt INTO id_kat_p FROM produkt WHERE id_produkt=id_p;
    RAISE NOTICE '%', id_kat_p;
    SELECT MAX(id_przepis) INTO id_prz FROM przepis_produkt JOIN akceptacja_przepisu USING(id_przepis)  WHERE id_produkt = id_p AND status='zaakceptowany';
    RAISE NOTICE '%', id_prz;
    IF id_prz IS NUll THEN
        data_dopasowania := NULL;
        RAISE NOTICE 'taki sam %', data_dopasowania;
    ELSE
        data_dopasowania := NOW()::timestamp;
    END IF;
    INSERT INTO sledzone_produkty VALUES (id_u, id_p, id_kat_p, NOW()::timestamp, id_prz, data_dopasowania);
END;
$$ LANGUAGE 'plpgsql';




CREATE OR REPLACE FUNCTION dopasuj_przepis() RETURNS TRIGGER AS
$$
    DECLARE
    id_p integer;
    product RECORD;
    BEGIN
        id_p := NEW.id_przepis;
        FOR product IN SELECT * FROM przepis_produkt WHERE id_przepis=id_p
        LOOP
            UPDATE sledzone_produkty SET pasujacy_przepis=id_p, data_dopasowania=NOW()::timestamp WHERE id_produkt=product.id_produkt;
        END LOOP;
        RETURN NEW;
    END;
$$ LANGUAGE 'plpgsql';



CREATE TRIGGER sprawdz_sledzone_produkty
    BEFORE UPDATE 
    ON akceptacja_przepisu
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE PROCEDURE dopasuj_przepis();



CREATE OR REPLACE FUNCTION dodaj_wpis(id_t INTEGER, id_u INTEGER, wpis_u VARCHAR) RETURNS VOID AS
$$
    DECLARE
        id_a INTEGER;
    BEGIN
        SELECT id_admin INTO id_a FROM temat_forum WHERE id_temat=id_t;
        INSERT INTO wpis (id_temat, id_admin, id_uzytkownika, tresc, data_dodania) VALUES (id_t, id_a, id_u, wpis_u, NOW()::timestamp);
    END;
$$ LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION walidacja_rejestracji() RETURNS TRIGGER AS
$$
    DECLARE
    result BOOLEAN;
    BEGIN
        IF EXISTS (SELECT 1 FROM uzytkownik WHERE email=NEW.email) THEN
            RAISE EXCEPTION 'ten email juz został użyty'; 
        ELSEIF EXISTS (SELECT 1 FROM uzytkownik WHERE pseudonim=NEW.pseudonim) THEN
            RAISE EXCEPTION 'ten pseudonim juz został użyty';
        END IF; 
        RETURN NEW;
    END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER walidacja_rejestracji_uzytkownika
    BEFORE INSERT
    ON uzytkownik
    FOR EACH ROW
    EXECUTE PROCEDURE walidacja_rejestracji();

