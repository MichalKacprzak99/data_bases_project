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

