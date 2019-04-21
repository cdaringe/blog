---
title: "secure data with row-level security, not with application code"
slug: "secure-data-service-thru-rls"
date: "2019-04-21T00:50:56.000Z"
featured: false
draft: false
tags: ["programming", "linux", "web", "server"]
# cssFiles: ['index.css']
---

securing applications is hard. engineers must consider a diverse set of
concerns when building & delivering systems that handle sensitive data.  a cursory glance over the
[OWASP Top 10](https://www.owasp.org/images/7/72/OWASP_Top_10-2017_%28en%29.pdf.pdf)
reveals that securing an application against the top 10 risks is not
a matter of "installing this" or "turning this feature on"--rather, securing
an application involves auditing and considering design patterns employed
to exchange information. shortly, i will discuss how row-level security (rls)
can drastically improve part of an application's data-security story.

## it's easy to fail.

really easy.

we haven't made our technical lives much easier on some of these fronts.
let's focus on just _one_ of the OWASP risks, broken access control.  two of the many
possible side-effects of bad access control is exposure of data and
undesired mutation of data.  historically, software engineering teams have:

- protected against these risks at the application level, not at the data level
- tested data security manually, not via automation

bummer. so what does bad access control look like in practice?
here are some potential snippets:

```python
router.route("/api/person?fields=birthday", handler)
# ^ whoops, can anyone query everyone's birthday?

@authenticated(roles="member")
router.route("/api/person?fields=birthday", handler)
# ^ whoops, this may limit who can access the data to memebrs,
# but did enforcing authentication fix the risk of over-exposure?

# handler.py - option 1
def handler():
  return psycopg.query("select birthday from persons")
  # ^ whoops, we're still exposing everyone's birthday, even if the user
  #   is an authenticated member. authorization is still broken

# handler.py - option 2
def handler():
  return psycopg.query("""
    select birthday from persons
    where <developer-writes-condition-he-thinks-is-safe>
  """)
```

our data layers often have a custom language or DSL to get at data--SQL, NoSQL, text files, etc--making
our interface to our datas brittle.  in `handler.py - option 2`,
the condition of `<developer-writes-condition-he-thinks-is-safe>` really _is not always robust_.
to keep focus, i'll leave it as an exercise to the reader to reason about how/why this
may be. fwiw, it's subjective, but i'm hand-waving it to avoid a rabbit hole.

regardless, in just a few lines of code, we saw a variety of places were developers may
have easily exposed data.  it's worth noting that there are layers in our applications,
large call stacks separating our entrypoints from our data resolvers, often making
validation of the resultant queries difficult. the
`@authenticated` decorator could feasibly give a false positive to junior
developers, implying that this data flow is "secure", when--as discussed before--there
is much more to securing a service than meets the eye.

this example was purely a hypothetical mechanism for the failure.  make no
mistake, it appears that these types of [security leaks are rampant](https://www.researchgate.net/publication/328956656_Quantitative_Assessment_on_Broken_Access_Control_Vulnerability_in_Web_Applications)
on the open web. we found such a leak at the office just two weeks ago from a team
of expert and respected engineers.  broken access control is challenging, and it's real.

## rls to the rescue

rls let's you protect your data records _within_ the db. until recently,
database access models did not support access constraints at the record level--constraints
were generally available at every higher level resource.  this means that you could set RBAC
roles for a query, but if a user was querying say the `persons` tables, she'd
have access to _all persons_, which is problematic as demonstrated in our above snippets.

"so row-level security is going to save the day?"

pretty much.  what i'm hear to say is that rls is a _really good idea_, and you ought
consider it @ design time.

if i can get you to [click this postgres rls link](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
and expose you to the concept, that alone is a big win.

## rls in practice

let's walk through an example. you can also complete this exercise whilst
following along with the [super-commerce](https://github.com/cdaringe/super-commerce)
codebase. feel free to clone it down, execute it, and tinker as we read through it below.

here's the plan. we will:

1. create tables to hold application data
1. protect the sensitive data using rls
1. create some seed data and load everything into a database
1. test that rls is working per expectation, and reflect on our design
1. write a tiny application that integrates with the db just for kicks

### create tables

our app will have customers that can make purchases of items
from a store.

```sql
create table items (
  id serial unique,
  name varchar
);
create table customers (
  id serial unique,
  first_name varchar
);
create table purchases (
  id serial,
  item_id int  not null references items (id),
  customer_id int  not null references customers (id)
);
```

```
postgres=# \d purchases
                               Table "public.purchases"
   Column    |  Type   | Collation | Nullable |                Default
-------------+---------+-----------+----------+---------------------------------------
 id          | integer |           | not null | nextval('purchases_id_seq'::regclass)
 item_id     | integer |           | not null |
 customer_id | integer |           | not null |
Foreign-key constraints:
    "purchases_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES customers(id)
    "purchases_item_id_fkey" FOREIGN KEY (item_id) REFERENCES items(id)
```

all looks correct!

### protect sensitive data

it's probably ok for everyone to see all of the `items` in the database. we want
people to be able to buy everything at the store! however,

- a customer should only be able to view her customer record, but no one elses' customer records
- a customer should only be able to view his purchases, but no one elses' purchase records

thus, let us apply rls on those two tables:

```sql
-- we 1st need a non-super-user role for our app
create user commerce;

-- the following statements are the core of what
-- we need to have rock solid, high perf rls!
alter table customers enable row level security;
alter table purchases enable row level security;

create policy customers_crud on customers
	using (id = get_commerce_user_id());
  -- allow the customer to read and update her record.
  -- in our demo, the commerce_user_id is passed into
  -- the query context via postgres config.
  -- more on that later!

create policy purchases_crud on purchases
	using (customer_id = get_commerce_user_id())
	with check (is_admin());
  -- allow the customer to read his purchase records,
  -- but only allow an admins to edit/create records.
```

you may have noticed the two functions `is_admin()` and
`get_commerce_user_id()`.  you can view these defined in the
appendix at the end of the post. omitted for brevity.

### seed the database

```sql
insert into items (name) values
  ('nintendo64'),
  ('pizza'),
  ('cacao-nibs'),
  ('fancy-water');

insert into customers (first_name) values
  ('c-bear'),
  ('jamal'),
  ('jessica'),
  ('chaz');

insert into purchases (customer_id, item_id) values
  (1, 4),
  (1, 2), -- now that's a meal, c-bear! pizza & la croix. #hipster
  (2, 1), -- mario 64, great game. enjoy, jamal!
  (3, 3), -- tasty nibs for jessica
  (4, 3); -- tasty nibs for chaz
```

![](./c-bear.jpg)
<small style='display: block;width:100%;text-align: center;'>[c-bear](https://en.wikipedia.org/wiki/C_Bear_and_Jamal), great guy</small>

### test it out & reflect on our design
 
now that we have data loaded in, let's test if rls is _really_
protecting our datas.  let's log into the database with our
non-super role:

```
$ psql --host localhost -p 5432 --username=commerce postgres
```

now, let's try and access all of the records in each table:

```
postgres=> select * from customers;
 id | first_name
----+------------
(0 rows)

postgres=> select * from purchases;
 id | item_id | customer_id
----+---------+-------------
(0 rows)

postgres=> select * from items;
 id |    name
----+-------------
  1 | nintendo64
  2 | pizza
  3 | cacao-nibs
  4 | fancy-water
(4 rows)
```

good!  we see items, but because the session has no `user_id` set,
the protected `customers` & `purchases` queries yielded no resuts.

what if we set a `user_id` and run our queries again
with the user `c-bear` configured?  i
know `c-bear` has `id === 1` just by inference based on seed data insert order.
more commonly, a user id would be provided by an identity provider,
auth service, oauth thingy, jwt, or perhaps even provided by
the same database. for the purposes of demonstration, it doesn't
matter where the `user_id` comes from--it just matters that
all parts of the application/system have a common way to reference
users.

```
postgres=> select set_config('commerce.user_id', '1', false);
 set_config
------------
 1
(1 row)
```

```
postgres=> select * from purchases;
 id | item_id | customer_id
----+---------+-------------
  1 |       4 |           1 -- c-bear's fancy-water
  2 |       2 |           1 -- c-bear's pizza
(2 rows)

postgres=> select * from customers;
 id | first_name
----+------------
  1 | c-bear
(1 row)
```

this is awesome! now we see records that belong just to `c-bear`.

to summarize, by default, we saw that our queries
yielded no data.  safety first!  once we specified the
user as c-bear, we saw _only_ his data. we observed the rls
policies active in _all queries_.  we saw no data leak
through for jamal, jessica, or chaz anywhere, anytime.

**it would be moderately difficult for application code to mess up this access control model**.
app code simply need provide a user, and the db handles the rest.
there's no rich (:cough: *risky*) conditional control
flows dictating resultant data sets--just flat conditionals at the record level.
i concede that _it is feasible_ to mess up configuring rls policies to begin with.
i argue, however, that if culturally a team sets a precedence
that data is secured at the database level, it's intuitive for
engineers to see & expect policies in migrations and in table defintions
(re: `\d <table-name>`) when using the application. further, policies intrinsically
tend to be much more robust than application code.  policies are often type-checked,
cross-referenced against database columns at migration time, and are low-logic (read: simple).
thus, engineers have _some_ positive data points suggesting robustness is acheived.
**auditing
table policies is also much easier than auditing application
code for security patterns**.  policies may be reviewed almost by simply scanning
a table+policy list.  auditing application code takes creativity and control flow
traversals involving possibly many files, not quite a flat list!

## appendix

### postgres auth functions

```sql
create function is_admin() returns bool as $$
	select
		case
		when current_setting('commerce.is_admin', true) = 'true'
			then true
		else
			false
		end;
$$ language sql stable security definer;

create function get_commerce_user_id() returns int as $$
	declare
		user_id_str varchar;
	begin
		user_id_str := current_setting('commerce.user_id', true);
		if user_id_str is null or user_id_str = '' then
			return 0; -- postgres serial ids start a 1
		end if;
		return user_id_str::int;
	end;
$$ language plpgsql stable security definer;
```