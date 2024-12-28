--
-- PostgreSQL database dump
--

-- Dumped from database version 11.22
-- Dumped by pg_dump version 11.22

-- Started on 2024-12-19 20:57:16 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 24594)
-- Name: citext; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;


--
-- TOC entry 3266 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION citext; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION citext IS 'data type for case-insensitive character strings';


--
-- TOC entry 221 (class 1255 OID 16385)
-- Name: update_user_statistic_on_delete(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.update_user_statistic_on_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE user_statistic
    SET like_amount = like_amount - 1
    WHERE id = (select user_statistics_id  from "user" where id = OLD.owner_id);
    RETURN OLD;
END;
$$;


ALTER FUNCTION public.update_user_statistic_on_delete() OWNER TO "user";

--
-- TOC entry 222 (class 1255 OID 16386)
-- Name: update_user_statistic_on_delete_comment(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.update_user_statistic_on_delete_comment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE user_statistic
    SET comments_amount = user_statistic.comments_amount - 1
    WHERE id = (select user_statistics_id  from "user" where id = OLD.owner_id);
    RETURN OLD;
END;
$$;


ALTER FUNCTION public.update_user_statistic_on_delete_comment() OWNER TO "user";

--
-- TOC entry 223 (class 1255 OID 16387)
-- Name: update_user_statistic_on_insert(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.update_user_statistic_on_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE user_statistic
    SET like_amount = like_amount + 1
    WHERE id = (select user_statistics_id  from "user" where id = NEW.owner_id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_user_statistic_on_insert() OWNER TO "user";

--
-- TOC entry 224 (class 1255 OID 16388)
-- Name: update_user_statistic_on_insert_comment(); Type: FUNCTION; Schema: public; Owner: user
--

CREATE FUNCTION public.update_user_statistic_on_insert_comment() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE user_statistic
    SET comments_amount = user_statistic.comments_amount + 1
    WHERE id = (select user_statistics_id  from "user" where id = NEW.owner_id);
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_user_statistic_on_insert_comment() OWNER TO "user";

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 197 (class 1259 OID 16389)
-- Name: comment; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.comment (
    id integer NOT NULL,
    dream_id integer NOT NULL,
    owner_id integer NOT NULL,
    comment_content text NOT NULL,
    comment_date date NOT NULL
);


ALTER TABLE public.comment OWNER TO "user";

--
-- TOC entry 198 (class 1259 OID 16395)
-- Name: comment_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.comment_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comment_id_seq OWNER TO "user";

--
-- TOC entry 199 (class 1259 OID 16397)
-- Name: doctrine_migration_versions; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.doctrine_migration_versions (
    version character varying(191) NOT NULL,
    executed_at timestamp(0) without time zone DEFAULT NULL::timestamp without time zone,
    execution_time integer
);


ALTER TABLE public.doctrine_migration_versions OWNER TO "user";

--
-- TOC entry 200 (class 1259 OID 16401)
-- Name: dream; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.dream (
    id integer NOT NULL,
    privacy_id integer NOT NULL,
    emotion_id integer NOT NULL,
    owner_id integer NOT NULL,
    title public.citext NOT NULL,
    dream_content public.citext NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.dream OWNER TO "user";

--
-- TOC entry 201 (class 1259 OID 16407)
-- Name: dream_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.dream_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.dream_id_seq OWNER TO "user";

--
-- TOC entry 202 (class 1259 OID 16409)
-- Name: emotion; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.emotion (
    id integer NOT NULL,
    emotion_name character varying(255) NOT NULL
);


ALTER TABLE public.emotion OWNER TO "user";

--
-- TOC entry 203 (class 1259 OID 16412)
-- Name: emotion_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.emotion_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.emotion_id_seq OWNER TO "user";

--
-- TOC entry 204 (class 1259 OID 16414)
-- Name: friend; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.friend (
    id integer NOT NULL,
    user_1_id integer NOT NULL,
    user_2_id integer NOT NULL
);


ALTER TABLE public.friend OWNER TO "user";

--
-- TOC entry 205 (class 1259 OID 16417)
-- Name: friend_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.friend_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.friend_id_seq OWNER TO "user";

--
-- TOC entry 206 (class 1259 OID 16419)
-- Name: privacy; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.privacy (
    id integer NOT NULL,
    privacy_name character varying(255) NOT NULL
);


ALTER TABLE public.privacy OWNER TO "user";

--
-- TOC entry 207 (class 1259 OID 16422)
-- Name: privacy_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.privacy_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.privacy_id_seq OWNER TO "user";

--
-- TOC entry 208 (class 1259 OID 16424)
-- Name: role; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.role (
    id integer NOT NULL,
    role_name character varying(255) NOT NULL
);


ALTER TABLE public.role OWNER TO "user";

--
-- TOC entry 209 (class 1259 OID 16427)
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_id_seq OWNER TO "user";

--
-- TOC entry 219 (class 1259 OID 16558)
-- Name: tags; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(255) NOT NULL
);


ALTER TABLE public.tags OWNER TO "user";

--
-- TOC entry 220 (class 1259 OID 24577)
-- Name: tags_dream; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.tags_dream (
    tags_id integer NOT NULL,
    dream_id integer NOT NULL
);


ALTER TABLE public.tags_dream OWNER TO "user";

--
-- TOC entry 218 (class 1259 OID 16549)
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO "user";

--
-- TOC entry 210 (class 1259 OID 16429)
-- Name: user; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    detail_id integer NOT NULL,
    user_statistics_id integer NOT NULL,
    email character varying(180) NOT NULL,
    roles json NOT NULL,
    password character varying(255) NOT NULL
);


ALTER TABLE public."user" OWNER TO "user";

--
-- TOC entry 211 (class 1259 OID 16435)
-- Name: user_detail; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.user_detail (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    surname character varying(255) NOT NULL,
    photo character varying(255) DEFAULT 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'::character varying NOT NULL
);


ALTER TABLE public.user_detail OWNER TO "user";

--
-- TOC entry 212 (class 1259 OID 16442)
-- Name: user_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.user_detail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_detail_id_seq OWNER TO "user";

--
-- TOC entry 213 (class 1259 OID 16444)
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO "user";

--
-- TOC entry 214 (class 1259 OID 16446)
-- Name: user_like; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.user_like (
    id integer NOT NULL,
    dream_id integer NOT NULL,
    owner_id integer NOT NULL,
    like_date date NOT NULL
);


ALTER TABLE public.user_like OWNER TO "user";

--
-- TOC entry 215 (class 1259 OID 16449)
-- Name: user_like_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.user_like_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_like_id_seq OWNER TO "user";

--
-- TOC entry 216 (class 1259 OID 16451)
-- Name: user_statistic; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.user_statistic (
    id integer NOT NULL,
    dreams_amount integer NOT NULL,
    like_amount integer NOT NULL,
    comments_amount integer NOT NULL
);


ALTER TABLE public.user_statistic OWNER TO "user";

--
-- TOC entry 217 (class 1259 OID 16454)
-- Name: user_statistic_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.user_statistic_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_statistic_id_seq OWNER TO "user";

--
-- TOC entry 3237 (class 0 OID 16389)
-- Dependencies: 197
-- Data for Name: comment; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.comment (id, dream_id, owner_id, comment_content, comment_date) FROM stdin;
1	12	12	New Comment	2024-05-30
2	32	5	string	2024-06-01
5	5	5	I like this dream	2024-06-01
6	33	5	Wspaniały sen	2024-06-01
7	33	5	new	2024-06-01
8	33	5	Awesome	2024-06-01
9	2	5	Awesome	2024-06-01
10	5	5	provident eum explicabo	2024-06-01
11	5	5	pariatur animi exercitationem	2024-06-01
12	5	5	Dolores velit doloremque.	2024-06-01
14	5	5	kokol	2024-06-01
15	19	12	New comment awesome	2024-06-01
19	19	12	laudantium excepturi aut	2024-06-01
20	34	12	new comment	2024-06-03
21	19	12	nowy komentazr	2024-06-03
22	36	12	dkwehck	2024-06-03
\.


--
-- TOC entry 3239 (class 0 OID 16397)
-- Dependencies: 199
-- Data for Name: doctrine_migration_versions; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.doctrine_migration_versions (version, executed_at, execution_time) FROM stdin;
DoctrineMigrations\\Version20240505182711	2024-05-05 18:27:20	223
DoctrineMigrations\\Version20240505195035	2024-05-05 19:50:42	32
DoctrineMigrations\\Version20241011205614	2024-10-11 20:56:32	81
DoctrineMigrations\\Version20241111182129	2024-11-11 18:21:44	114
\.


--
-- TOC entry 3240 (class 0 OID 16401)
-- Dependencies: 200
-- Data for Name: dream; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.dream (id, privacy_id, emotion_id, owner_id, title, dream_content, date) FROM stdin;
2	1	3	12	Stressfull test	It was awefull	2024-05-08
13	1	2	12	International Security Coordinator	Explicabo ad magni consequuntur.	2024-05-08
14	2	2	12	Customer Division Representative	Possimus nihil quis enim quibusdam amet quaerat tempore quam.	2024-05-08
16	2	2	12	Kuwait	Sapiente nemo dignissimos cum.	2024-05-08
17	2	1	12	Bulgaria	Id necessitatibus quis praesentium modi illo iusto accusamus.	2024-05-08
18	1	2	12	India	Similique mollitia voluptatibus ad occaecati unde amet labore quia.	2024-05-09
20	1	2	5	Bosnia and Herzegovina	Rerum blanditiis modi culpa praesentium optio beatae odio expedita velit.	2024-05-10
21	1	1	5	voluptate eligendi praesentium	Sint odit perspiciatis eveniet occaecati nam quo aut. Modi optio doloribus delectus dolorem. Laboriosam assumenda similique minus porro odit eaque explicabo possimus asperiores.\nArchitecto perspiciatis tempora molestiae perferendis ipsa suscipit excepturi dolorum. Eum voluptatibus minus magnam consectetur tempore itaque nobis voluptates error. Incidunt aspernatur minima excepturi pariatur.\nCorporis amet dicta. Quo deleniti doloribus porro ex distinctio doloribus iste quia. Repellendus ducimus sed laudantium ratione.	2024-05-10
22	1	1	5	quasi at consequatur	Itaque repudiandae dolorem. Quidem soluta aliquid repudiandae reprehenderit omnis enim quidem. Deserunt commodi eius eum aspernatur.\nDolorem soluta deserunt sit. Aliquam officiis illum sunt. Dolor repellat nobis doloremque.\nOptio mollitia optio eius numquam. Sed at cumque. Culpa voluptatem eius soluta ipsam.	2024-05-10
23	2	2	5	voluptate consectetur earum	Rem laboriosam animi. Laborum a sit ad odit beatae natus veritatis accusantium. Animi voluptas magnam quae reiciendis.\nNisi sit veniam soluta unde. Consequuntur sequi necessitatibus aspernatur. Corrupti architecto nesciunt adipisci.\nNesciunt voluptatem voluptate. Reiciendis deserunt officiis culpa soluta quis dolore rem minima. Nobis cumque tenetur voluptatum.	2024-05-10
24	2	3	5	sed commodi sit	Labore mollitia reiciendis porro alias ut deserunt. Temporibus architecto sequi voluptatem doloremque minus voluptate totam nulla. Consequatur omnis possimus minus sint.\nAspernatur occaecati dolore sint ipsum. Voluptas quibusdam dolorum quibusdam quisquam architecto nulla placeat. Asperiores dolore non in voluptatem facilis.\nAlias dolore blanditiis ex enim sunt error. Repellendus aliquam amet ipsa exercitationem iure nisi possimus. Eos impedit debitis.	2024-05-10
25	2	3	5	dolore dolores nemo	Aspernatur asperiores praesentium incidunt nesciunt. Et labore in nesciunt deleniti exercitationem incidunt ea tenetur saepe. Aperiam illo nam.\nMinima doloremque excepturi eius fugit adipisci. Sit dolore suscipit eaque impedit nemo sint. Vitae libero ipsa nisi provident.\nQuam corrupti necessitatibus veritatis deleniti eligendi libero. In commodi sapiente sapiente culpa tempore quaerat minus. Ratione alias odit dicta molestiae iusto incidunt cumque consectetur occaecati.	2024-05-10
26	2	1	5	occaecati nihil error	Non veniam dolores ducimus. Corporis est id inventore cupiditate. Dolores hic ab illum neque et fugit accusantium.\nVelit explicabo alias nisi voluptas animi. Adipisci a rem aliquid doloremque autem consectetur praesentium facilis molestiae. Similique accusantium est veritatis voluptatum dolores non.\nAliquid aperiam animi repudiandae asperiores animi odit. Blanditiis at dicta quasi nisi quos. Ducimus nam reprehenderit molestias labore.	2024-05-10
27	2	2	12	incidunt possimus dolorem	Id officiis nemo omnis rerum libero. Voluptatum illo quam hic atque ullam eveniet natus. Corrupti delectus delectus fugiat cumque veniam facilis nihil.\n	2024-05-10
28	2	1	12	eligendi laborum porro	Illum voluptatum ex. Mollitia iusto tempora mollitia provident tempore. Eius et architecto laboriosam accusamus aliquam unde sapiente.\nMagni accusamus totam ab iste nostrum impedit facere ipsum. In quidem nostrum temporibus \\	2024-05-10
29	1	3	5	totam perspiciatis fugiat	Eius praesentium temporibus quia amet unde excepturi excepturi quasi. At maiores odit voluptatibus libero. Quasi ullam fugiat soluta velit aut reiciendis eveniet enim sit.\nRepudiandae minus quod blanditiis minima animi. Repellat error iure quam dignissimos dolorum. Sunt odio perferendis mollitia sequi dolores quos quas.\nDolorem nemo fugiat possimus enim molestiae totam. In sapiente harum nobis illo nobis nostrum voluptatem occaecati. Esse suscipit cumque officiis quod ratione omnis in doloremque.	2024-05-12
30	1	1	5	iste est nobis	Tempore repudiandae officiis ducimus quidem perferendis. Cumque aliquam ipsa dolorum. Molestiae debitis magni accusantium voluptas fugiat exercitationem.\n	2024-05-12
31	1	3	5	quidem veritatis amet	Rem dolores ad. Provident voluptate vitae necessitatibus at. Quam nesciunt similique soluta rerum accusantium ea ex assumenda rem.	2024-05-12
32	1	1	12	nostrum accusantium cum	Asperiores asperiores unde delectus voluptatibus totam nobis iste. Odit repellat officia id assumenda quia id temporibus quia odit. Sint hic exercitationem.\n	2024-05-12
33	2	2	5	minima modi corrupti	Corporis minus aperiam tempora nisi facere blanditiis maxime et a. Praesentium eaque eaque mollitia alias atque inventore ipsam. Ea blanditiis eius repudiandae sapiente nesciunt rerum.\nPorro recusandae soluta distinctio nemo. Saepe aliquam expedita debitis blanditiis odit explicabo quia facere. Quas accusantium quod dicta ipsam minima omnis culpa dolor.\nSaepe accusamus qui eum atque sapiente quidem voluptatibus. Incidunt expedita id nam alias aut nobis. In ipsam ipsum vitae dolores aliquam.	2024-06-01
34	1	3	12	minima deserunt tempora	Perspiciatis impedit quis id officiis facilis. Suscipit accusantium et molestiae ipsa harum quod impedit laudantium. Odit iusto nemo.	2024-06-03
35	2	2	15	laudantium quaerat distinctio	Eos temporibus ipsum consequuntur dolor earum porro. Dolor quia ipsam molestiae corrupti labore quos laboriosam alias. Ut ipsa ut fugiat officiis rerum quia 	2024-06-03
36	1	1	12	ad ea iusto	Distinctio magnam magnam veniam vitae veniam commodi velit id. Impedit quo quod perferendis est. Iusto vitae quasi.\nDolore maxime eveniet quis fuga repellendus rem et est. Officiis libero tempora vitae deserunt ab nisi. Ea repellat id necessitatibus.\nSaepe eius aut ipsam quos iusto facere maxime corrupti fugit. Labore laudantium optio. Cupiditate blanditiis recusandae quibusdam necessitatibus reiciendis repellat ad ipsam.	2024-06-03
37	1	1	12	Kopytka	Śniły mi się kopytka. Były bardzo słodkie i pyszne.	2024-11-11
38	1	1	12	Uczta na wesoło	Śniła mi się uczta w restauracji wodnej. Było dużo ryb.	2024-11-11
5	1	3	12	fsg test	It was awefull human	2024-05-08
11	1	1	12	Human Data Executive	Cum cumque occaecati dicta voluptate debitis sequi optio fugiat cumque.	2024-05-08
12	1	2	12	Human Optimization Manager	Fuga laborum placeat corrupti.	2024-05-08
39	1	1	12	kotek	kotek na płotek	2024-11-17
19	3	1	5	Norway	Commodi in sunt.	2024-05-10
40	1	1	12	sen		2024-12-05
41	1	2	12	rrr	ffff	2024-12-05
\.


--
-- TOC entry 3242 (class 0 OID 16409)
-- Dependencies: 202
-- Data for Name: emotion; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.emotion (id, emotion_name) FROM stdin;
1	HAPPY
2	NEUTRAL
3	SAD
\.


--
-- TOC entry 3244 (class 0 OID 16414)
-- Dependencies: 204
-- Data for Name: friend; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.friend (id, user_1_id, user_2_id) FROM stdin;
9	12	5
10	5	12
11	12	13
12	13	12
13	5	13
14	13	5
15	5	10
16	10	5
18	10	12
19	12	10
20	14	12
21	12	14
22	12	15
23	15	12
26	16	12
27	12	16
\.


--
-- TOC entry 3246 (class 0 OID 16419)
-- Dependencies: 206
-- Data for Name: privacy; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.privacy (id, privacy_name) FROM stdin;
1	PUBLIC
2	PRIVATE
3	FOR FRIENDS
\.


--
-- TOC entry 3248 (class 0 OID 16424)
-- Dependencies: 208
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.role (id, role_name) FROM stdin;
2	ROLE_ADMIN
1	ROLE_USER
\.


--
-- TOC entry 3259 (class 0 OID 16558)
-- Dependencies: 219
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.tags (id, name) FROM stdin;
1	jedzenie
2	kopytka
3	słodkie
4	restauracja
5	wesoło
6	słodko
7	sen
\.


--
-- TOC entry 3260 (class 0 OID 24577)
-- Dependencies: 220
-- Data for Name: tags_dream; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.tags_dream (tags_id, dream_id) FROM stdin;
1	37
2	37
3	37
4	38
5	38
6	38
1	38
1	20
7	39
7	40
7	41
1	41
\.


--
-- TOC entry 3250 (class 0 OID 16429)
-- Dependencies: 210
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public."user" (id, detail_id, user_statistics_id, email, roles, password) FROM stdin;
10	10	9	new@new.pl	["ROLE_USER"]	$2y$13$HA/Ol2ZBh50DhUNt7.hxlO2xDVJsxWmiAluI3JN9r0lwVktBaCS/u
12	12	11	user@user.pl	["ROLE_USER"]	$2y$13$P5Auv2LMNdoCa6IFa0AmQOAi2ha7lLmVg7x4q45JeEj1FD.JEJDp.
13	13	12	k@k.pl	["ROLE_USER"]	$2y$13$GfV1xe7DRyyQ8h39SrD/bO0YQTJsx2wfezkmgtNT6BVPZpIM3ZTEK
14	14	13	email@email.com	["ROLE_USER"]	$2y$13$FWAM0kfwZNz.2siNoqJIkeDz.FV042aaKk2ohWxipQ16svEOiwJuO
15	15	14	r@r.pl	["ROLE_USER"]	$2y$13$Qz9e2rD1YXczdA7WB.j5JuzPQu/BqpbHC2T52J0UH1UjDJVAyux5m
16	16	15	adrian.rybak@dreamly.com	["ROLE_USER"]	$2y$13$iOuMSoEKHswUsn.3zA4WmeG66mriEiqOYRaP6/F0k5gzIl22GBcyC
5	5	4	admin@admin.pl	["ROLE_ADMIN"]	$2y$13$P5Auv2LMNdoCa6IFa0AmQOAi2ha7lLmVg7x4q45JeEj1FD.JEJDp.
\.


--
-- TOC entry 3251 (class 0 OID 16435)
-- Dependencies: 211
-- Data for Name: user_detail; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.user_detail (id, name, surname, photo) FROM stdin;
10	new	w	https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y
12	User	User	https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y
13	Reginald	Frami	https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y
14	Betty	Runte	https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y
15	R	R	https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y
5	John	Smith	https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y
16	Adrian	Rybak	https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y
\.


--
-- TOC entry 3254 (class 0 OID 16446)
-- Dependencies: 214
-- Data for Name: user_like; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.user_like (id, dream_id, owner_id, like_date) FROM stdin;
34	20	12	2024-05-30
38	22	12	2024-05-30
41	31	12	2024-05-30
42	19	12	2024-05-30
43	2	5	2024-06-01
49	5	12	2024-06-03
50	30	12	2024-10-09
51	2	12	2024-10-09
52	36	12	2024-11-10
56	29	12	2024-11-17
58	21	12	2024-12-05
\.


--
-- TOC entry 3256 (class 0 OID 16451)
-- Dependencies: 216
-- Data for Name: user_statistic; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.user_statistic (id, dreams_amount, like_amount, comments_amount) FROM stdin;
9	0	0	0
13	0	0	0
12	0	0	0
4	12	1	10
14	1	0	0
15	0	0	0
11	19	10	6
\.


--
-- TOC entry 3267 (class 0 OID 0)
-- Dependencies: 198
-- Name: comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.comment_id_seq', 22, true);


--
-- TOC entry 3268 (class 0 OID 0)
-- Dependencies: 201
-- Name: dream_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.dream_id_seq', 41, true);


--
-- TOC entry 3269 (class 0 OID 0)
-- Dependencies: 203
-- Name: emotion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.emotion_id_seq', 3, true);


--
-- TOC entry 3270 (class 0 OID 0)
-- Dependencies: 205
-- Name: friend_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.friend_id_seq', 31, true);


--
-- TOC entry 3271 (class 0 OID 0)
-- Dependencies: 207
-- Name: privacy_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.privacy_id_seq', 2, true);


--
-- TOC entry 3272 (class 0 OID 0)
-- Dependencies: 209
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.role_id_seq', 2, true);


--
-- TOC entry 3273 (class 0 OID 0)
-- Dependencies: 218
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.tags_id_seq', 7, true);


--
-- TOC entry 3274 (class 0 OID 0)
-- Dependencies: 212
-- Name: user_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.user_detail_id_seq', 16, true);


--
-- TOC entry 3275 (class 0 OID 0)
-- Dependencies: 213
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.user_id_seq', 16, true);


--
-- TOC entry 3276 (class 0 OID 0)
-- Dependencies: 215
-- Name: user_like_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.user_like_id_seq', 58, true);


--
-- TOC entry 3277 (class 0 OID 0)
-- Dependencies: 217
-- Name: user_statistic_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.user_statistic_id_seq', 15, true);


--
-- TOC entry 3060 (class 2606 OID 16457)
-- Name: comment comment_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT comment_pkey PRIMARY KEY (id);


--
-- TOC entry 3064 (class 2606 OID 16459)
-- Name: doctrine_migration_versions doctrine_migration_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.doctrine_migration_versions
    ADD CONSTRAINT doctrine_migration_versions_pkey PRIMARY KEY (version);


--
-- TOC entry 3066 (class 2606 OID 16461)
-- Name: dream dream_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.dream
    ADD CONSTRAINT dream_pkey PRIMARY KEY (id);


--
-- TOC entry 3071 (class 2606 OID 16463)
-- Name: emotion emotion_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.emotion
    ADD CONSTRAINT emotion_pkey PRIMARY KEY (id);


--
-- TOC entry 3073 (class 2606 OID 16465)
-- Name: friend friend_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.friend
    ADD CONSTRAINT friend_pkey PRIMARY KEY (id);


--
-- TOC entry 3077 (class 2606 OID 16467)
-- Name: privacy privacy_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.privacy
    ADD CONSTRAINT privacy_pkey PRIMARY KEY (id);


--
-- TOC entry 3079 (class 2606 OID 16469)
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- TOC entry 3098 (class 2606 OID 24581)
-- Name: tags_dream tags_dream_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tags_dream
    ADD CONSTRAINT tags_dream_pkey PRIMARY KEY (tags_id, dream_id);


--
-- TOC entry 3094 (class 2606 OID 16562)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 3086 (class 2606 OID 16471)
-- Name: user_detail user_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.user_detail
    ADD CONSTRAINT user_detail_pkey PRIMARY KEY (id);


--
-- TOC entry 3090 (class 2606 OID 16473)
-- Name: user_like user_like_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.user_like
    ADD CONSTRAINT user_like_pkey PRIMARY KEY (id);


--
-- TOC entry 3084 (class 2606 OID 16475)
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- TOC entry 3092 (class 2606 OID 16477)
-- Name: user_statistic user_statistic_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.user_statistic
    ADD CONSTRAINT user_statistic_pkey PRIMARY KEY (id);


--
-- TOC entry 3095 (class 1259 OID 24582)
-- Name: idx_13bf6178d7b4fb4; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_13bf6178d7b4fb4 ON public.tags_dream USING btree (tags_id);


--
-- TOC entry 3096 (class 1259 OID 24583)
-- Name: idx_13bf617e65343c2; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_13bf617e65343c2 ON public.tags_dream USING btree (dream_id);


--
-- TOC entry 3074 (class 1259 OID 16478)
-- Name: idx_55eeac618a521033; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_55eeac618a521033 ON public.friend USING btree (user_1_id);


--
-- TOC entry 3075 (class 1259 OID 16479)
-- Name: idx_55eeac6198e7bfdd; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_55eeac6198e7bfdd ON public.friend USING btree (user_2_id);


--
-- TOC entry 3067 (class 1259 OID 16480)
-- Name: idx_6a5f004f19877a6a; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_6a5f004f19877a6a ON public.dream USING btree (privacy_id);


--
-- TOC entry 3068 (class 1259 OID 16481)
-- Name: idx_6a5f004f1ee4a582; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_6a5f004f1ee4a582 ON public.dream USING btree (emotion_id);


--
-- TOC entry 3069 (class 1259 OID 16482)
-- Name: idx_6a5f004f7e3c61f9; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_6a5f004f7e3c61f9 ON public.dream USING btree (owner_id);


--
-- TOC entry 3061 (class 1259 OID 16483)
-- Name: idx_9474526c7e3c61f9; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_9474526c7e3c61f9 ON public.comment USING btree (owner_id);


--
-- TOC entry 3062 (class 1259 OID 16484)
-- Name: idx_9474526ce65343c2; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_9474526ce65343c2 ON public.comment USING btree (dream_id);


--
-- TOC entry 3087 (class 1259 OID 16485)
-- Name: idx_d6e20c7a7e3c61f9; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_d6e20c7a7e3c61f9 ON public.user_like USING btree (owner_id);


--
-- TOC entry 3088 (class 1259 OID 16486)
-- Name: idx_d6e20c7ae65343c2; Type: INDEX; Schema: public; Owner: user
--

CREATE INDEX idx_d6e20c7ae65343c2 ON public.user_like USING btree (dream_id);


--
-- TOC entry 3080 (class 1259 OID 16487)
-- Name: uniq_8d93d64974ab38e2; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX uniq_8d93d64974ab38e2 ON public."user" USING btree (user_statistics_id);


--
-- TOC entry 3081 (class 1259 OID 16488)
-- Name: uniq_8d93d649d8d003bb; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX uniq_8d93d649d8d003bb ON public."user" USING btree (detail_id);


--
-- TOC entry 3082 (class 1259 OID 16489)
-- Name: uniq_identifier_email; Type: INDEX; Schema: public; Owner: user
--

CREATE UNIQUE INDEX uniq_identifier_email ON public."user" USING btree (email);


--
-- TOC entry 3112 (class 2620 OID 16490)
-- Name: comment trg_comment_delete; Type: TRIGGER; Schema: public; Owner: user
--

CREATE TRIGGER trg_comment_delete AFTER DELETE ON public.comment FOR EACH ROW EXECUTE PROCEDURE public.update_user_statistic_on_delete_comment();


--
-- TOC entry 3113 (class 2620 OID 16491)
-- Name: comment trg_comment_insert; Type: TRIGGER; Schema: public; Owner: user
--

CREATE TRIGGER trg_comment_insert AFTER INSERT ON public.comment FOR EACH ROW EXECUTE PROCEDURE public.update_user_statistic_on_insert_comment();


--
-- TOC entry 3114 (class 2620 OID 16492)
-- Name: user_like trg_user_like_delete; Type: TRIGGER; Schema: public; Owner: user
--

CREATE TRIGGER trg_user_like_delete AFTER DELETE ON public.user_like FOR EACH ROW EXECUTE PROCEDURE public.update_user_statistic_on_delete();


--
-- TOC entry 3115 (class 2620 OID 16493)
-- Name: user_like trg_user_like_insert; Type: TRIGGER; Schema: public; Owner: user
--

CREATE TRIGGER trg_user_like_insert AFTER INSERT ON public.user_like FOR EACH ROW EXECUTE PROCEDURE public.update_user_statistic_on_insert();


--
-- TOC entry 3110 (class 2606 OID 24584)
-- Name: tags_dream fk_13bf6178d7b4fb4; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tags_dream
    ADD CONSTRAINT fk_13bf6178d7b4fb4 FOREIGN KEY (tags_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- TOC entry 3111 (class 2606 OID 24589)
-- Name: tags_dream fk_13bf617e65343c2; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.tags_dream
    ADD CONSTRAINT fk_13bf617e65343c2 FOREIGN KEY (dream_id) REFERENCES public.dream(id) ON DELETE CASCADE;


--
-- TOC entry 3104 (class 2606 OID 16573)
-- Name: friend fk_55eeac618a521033; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.friend
    ADD CONSTRAINT fk_55eeac618a521033 FOREIGN KEY (user_1_id) REFERENCES public."user"(id);


--
-- TOC entry 3105 (class 2606 OID 16578)
-- Name: friend fk_55eeac6198e7bfdd; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.friend
    ADD CONSTRAINT fk_55eeac6198e7bfdd FOREIGN KEY (user_2_id) REFERENCES public."user"(id);


--
-- TOC entry 3101 (class 2606 OID 16504)
-- Name: dream fk_6a5f004f19877a6a; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.dream
    ADD CONSTRAINT fk_6a5f004f19877a6a FOREIGN KEY (privacy_id) REFERENCES public.privacy(id);


--
-- TOC entry 3102 (class 2606 OID 16509)
-- Name: dream fk_6a5f004f1ee4a582; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.dream
    ADD CONSTRAINT fk_6a5f004f1ee4a582 FOREIGN KEY (emotion_id) REFERENCES public.emotion(id);


--
-- TOC entry 3103 (class 2606 OID 16514)
-- Name: dream fk_6a5f004f7e3c61f9; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.dream
    ADD CONSTRAINT fk_6a5f004f7e3c61f9 FOREIGN KEY (owner_id) REFERENCES public."user"(id);


--
-- TOC entry 3106 (class 2606 OID 16519)
-- Name: user fk_8d93d64974ab38e2; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT fk_8d93d64974ab38e2 FOREIGN KEY (user_statistics_id) REFERENCES public.user_statistic(id);


--
-- TOC entry 3107 (class 2606 OID 16524)
-- Name: user fk_8d93d649d8d003bb; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT fk_8d93d649d8d003bb FOREIGN KEY (detail_id) REFERENCES public.user_detail(id);


--
-- TOC entry 3099 (class 2606 OID 16529)
-- Name: comment fk_9474526c7e3c61f9; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT fk_9474526c7e3c61f9 FOREIGN KEY (owner_id) REFERENCES public."user"(id);


--
-- TOC entry 3100 (class 2606 OID 16534)
-- Name: comment fk_9474526ce65343c2; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.comment
    ADD CONSTRAINT fk_9474526ce65343c2 FOREIGN KEY (dream_id) REFERENCES public.dream(id);


--
-- TOC entry 3108 (class 2606 OID 16539)
-- Name: user_like fk_d6e20c7a7e3c61f9; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.user_like
    ADD CONSTRAINT fk_d6e20c7a7e3c61f9 FOREIGN KEY (owner_id) REFERENCES public."user"(id);


--
-- TOC entry 3109 (class 2606 OID 16544)
-- Name: user_like fk_d6e20c7ae65343c2; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.user_like
    ADD CONSTRAINT fk_d6e20c7ae65343c2 FOREIGN KEY (dream_id) REFERENCES public.dream(id);


-- Completed on 2024-12-19 20:57:20 UTC

--
-- PostgreSQL database dump complete
--

